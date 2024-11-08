import type {
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
} from '@babel/types';

import type { PluginConfig } from '../../types';
import { naturalSort, naturalSortCaseSensitive } from '../natural-sort';

function getName(
    item: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier,
): string {
    return item.type === 'ImportSpecifier'
        ? item.imported.type === 'Identifier'
            ? item.imported.name
            : item.imported.value
        : item.local.name;
}

/**
 * This function returns import nodes with alphabetically sorted module
 * specifiers.
 *
 * type imports are sorted separately, and placed after value imports.
 *
 * Comments need to be fixed up so they attach to the right objects.
 *
 * @param node Import declaration node
 */
export const getSortedImportSpecifiers = (
    node: ImportDeclaration,
    options?: Pick<PluginConfig, 'importOrderCaseSensitive'>,
) => {
    const { importOrderCaseSensitive } = options || {};
    node.specifiers.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'ImportDefaultSpecifier' ? -1 : 1;
        }
        if (
            a.type === 'ImportSpecifier' &&
            b.type === 'ImportSpecifier' &&
            a.importKind !== b.importKind
        ) {
            // flow uses null for value import specifiers
            return a.importKind === 'value' || a.importKind == null ? -1 : 1;
        }
        const sortFn = importOrderCaseSensitive
            ? naturalSortCaseSensitive
            : naturalSort;

        const A = getName(a);
        const B = getName(b);

        if (A === B) {
            return sortFn(a.local.name, b.local.name);
        }

        return sortFn(A, B);
    });
    return node;
};
