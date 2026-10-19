import {flushSync} from 'react-dom';
import {prepareEntryNavigation} from './navigation';
import {createRoot} from 'react-dom/client';
import App from './App';
import './styles-entry.css';
prepareEntryNavigation();
flushSync(()=>createRoot(document.getElementById('root')!).render(<App/>));
