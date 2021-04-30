/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const API_URI = 'https://audiustree-graphql.vercel.app/graphql';

const client = new ApolloClient({
  uri: API_URI,
  cache: new InMemoryCache(),
});

export default () => {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};
