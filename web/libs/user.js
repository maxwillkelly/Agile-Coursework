import Cookies from 'js-cookie';

export const getUserToken = () => {
    const cookies = Cookies.get();
    let userToken = '';
    try {
        userToken = JSON.parse(cookies.userToken);
    } catch (err) {
        //
    }

    return userToken;
};

export const login = (res) => {
    Cookies.set('userToken', res, { expires: new Date(res.expire) });
};

export const logout = () => {
    Cookies.remove('userToken');
};
