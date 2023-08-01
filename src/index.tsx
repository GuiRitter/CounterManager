import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';

import App from './ui/App';

import './index.css';

import { store } from './store';

const root = document.getElementById('root');

if (root) {
	createRoot(root).render(<Provider store={store}><React.StrictMode><App /></React.StrictMode></Provider>);
} else {
	throw new Error('Failed to find the root element');
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
