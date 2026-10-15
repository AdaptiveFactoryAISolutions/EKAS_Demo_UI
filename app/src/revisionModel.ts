export function proposeScope(current:string, proposed:string){return {current,proposed}}
export function resolveExact<T extends {id:string}>(records:T[],id:string){return records.find(record=>record.id===id)||null}
export function version<T>(previous:T, next:T){return [structuredClone(previous),structuredClone(next)]}
export function missingComparison(question:string){return /last shift|previous shift|yesterday|fell|declin/i.test(question)}
