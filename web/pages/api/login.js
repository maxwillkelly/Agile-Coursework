import axios from 'axios';

const loginAsync = async (data) => {
    const response = await axios.post('https://node1.iplabs.work/login', data);
    return response.data;
};

export default loginAsync;
