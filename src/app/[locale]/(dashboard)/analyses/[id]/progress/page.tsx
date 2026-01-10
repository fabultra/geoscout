export default function AnalysisProgressPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Analysis Progress {params.id}</h1>
    </div>
  );
}
