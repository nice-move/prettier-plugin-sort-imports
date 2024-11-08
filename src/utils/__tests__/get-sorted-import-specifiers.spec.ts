import { expect, test } from 'vitest';

import { getImportNodes } from '../get-import-nodes';
import { getSortedImportSpecifiers } from '../get-sorted-import-specifiers';
import { getSortedNodesModulesNames } from '../get-sorted-nodes-modules-names';

test('should return correct sorted nodes', () => {
    const code = `import { filter as z, reduce, eventHandler } from '@server/z';`;
    const [importNode] = getImportNodes(code);
    const sortedImportSpecifiers = getSortedImportSpecifiers(importNode);
    const specifiersList = getSortedNodesModulesNames(
        sortedImportSpecifiers.specifiers,
    );

    expect(specifiersList).toEqual(['eventHandler', 'z', 'reduce']);
});

test('should return correct sorted nodes with default import', () => {
    const code = `import Component, { filter as z, reduce, eventHandler } from '@server/z';`;
    const [importNode] = getImportNodes(code);
    const sortedImportSpecifiers = getSortedImportSpecifiers(importNode);
    const specifiersList = getSortedNodesModulesNames(
        sortedImportSpecifiers.specifiers,
    );

    expect(specifiersList).toEqual([
        'Component',
        'eventHandler',
        'z',
        'reduce',
    ]);
});

test('should group type imports after value imports - typescript', () => {
    const code = `import Component, { type TypeB, filter as z, type TypeA, reduce, eventHandler } from '@server/z';`;
    const [importNode] = getImportNodes(code, {
        plugins: ['typescript'],
    });
    const sortedImportSpecifiers = getSortedImportSpecifiers(importNode);
    const specifiersList = getSortedNodesModulesNames(
        sortedImportSpecifiers.specifiers,
    );

    expect(specifiersList).toEqual([
        'Component',
        'eventHandler',
        'z',
        'reduce',
        'TypeA',
        'TypeB',
    ]);
});

test('should group type imports after value imports - flow', () => {
    const code = `import Component, { type TypeB, filter as z, type TypeA, reduce, eventHandler } from '@server/z';`;
    const [importNode] = getImportNodes(code, {
        plugins: ['flow'],
    });
    const sortedImportSpecifiers = getSortedImportSpecifiers(importNode);
    const specifiersList = getSortedNodesModulesNames(
        sortedImportSpecifiers.specifiers,
    );

    expect(specifiersList).toEqual([
        'Component',
        'eventHandler',
        'z',
        'reduce',
        'TypeA',
        'TypeB',
    ]);
});

test('should sort case-sensitively', () => {
    const code = `import { ExampleComponent, ExamplesList, ExampleWidget } from '@components/e';`;
    const [importNode] = getImportNodes(code);
    const sortedImportSpecifiers = getSortedImportSpecifiers(importNode, {
        importOrderCaseSensitive: true,
    });
    const specifiersList = getSortedNodesModulesNames(
        sortedImportSpecifiers.specifiers,
    );

    expect(specifiersList).toEqual([
        'ExampleComponent',
        'ExampleWidget',
        'ExamplesList',
    ]);
});
