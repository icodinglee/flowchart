import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import DashboardReducer from 'dev/maliang/reducer/DashboardReducer.js';
import Dashboard from 'dev/maliang/page/Dashboard.js';

let createStoreWithMiddleware;
if (__DEV__) {
    createStoreWithMiddleware = applyMiddleware(promiseMiddleware(), reduxThunk, createLogger())(createStore);
} else {
    createStoreWithMiddleware = applyMiddleware(promiseMiddleware(), reduxThunk)(createStore);
}
const store = createStoreWithMiddleware(DashboardReducer);

render(
    <Provider store={store}>
        <Dashboard />
    </Provider>,
    document.getElementById('root')
);
