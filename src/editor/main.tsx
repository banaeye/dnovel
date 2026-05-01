import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EditorApp } from './EditorApp';
import './editor.css';

createRoot(document.getElementById('editor-root')!).render(
  <StrictMode>
    <EditorApp gameAppUrl={import.meta.env.BASE_URL} />
  </StrictMode>
);
