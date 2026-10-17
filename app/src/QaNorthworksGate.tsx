import {useEffect,useState,type ReactNode} from 'react';
import {openQaNorthworks,saveQaNorthworks} from './qaNorthworksDurability';
import {commitWhilePageLive,usePageLifetime} from './retained/pageLifetime';
export function QaNorthworksGate({children}:{children:(saved:any,save:(raw:string)=>Promise<void>)=>ReactNode}){const pageLive=usePageLifetime();
 const [state,setState]=useState<{ready:boolean;saved:any;error:string}>({ready:false,saved:null,error:''});
 useEffect(()=>{let active=true;openQaNorthworks().then(raw=>{if(active)commitWhilePageLive(pageLive,()=>setState({ready:true,saved:raw?JSON.parse(raw):{},error:''}))}).catch(error=>{if(active)commitWhilePageLive(pageLive,()=>setState({ready:false,saved:null,error:error instanceof Error?error.message:String(error)}))});return()=>{active=false}},[]);
 if(state.error)return <section role="alert"><h2>Owned Northworks recovery required</h2><p>{state.error}</p><p>Existing bytes retained. No initial scenario substituted or saved.</p></section>;
 if(!state.ready)return <p role="status">Opening owned Northworks committed workspace…</p>;
 return children(state.saved,saveQaNorthworks);
}
