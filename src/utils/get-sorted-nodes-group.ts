import type { ImportDeclaration } from '@babel/types';

import type { PluginConfig } from '../../types';
import { naturalSort, naturalSortCaseSensitive } from '../natural-sort';

const io = '0' + String.fromCodePoint(0);

export const getSortedNodesGroup = (
    imports: ImportDeclaration[],
    options?: Pick<PluginConfig, 'importOrderCaseSensitive'>,
) => {
    const { importOrderCaseSensitive } = options || {};
    const sortFn = importOrderCaseSensitive
        ? naturalSortCaseSensitive
        : naturalSort;
    return imports.sort((a, b) =>
        sortFn(
            a.source.value.replace('-', io),
            b.source.value.replace('-', io),
        ),
    );
};
