import React from 'react';
import ReactDOM from 'react-dom/client';
import { SessionProvider } from './context/SessionContext.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionProvider>
      <AppRoutes />
    </SessionProvider>
  </React.StrictMode>
);
