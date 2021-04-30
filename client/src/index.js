import React from 'react';
import ReactDOM from 'react-dom';
import '@audius/stems/dist/stems.css';
import '@audius/stems/dist/avenir.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import './index.css';
import ApolloProvider from './ApolloProvider';
import { Provider } from 'react-redux';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider />
  </Provider>,
  document.getElementById('root')
);
