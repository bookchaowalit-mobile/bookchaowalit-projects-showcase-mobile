import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Pressable, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../src/screens/HomeScreen';

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function starButtons(tree: ReactTestRenderer.ReactTestRenderer) {
  return tree.root
    .findAllByType(Pressable)
    .filter(p =>
      String(p.props.accessibilityLabel ?? '').includes('favourites'),
    );
}

it('keeps favourites across sessions and filters to them', async () => {
  await AsyncStorage.clear();
  let tree!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<HomeScreen />);
    await flush();
  });
  const first = starButtons(tree)[0];
  const label = String(first.props.accessibilityLabel);
  await ReactTestRenderer.act(async () => {
    first.props.onPress();
    await flush();
  });
  await ReactTestRenderer.act(async () => tree.unmount());

  let next!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    next = ReactTestRenderer.create(<HomeScreen />);
    await flush();
  });
  const name = label.replace(/^Add | to favourites$/g, '');
  expect(
    starButtons(next).some(
      p => p.props.accessibilityLabel === `Remove ${name} from favourites`,
    ),
  ).toBe(true);

  const favChip = next.root
    .findAllByType(Pressable)
    .find(p =>
      String(p.props.accessibilityLabel ?? '').startsWith('Favourites only'),
    )!;
  await ReactTestRenderer.act(async () => favChip.props.onPress());
  expect(starButtons(next)).toHaveLength(1);
  expect(
    next.root.findAllByType(Text).some(t => t.props.children === name),
  ).toBe(true);
});
