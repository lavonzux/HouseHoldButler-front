import axios from 'axios'

const apiClient = axios.create({
    baseURL: 'https://localhost:7066',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    params: {
        useCookies: true,
    }
})
export default apiClient;