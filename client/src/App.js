import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

function App() {

  const httpLink = createHttpLink({
    uri: '/graphql',
  });
// When we need to use a specific function that a library provides us, we might not need to use every parameter for that function. Often, we can't omit an unused parameter, because the function is looking for these parameters in a specific order. In this case, we don't need the first parameter offered by setContext(), which stores the current request object in case this function is running after we've initiated a request.

// Because we're not using the first parameter, but we still need to access the second one, we can use an underscore _ to serve as a placeholder for the first parameter.
  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });



  return (
    <ApolloProvider client={client} >
    <Router>
      <>
        <Navbar />
        <Switch>
          <Route exact path='/' component={SearchBooks} />
          <Route exact path='/saved' component={SavedBooks} />
          <Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
        </Switch>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
