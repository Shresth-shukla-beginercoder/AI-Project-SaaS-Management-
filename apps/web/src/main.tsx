import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">ProjectFlow AI</h1>
      </div>
    </React.StrictMode>,
  );
}
