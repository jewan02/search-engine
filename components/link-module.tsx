import type { ResourceLink, ResourceCategory } from "@/types/search";

type LinkModuleProps = {
  title: ResourceCategory;
  items?: ResourceLink[];
};

export function LinkModule({ title, items }: LinkModuleProps) {
  if (!items?.length) return null;

  return (
    <section className="flex h-full flex-col gap-3 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </div>
      <ul className="flex flex-1 flex-col gap-3 text-sm">
        {items.map((item) => (
          <li key={item.url}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-1 rounded-2xl border border-zinc-100 px-3 py-2 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              <span className="font-medium text-zinc-900">{item.title}</span>
              {item.description && (
                <span className="text-xs text-zinc-500">{item.description}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
