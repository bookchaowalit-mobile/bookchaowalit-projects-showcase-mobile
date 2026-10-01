import {flatten, onlyFavorites, toggleFavorite} from '../src/lib/showcase';

describe('favourites', () => {
  const items = flatten();

  it('toggles a slug on and off', () => {
    const on = toggleFavorite([], items[0].slug);
    expect(on).toEqual([items[0].slug]);
    expect(toggleFavorite(on, items[0].slug)).toEqual([]);
  });

  it('filters to favourites and ignores unknown slugs', () => {
    const favs = [items[2].slug, 'no-such-project', items[0].slug];
    expect(onlyFavorites(items, favs).map(i => i.slug)).toEqual([
      items[0].slug,
      items[2].slug,
    ]);
  });
});
