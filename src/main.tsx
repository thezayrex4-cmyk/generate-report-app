import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './styles/header.css';
import './styles/template-editor.css';
import './styles/template-list.css';
import './styles/contract-manager.css';
import './styles/app-navigation.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);