type SummaryBoxProps = {
  summary?: string;
};

export function SummaryBox({ summary }: SummaryBoxProps) {
  if (!summary) return null;

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-base leading-relaxed text-zinc-700">{summary}</p>
    </section>
  );
}
