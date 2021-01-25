import axios from 'axios';

const login = async (data) => {
    try {
        const response = await axios.post('http://188.34.206.120:4000/login', data);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

export default login;
