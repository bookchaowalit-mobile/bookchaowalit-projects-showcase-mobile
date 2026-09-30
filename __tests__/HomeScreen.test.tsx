import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Pressable, Text, TextInput} from 'react-native';
import HomeScreen from '../src/screens/HomeScreen';
import ExploreScreen from '../src/screens/ExploreScreen';

type Tree = ReactTestRenderer.ReactTestRenderer;

const flat = (children: unknown): string =>
  Array.isArray(children) ? children.map(flat).join('') : typeof children === 'string' || typeof children === 'number' ? String(children) : '';

const texts = (tree: Tree) =>
  tree.root.findAllByType(Text).map(node => flat(node.props.children));

it('filters by search text and category chip', async () => {
  let tree!: Tree;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<HomeScreen />);
  });
  expect(texts(tree)).toContain('Analytics Dashboard');

  await ReactTestRenderer.act(() => {
    tree.root.findByType(TextInput).props.onChangeText('base64');
  });
  expect(texts(tree)).toContain('Base64 Encoder');
  expect(texts(tree)).not.toContain('Analytics Dashboard');

  await ReactTestRenderer.act(() => {
    tree.root.findByType(TextInput).props.onChangeText('');
  });
  const webmaster = tree.root
    .findAllByType(Pressable)
    .find(p => flat(p.findByType(Text).props.children).startsWith('Webmaster'));
  await ReactTestRenderer.act(() => {
    webmaster!.props.onPress();
  });
  expect(texts(tree)).toContain('SEO Analyzer');
  expect(texts(tree)).not.toContain('Base64 Encoder');
});

it('renders the overview', async () => {
  let tree!: Tree;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(<ExploreScreen />);
  });
  expect(texts(tree).some(t => t.startsWith('live projects in'))).toBe(true);
});
