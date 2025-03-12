
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define cors headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get OpenAI API key from environment variables
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    // For now, we'll simulate fetching document content
    // In a real implementation, you would download and parse the documents
    const documentContents = await Promise.all(
      documentUrls.map(async (url, index) => {
        // Here you would implement actual document downloading and parsing
        // For now, we create a placeholder content based on the URL
        const fileName = url.split('/').pop() || `document-${index + 1}`;
        return `Document: ${fileName}\nThis is a simulated content for ${fileName}`;
      })
    );

    // Combine all document contents
    const combinedContent = documentContents.join('\n\n');
    
    // Create the prompt for OpenAI
    let prompt = "Bitte analysiere die folgenden Ausschreibungsdokumente und extrahiere die wichtigsten Informationen:";
    
    if (customPrompt) {
      prompt += `\n\nBitte beantworte speziell diese Fragen:\n${customPrompt}`;
    }
    
    prompt += `\n\nDokumente:\n${combinedContent}`;
    
    // Trim the prompt if it's too long for the API
    // OpenAI has token limits, so in a real implementation, you might need to chunk or summarize first
    const maxLength = 4000;
    const trimmedPrompt = prompt.length > maxLength ? 
      prompt.substring(0, maxLength) + "...[content truncated due to length]" : 
      prompt;

    console.log("Sending request to OpenAI API");
    
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
