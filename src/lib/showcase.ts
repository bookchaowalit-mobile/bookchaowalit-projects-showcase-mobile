import {
  PROJECT_CATEGORIES,
  type ProjectCategory,
  type RelatedProject,
} from './catalog';

export type ShowcaseItem = RelatedProject & {
  categoryId: string;
  category: string;
};

/** Flatten the catalog into items tagged with their category. */
export function flatten(
  catalog: ProjectCategory[] = PROJECT_CATEGORIES,
): ShowcaseItem[] {
  return catalog.flatMap(c =>
    c.projects.map(p => ({...p, categoryId: c.id, category: c.label})),
  );
}

/**
 * Search key: accents folded ("Émoji" → "emoji"), full-width folded, any
 * letter or digit kept. Stripping everything outside a–z used to turn a Thai
 * or other non-Latin query into "", which matched every project.
 */
function normalize(text: string): string {
  return text
    .normalize('NFKD')
    // Only Latin combining diacritics: Thai vowel/tone marks are letters' parts.
    .replace(/[\u0300-\u036f]+/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .trim();
}

/**
 * Filter by category (null = all) and a query where every word must appear in
 * the name, slug or category. Name-prefix matches sort first, then A–Z.
 */
export function searchShowcase(
  items: ShowcaseItem[],
  query: string,
  categoryId: string | null = null,
): ShowcaseItem[] {
  const terms = normalize(query).split(' ').filter(Boolean);
  const q = normalize(query);
  return items
    .filter(item => !categoryId || item.categoryId === categoryId)
    .filter(item => {
      const haystack = normalize(`${item.name} ${item.slug} ${item.category}`);
      return terms.every(term => haystack.includes(term));
    })
    .sort((a, b) => {
      const ap = q && normalize(a.name).startsWith(q) ? 0 : 1;
      const bp = q && normalize(b.name).startsWith(q) ? 0 : 1;
      return ap - bp || a.name.localeCompare(b.name);
    });
}

/** Number of projects per category, in catalog order. */
export function categoryCounts(
  catalog: ProjectCategory[] = PROJECT_CATEGORIES,
): {id: string; label: string; count: number}[] {
  return catalog.map(c => ({
    id: c.id,
    label: c.label,
    count: c.projects.length,
  }));
}

/** Pick one item; `random` is injectable for tests. Returns null for an empty list. */
export function pickRandom<T>(
  items: T[],
  random: () => number = Math.random,
): T | null {
  if (items.length === 0) {
    return null;
  }
  const index = Math.min(items.length - 1, Math.floor(random() * items.length));
  return items[index];
}

/** Adds or removes a project slug from the favourites list. */
export function toggleFavorite(slugs: string[], slug: string): string[] {
  return slugs.includes(slug)
    ? slugs.filter(s => s !== slug)
    : [...slugs, slug];
}

/** Keeps only favourited items (order of `items` is preserved). */
export function onlyFavorites(
  items: ShowcaseItem[],
  slugs: string[],
): ShowcaseItem[] {
  const set = new Set(slugs);
  return items.filter(item => set.has(item.slug));
}
