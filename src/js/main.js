if (module.hot) {
  module.hot.accept();
}

import React from 'react';
import ReactDOM from 'react-dom';
import '../css/style.sass';
import {Provider} from 'react-redux';
import App from './components/app';
import store from './store';


const app = document.getElementById('app');
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>, app);
