import { useState, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../libs/apollo';
import { UserContext } from '../contexts';
import '../styles/globals.scss';

function App({ Component, pageProps }) {
    const [userToken, setUserToken] = useState(null);
    const userProvider = useMemo(() => ({ userToken, setUserToken }), [userToken, setUserToken]);
    const apolloClient = useApollo(pageProps.initialApolloState);

    return (
        <ApolloProvider client={apolloClient}>
            <UserContext.Provider value={userProvider}>
                <Component {...pageProps} />
            </UserContext.Provider>
        </ApolloProvider>
    );
}

export default App;
