import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import FlowChartReducer from 'dev/maliang/reducer/FlowChartReducer.js';
import BlockBoard from 'dev/maliang/page/BlockBoard.js';

let createStoreWithMiddleware;
if (__DEV__) {
    createStoreWithMiddleware = applyMiddleware(promiseMiddleware(), reduxThunk, createLogger())(createStore);
} else {
    createStoreWithMiddleware = applyMiddleware(promiseMiddleware(), reduxThunk)(createStore);
}
const store = createStoreWithMiddleware(FlowChartReducer);

render(
<Provider store={store}>
    <BlockBoard />
    </Provider>,
    document.getElementById('root')
);
