import type {Query,Filter} from './model';
/** Tile, saved and personal filters intersect in their exact displayed order. */
export function effectiveBoardQuery(query:Query,saved:Filter[],personal:Filter[]):Query{return {...structuredClone(query),filters:structuredClone([...query.filters,...saved,...personal])};}
