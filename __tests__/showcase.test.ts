import {PROJECT_CATEGORIES, projectHost} from '../src/lib/catalog';
import {
  categoryCounts,
  flatten,
  pickRandom,
  searchShowcase,
} from '../src/lib/showcase';

const catalog = [
  {
    id: 'dev-tools',
    label: 'Dev tools',
    projects: [
      {name: 'URL Shortener', url: 'https://s.test', slug: 'url-shortener'},
      {name: 'URL Encoder', url: 'https://e.test', slug: 'url-encoder'},
      {name: 'Regex Tester', url: 'https://r.test', slug: 'regex'},
    ],
  },
  {
    id: 'webmaster',
    label: 'Webmaster',
    projects: [{name: 'Link Analytics', url: 'https://l.test', slug: 'link-analytics'}],
  },
];
const items = flatten(catalog);

describe('searchShowcase', () => {
  it('lists everything A-Z with no query', () => {
    expect(searchShowcase(items, '').map(i => i.slug)).toEqual([
      'link-analytics',
      'regex',
      'url-encoder',
      'url-shortener',
    ]);
  });

  it('requires every term and ignores punctuation/case', () => {
    expect(searchShowcase(items, 'URL, short').map(i => i.slug)).toEqual([
      'url-shortener',
    ]);
    expect(searchShowcase(items, 'url regex')).toEqual([]);
  });

  it('matches category labels and filters by category', () => {
    expect(searchShowcase(items, 'webmaster').map(i => i.slug)).toEqual([
      'link-analytics',
    ]);
    expect(searchShowcase(items, '', 'webmaster').map(i => i.slug)).toEqual([
      'link-analytics',
    ]);
  });

  it('ranks name-prefix matches first', () => {
    expect(searchShowcase(items, 're').map(i => i.slug)[0]).toBe('regex');
  });
});

describe('helpers', () => {
  it('counts per category', () => {
    expect(categoryCounts(catalog)).toEqual([
      {id: 'dev-tools', label: 'Dev tools', count: 3},
      {id: 'webmaster', label: 'Webmaster', count: 1},
    ]);
  });

  it('picks deterministically with an injected random', () => {
    expect(pickRandom([1, 2, 3], () => 0)).toBe(1);
    expect(pickRandom([1, 2, 3], () => 0.9999)).toBe(3);
    expect(pickRandom([], () => 0.5)).toBeNull();
  });

  it('the real catalog has unique slugs and https URLs', () => {
    const all = flatten(PROJECT_CATEGORIES);
    expect(new Set(all.map(i => i.slug)).size).toBe(all.length);
    expect(all.every(i => i.url.startsWith('https://'))).toBe(true);
  });

  it('projectHost extracts the host', () => {
    expect(projectHost('https://bookchaowalit.com/x')).toBe('bookchaowalit.com');
    expect(projectHost('nope')).toBe('nope');
  });
});
