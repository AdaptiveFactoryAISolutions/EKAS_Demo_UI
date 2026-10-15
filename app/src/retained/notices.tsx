import {afterCommitted} from './commitBarrier';
import {useEffect,useState} from 'react';
const emit=(message:string)=>window.dispatchEvent(new CustomEvent('ekas-notice',{detail:message}));
const committedNotice=(message:string)=>afterCommitted(()=>emit(message),error=>emit('Not saved: '+error));
export const toast=Object.assign(committedNotice,{success:committedNotice,error:emit});
export function Toaster(_:{theme?:string}){const [message,setMessage]=useState('');useEffect(()=>{const listener=(e:Event)=>setMessage(String((e as CustomEvent).detail));window.addEventListener('ekas-notice',listener);return()=>window.removeEventListener('ekas-notice',listener)},[]);return message?<div className="retained-notice" role="status">{message}<button onClick={()=>setMessage('')}>Dismiss</button></div>:null}
