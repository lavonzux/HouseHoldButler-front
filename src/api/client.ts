import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'http://localhost:5224',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    params: {
        useCookie: true,
    }
})
export default apiClient;