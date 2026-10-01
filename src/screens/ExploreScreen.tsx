import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {categoryCounts, flatten} from '../lib/showcase';

/** Portfolio at a glance: totals and a bar per category. */
export default function ExploreScreen() {
  const counts = categoryCounts();
  const total = flatten().length;
  const max = Math.max(1, ...counts.map(c => c.count));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.total}>{total}</Text>
      <Text style={styles.caption}>live projects in {counts.length} categories</Text>
      {counts.map(c => (
        <View
          key={c.id}
          style={styles.row}
          accessible
          accessibilityLabel={`${c.label}: ${c.count} projects`}>
          <Text style={styles.label}>{c.label}</Text>
          <View style={styles.barBg}>
            <View style={[styles.bar, {width: `${(c.count / max) * 100}%`}]} />
          </View>
          <Text style={styles.value}>{c.count}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f7'},
  content: {padding: 20},
  total: {fontSize: 48, fontWeight: '800', color: '#6200ee', textAlign: 'center'},
  caption: {color: '#666', textAlign: 'center', marginBottom: 24},
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  label: {width: 110, color: '#333'},
  barBg: {flex: 1, height: 10, backgroundColor: '#e6e6ea', borderRadius: 5, overflow: 'hidden'},
  bar: {height: 10, backgroundColor: '#6200ee', borderRadius: 5},
  value: {width: 32, textAlign: 'right', color: '#333'},
});
