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

// 攔截 401 回應（session 過期），透過 CustomEvent 通知 AuthProvider
// 無法在此使用 useNavigate，所以改用瀏覽器事件作為橋接
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            window.dispatchEvent(new CustomEvent('auth:unauthorized'))
        }
        return Promise.reject(error)
    }
)

export default apiClient;