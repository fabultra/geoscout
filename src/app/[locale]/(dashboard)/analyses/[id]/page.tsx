export default function AnalysisDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Analysis {params.id}</h1>
    </div>
  );
}
