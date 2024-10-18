import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from './redux/store';
import './main.css'
import './i18n';

ReactDOM.render(
    <Provider store={configureStore({})}>
        <App />
    </Provider>,
    document.getElementById('root')
);
