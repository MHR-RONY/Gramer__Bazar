import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIES_KEY = "gb_categories_v1";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
};

const readCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as Category[]) : [];
  } catch {
    return [];
  }
};

const writeCategories = (items: Category[]) => {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategories(readCategories());
  }, []);

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Category name is required");
      return;
    }

    const slug = toSlug(trimmed);
    if (!slug) {
      setError("Category name must contain letters or numbers");
      return;
    }

    const exists = categories.some((c) => c.slug === slug);
    if (exists) {
      setError("A category with this name already exists");
      return;
    }

    const next: Category = {
      id: `${Date.now()}`,
      name: trimmed,
      slug,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [next, ...categories];
    setCategories(updated);
    writeCategories(updated);
    setName("");
    setDescription("");
    setError(null);
  };

  const handleDelete = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    writeCategories(updated);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Category Management</h1>
            <p className="mt-1 text-xs text-ink-muted sm:text-sm">
              Create and manage product categories locally (frontend-only preview).
            </p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
          {/* Create form */}
          <article className="rounded-2xl border bg-card p-4 sm:p-5">
            <h2 className="text-sm font-extrabold tracking-tight sm:text-base">Create new category</h2>
            <p className="mt-1 text-xs text-ink-muted">
              Only lives in your browser for now – perfect for testing structure and flows.
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <label className="text-xs font-semibold text-foreground">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Organic Oil, Honey, Snacks"
                  className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm"
                  maxLength={80}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description to explain what goes under this category."
                  className="mt-1 min-h-[72px] w-full rounded-md border bg-background px-3 py-2 text-sm"
                  maxLength={240}
                />
              </div>

              {name.trim() && (
                <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                  Slug preview: <span className="font-mono font-semibold text-foreground">{toSlug(name) || "-"}</span>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                  {error}
                </div>
              )}

              <Button type="button" className="mt-1 w-full sm:w-auto" onClick={handleCreate}>
                Create category
              </Button>
            </div>
          </article>

          {/* List */}
          <article className="rounded-2xl border bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-extrabold tracking-tight sm:text-base">Existing categories</h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Stored in localStorage under <code className="font-mono text-[10px]">gb_categories_v1</code>.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              {categories.length === 0 ? (
                <div className="rounded-xl border bg-surface-2/60 p-4 text-xs text-ink-muted">
                  No categories yet. Create your first one from the form on the left.
                </div>
              ) : (
                <ul className="space-y-3">
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-start justify-between gap-3 rounded-xl border bg-surface-2/60 p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-foreground">{c.name}</div>
                        <div className="mt-0.5 text-[11px] font-mono text-ink-muted">/{c.slug}</div>
                        {c.description ? (
                          <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{c.description}</p>
                        ) : null}
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] text-ink-muted">
                          {new Date(c.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2 text-[11px]"
                          onClick={() => handleDelete(c.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default CategoryPage;
