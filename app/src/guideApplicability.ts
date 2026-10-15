import type{GuideProcedure}from'./guideModel';
/** Local notes/feedback are visible in both modes; applicability never switches or completes work. */
export function guideApplicability(_p:Pick<GuideProcedure,'id'>,_workspaceMode?:'manufacturing'|'training'){
 return{available:true,label:'',reason:''};
}
