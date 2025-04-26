
import { Layout } from "@/components/layout/Layout";

export function MilestoneDetailLoading() {
  return (
    <Layout title="Meilenstein wird geladen...">
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </Layout>
  );
}
