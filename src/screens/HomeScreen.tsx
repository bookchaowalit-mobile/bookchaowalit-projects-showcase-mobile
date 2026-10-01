import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {projectHost} from '../lib/catalog';
import {isStringArray, valueCodec} from '../lib/persist';
import {
  categoryCounts,
  flatten,
  onlyFavorites,
  pickRandom,
  searchShowcase,
  toggleFavorite,
} from '../lib/showcase';
import {usePersistentState} from '../usePersistentState';

const ALL_ITEMS = flatten();
const COUNTS = categoryCounts();
const slugsCodec = valueCodec(isStringArray);

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = usePersistentState<string[]>(
    'showcase.favorites.v1',
    [],
    slugsCodec,
  );
  const results = useMemo(() => {
    const pool = favoritesOnly
      ? onlyFavorites(ALL_ITEMS, favorites)
      : ALL_ITEMS;
    return searchShowcase(pool, query, category);
  }, [query, category, favoritesOnly, favorites]);

  const open = (url: string) => Linking.openURL(url).catch(() => undefined);

  const surprise = () => {
    const pick = pickRandom(results);
    if (pick) {
      open(pick.url);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder={`Search ${ALL_ITEMS.length} projects`}
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search projects"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chips}
        contentContainerStyle={styles.chipsContent}>
        <Pressable
          onPress={() => setFavoritesOnly(!favoritesOnly)}
          accessibilityRole="button"
          accessibilityLabel={`Favourites only, ${favorites.length} saved`}
          accessibilityState={{selected: favoritesOnly}}
          style={[styles.chip, favoritesOnly && styles.chipActive]}>
          <Text
            style={[styles.chipText, favoritesOnly && styles.chipTextActive]}>
            ★ {favorites.length}
          </Text>
        </Pressable>
        {[{id: null, label: 'All', count: ALL_ITEMS.length}, ...COUNTS].map(
          c => {
            const selected = category === c.id;
            return (
              <Pressable
                key={c.id ?? 'all'}
                onPress={() => setCategory(c.id)}
                accessibilityRole="button"
                accessibilityState={{selected}}
                style={[styles.chip, selected && styles.chipActive]}>
                <Text
                  style={[styles.chipText, selected && styles.chipTextActive]}>
                  {c.label} {c.count}
                </Text>
              </Pressable>
            );
          },
        )}
      </ScrollView>
      <FlatList
        data={results}
        keyExtractor={item => item.slug}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.count}>
              {results.length} {results.length === 1 ? 'project' : 'projects'}
            </Text>
            {results.length > 1 && (
              <Pressable accessibilityRole="button" onPress={surprise}>
                <Text style={styles.surprise}>Surprise me</Text>
              </Pressable>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {favoritesOnly && favorites.length === 0
              ? 'No favourites yet — tap ☆ on a project.'
              : `No projects match “${query}”.`}
          </Text>
        }
        renderItem={({item}) => {
          const fav = favorites.includes(item.slug);
          return (
            <View style={[styles.card, styles.cardRow]}>
              <Pressable
                accessibilityRole="link"
                accessibilityHint={`Opens ${projectHost(item.url)}`}
                onPress={() => open(item.url)}
                style={styles.cardMain}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.category} · {projectHost(item.url)}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  fav
                    ? `Remove ${item.name} from favourites`
                    : `Add ${item.name} to favourites`
                }
                accessibilityState={{selected: fav}}
                hitSlop={10}
                onPress={() =>
                  setFavorites(list => toggleFavorite(list, item.slug))
                }>
                <Text style={styles.star}>{fav ? '★' : '☆'}</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f7'},
  cardRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  cardMain: {flex: 1},
  star: {fontSize: 24, color: '#b7791f'},

  search: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 15,
    color: '#111',
  },
  chips: {flexGrow: 0},
  chipsContent: {paddingHorizontal: 16, gap: 8},
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e6e6ea',
  },
  chipActive: {backgroundColor: '#6200ee'},
  chipText: {color: '#333', fontSize: 13},
  chipTextActive: {color: '#fff', fontWeight: '600'},
  list: {padding: 16, paddingBottom: 48},
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  count: {color: '#666'},
  surprise: {color: '#6200ee', fontWeight: '600'},
  empty: {color: '#777', textAlign: 'center', marginTop: 32},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  name: {fontSize: 16, fontWeight: '600', color: '#111'},
  meta: {fontSize: 12, color: '#777', marginTop: 2},
});
