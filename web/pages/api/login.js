import axios from 'axios';

const loginAsync = async (data) => {
    const response = await axios.post('http://localhost:4000/login', data);
    return response.data;
};

export default loginAsync;
