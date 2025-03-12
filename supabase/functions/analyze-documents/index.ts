
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { parse as parsePdf } from "https://deno.land/x/pdfparser@v1.0.1/mod.ts";

// Define cors headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Helper function to check if a URL is a PDF
function isPDF(url: string): boolean {
  return url.toLowerCase().endsWith('.pdf');
}

// Helper function to extract text from a PDF file
async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  try {
    console.log(`Fetching PDF from: ${pdfUrl}`);
    
    // Download the PDF content
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    // Get the PDF as ArrayBuffer
    const pdfData = await response.arrayBuffer();
    
    // Parse the PDF using pdfparser
    console.log("Parsing PDF content...");
    try {
      const pdfContent = await parsePdf(new Uint8Array(pdfData));
      if (!pdfContent || !pdfContent.text) {
        console.warn("PDF parsing returned empty or invalid content");
        return `[PDF Document: ${pdfUrl.split('/').pop()} - Extracted content is empty. The PDF may be scanned or contain only images.]`;
      }
      
      // Return the extracted text, limiting length to avoid token limits
      const extractedText = pdfContent.text.trim();
      console.log(`Extracted ${extractedText.length} characters from PDF`);
      
      if (extractedText.length > 15000) {
        return extractedText.substring(0, 15000) + "... [content truncated due to length]";
      }
      
      return extractedText;
    } catch (pdfError) {
      console.error("Error during PDF parsing:", pdfError);
      // Fallback method if PDF parsing fails
      return `[PDF Document: ${pdfUrl.split('/').pop()} - Could not extract content: ${pdfError.message}]`;
    }
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return `[Failed to extract content from PDF: ${pdfUrl}]`;
  }
}

// Helper function to get the content of a document
async function getDocumentContent(url: string): Promise<string> {
  try {
    console.log(`Processing document: ${url}`);
    
    // Check if it's a PDF
    if (isPDF(url)) {
      return await extractTextFromPDF(url);
    }
    
    // For other file types, download and extract plain text if possible
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    const fileName = url.split('/').pop() || 'document';
    
    // Handle different content types
    if (contentType.includes('text/')) {
      // For text files, get the text content
      const text = await response.text();
      return text.substring(0, 10000); // Limit text size
    } else if (contentType.includes('application/json')) {
      // For JSON files
      const json = await response.json();
      return JSON.stringify(json, null, 2).substring(0, 10000);
    } else {
      // For other file types, return a summary with the file type and size
      const contentLength = response.headers.get('content-length') || 'unknown size';
      return `[Document: ${fileName} (${contentType}, ${contentLength} bytes). Cannot extract detailed content from this file type.]`;
    }
    
  } catch (error) {
    console.error('Error getting document content:', error);
    return `[Failed to get content from: ${url}]`;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { documentUrls, customPrompt } = await req.json();

    if (!documentUrls || !Array.isArray(documentUrls) || documentUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: documentUrls is required and must be a non-empty array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing ${documentUrls.length} documents`);
    console.log(`Custom prompt provided: ${customPrompt ? 'Yes' : 'No'}`);
    
    if (customPrompt) {
      console.log(`Custom prompt: ${customPrompt.substring(0, 100)}...`);
    }

    // Fetch document content in parallel
    const documentContents = await Promise.all(
      documentUrls.map(async (url: string) => {
        const fileName = url.split('/').pop() || 'document';
        const content = await getDocumentContent(url);
        return `Document: ${fileName}\n${content}`;
      })
    );

    // Combine all document contents
    const combinedContent = documentContents.join('\n\n');
    
    // Create the prompt for OpenAI
    let prompt = "Bitte analysiere die folgenden Ausschreibungsdokumente und extrahiere die wichtigsten Informationen:";
    
    if (customPrompt) {
      prompt = customPrompt;
    }
    
    prompt += `\n\nDokumente:\n${combinedContent}`;
    
    // Trim the prompt if it's too long for the API
    // OpenAI has token limits, so in a real implementation, you might need to chunk or summarize first
    const maxLength = 15000;
    const trimmedPrompt = prompt.length > maxLength ? 
      prompt.substring(0, maxLength) + "...[content truncated due to length]" : 
      prompt;

    console.log("Sending request to OpenAI API");
    console.log(`Total content length: ${prompt.length} characters, trimmed to ${trimmedPrompt.length}`);
    
    // Call the OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using a modern, cost-effective model
        messages: [
          {
            role: 'system',
            content: 'Du bist ein KI-Assistent, der spezialisiert ist auf die Analyse von Ausschreibungsdokumenten. Extrahiere relevante Informationen und liefere eine strukturierte Zusammenfassung.'
          },
          {
            role: 'user',
            content: trimmedPrompt
          }
        ],
        temperature: 0.5 // Balance between creativity and precision
      })
    });

    // Process the OpenAI response
    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const openAIData = await openAIResponse.json();
    const analysis = openAIData.choices[0].message.content;

    console.log("Analysis completed successfully");

    // Return the analysis result
    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-documents function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
