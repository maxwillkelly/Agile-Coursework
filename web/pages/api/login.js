import axios from 'axios';

const loginAsync = async (data) => {
    const response = await axios.post('http://188.34.206.120:4000/login', data);
    return response.data;
};

export default loginAsync;
