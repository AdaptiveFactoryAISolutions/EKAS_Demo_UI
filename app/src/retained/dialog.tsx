import {useEffect,useRef,useId,type ReactNode} from "react";
export function Dialog({ title, onClose, children,role="dialog",initialFocusSelector,footer,wide=false,presentation=false }: { title: string; onClose: () => void; children: ReactNode;role?:"dialog"|"alertdialog";initialFocusSelector?:string;footer?:ReactNode;wide?:boolean;presentation?:boolean }) {
  const bodyId=useId();
  const returnFocus=useRef<HTMLElement|null>(document.activeElement as HTMLElement|null);const dialog=useRef<HTMLDivElement>(null);useEffect(()=>{const previous=returnFocus.current;const escape=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.preventDefault();event.stopPropagation();onClose()}};window.addEventListener("keydown",escape,true);((initialFocusSelector?dialog.current?.querySelector<HTMLElement>(initialFocusSelector):null)||dialog.current?.querySelector<HTMLElement>("input,select,textarea")||dialog.current?.querySelector<HTMLElement>("button"))?.focus();return()=>{window.removeEventListener("keydown",escape,true);if(previous?.isConnected)previous.focus()}},[]);
  return (
    <div className={(presentation?"retained-dialog-presentation ":"")+"retained-dialog fixed inset-0 z-50 flex items-end justify-center bg-bg/80 p-4 md:items-center"} ref={dialog} style={{zIndex:10000}} role={role} aria-modal="true" aria-label={title} aria-describedby={role==="alertdialog"?bodyId:undefined} onKeyDown={e=>{if(e.key==="Escape"){e.preventDefault();onClose()}if(e.key==="Tab"){const items=[...e.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href]")],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}}>
      <div className={(wide?"retained-dialog-wide ":"")+"retained-dialog-panel flex w-full max-w-lg flex-col gap-3 rounded-xl border border-line bg-surface p-4"}>
        <div className="retained-dialog-header flex items-center justify-between" style={{position:"relative",zIndex:1}}>
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="min-h-11 px-2">Close</button>
        </div>
        <div id={bodyId} className="retained-dialog-body" style={{position:"relative",zIndex:0,isolation:"isolate"}}>{children}</div>
        {footer&&<div className="retained-dialog-footer" style={{position:"relative",zIndex:1}}>{footer}</div>}
      </div>
    </div>
  );
}
