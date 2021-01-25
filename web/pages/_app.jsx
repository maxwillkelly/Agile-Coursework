import { useState, useMemo } from 'react';
import { UserContext } from '../contexts';
import '../styles/globals.scss';

function App({ Component, pageProps }) {
    const [userToken, setUserToken] = useState(null);
    const userProvider = useMemo(() => ({ userToken, setUserToken }), [userToken, setUserToken]);

    return (
        <UserContext.Provider value={userProvider}>
            <Component {...pageProps} />
        </UserContext.Provider>
    );
}

export default App;
