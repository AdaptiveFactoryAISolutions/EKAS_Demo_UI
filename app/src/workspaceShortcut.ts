/** One Ctrl/Command-K owner for the highest-priority mounted workspace surface. */
const owners=new Map<number,{priority:number;run:()=>void}>();let identity=0;
function key(event:KeyboardEvent){if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&!event.repeat){const owner=[...owners.entries()].sort((a,b)=>b[1].priority-a[1].priority||b[0]-a[0])[0]?.[1];if(owner){event.preventDefault();event.stopImmediatePropagation();owner.run()}}}
export function registerWorkspaceShortcut(priority:number,run:()=>void){const id=++identity;if(!owners.size)window.addEventListener('keydown',key,true);owners.set(id,{priority,run});return()=>{owners.delete(id);if(!owners.size)window.removeEventListener('keydown',key,true)}}
