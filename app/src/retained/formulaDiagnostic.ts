import {queryFormula,type Query,type Formula} from './model';
export const missingFormulaCopy='This query is missing its saved custom formula definition and units. Its result is withheld. Choose a formula and run the query again.';
export const formulaMetadataMissing=(query:Query,metric:string,availableFormula?:Formula)=>metric.startsWith('fx:')&&query.formulaId===metric&&query.columns.filter(id=>id.startsWith('fx:')).length===1&&!queryFormula(query,availableFormula);
