import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('supabase-auth-token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-user-id': localStorage.getItem('user-id') || '',
    },
  };
});

export const graphqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          applications: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
          interviews: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
          companies: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
          contacts: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
          documents: {
            merge(existing = [], incoming: any[]) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default graphqlClient;
