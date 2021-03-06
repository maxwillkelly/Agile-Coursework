import { useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getUserToken } from './user.js';

// const uri = 'https://localhost:4000/graphql';
let apolloClient;

// Based on tutorial from here: https://www.apollographql.com/blog/building-a-next-js-app-with-apollo-client-slash-graphql/
const getAuthLink = () => {
    return setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                Authorization: getUserToken().token
            }
        };
    });
};

const createClient = () => {
    const authLink = getAuthLink();
    const httpLink = new HttpLink({ uri: 'https://node1.iplabs.work/graphql' });

    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    });
};

export const initApollo = (initialState = null) => {
    const _apolloClient = apolloClient ?? createClient();

    // If your page has Next.js data fetching methods that use Apollo Client,
    // the initial state gets hydrated here
    if (initialState) {
        // Get existing cache, loaded during client side data fetching
        const existingCache = _apolloClient.extract();
        // Restore the cache using the data passed from
        // getStaticProps/getServerSideProps combined with the existing cached data
        _apolloClient.cache.restore({ ...existingCache, ...initialState });
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;

    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;
    return _apolloClient;
};

export const useApollo = (initialState) => useMemo(() => initApollo(initialState), [initialState]);
