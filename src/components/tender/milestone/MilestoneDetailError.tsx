
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MilestoneDetailErrorProps {
  error: string;
  tenderId?: string;
}

export function MilestoneDetailError({ error, tenderId }: MilestoneDetailErrorProps) {
  return (
    <Layout title="Fehler">
      <Card className="mt-10 mx-auto max-w-xl text-center">
        <CardHeader>
          <CardTitle>Fehler beim Laden des Meilensteins</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || "Ein unerwarteter Fehler ist aufgetreten"}</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to={`/tenders/${tenderId}`}>Zurück zur Ausschreibung</Link>
          </Button>
        </CardContent>
      </Card>
    </Layout>
  );
}
