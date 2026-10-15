/** Unit-only host for the retained earlier root presenter.
 * The normal runtime never selects this host. Normal canonical/advanced entry
 * has independent mounted tests; these tests preserve original root behavior. */
import type {ReactNode} from 'react';import {Console} from '../retained/console';
export function RetainedWorkspace({northworks}:{northworks?:ReactNode}){return <div className="retained-console"><Console content={northworks}/></div>}
