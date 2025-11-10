'use client';

import { FormEvent } from "react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  loading?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  loading,
}: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-zinc-200 bg-white px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-zinc-900"
    >
      <input
        type="text"
        value={value}
        disabled={loading}
        onChange={(event) => onChange(event.target.value)}
        placeholder="“123 Main St Boston — zoning + GIS info”"
        className="flex-1 border-none bg-transparent px-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {loading ? "Searching…" : "Search"}
        {!loading && (
          <span aria-hidden className="text-lg">
            ↵
          </span>
        )}
      </button>
    </form>
  );
}
