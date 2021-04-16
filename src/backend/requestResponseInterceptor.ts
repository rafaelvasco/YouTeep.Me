import { AuthContext } from '@/contexts/authContext'
import { useContext, useMemo } from 'react'
import api from './api'
import NProgress from 'nprogress'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import axios from 'axios'
import { refreshAuthorize } from './authService'

export const RequestResponseInterceptor = ({ children }) => {
    const { storeAuth, clearAuth } = useContext(AuthContext)

    const router = useRouter()

    useMemo(() => {
        api.interceptors.request.use(
            (config) => {
                NProgress.start()
                return config
            },
            (error) => {
                NProgress.done()
                return Promise.reject(error)
            }
        )
    }, [])

    useMemo(() => {
        api.interceptors.response.use(
            (response) => {
                NProgress.done()
                return response
            },
            async (error) => {
                if (error.response.status === 401 && error.config) {
                    console.log('Trying to refresh Authorize')
                    return refreshAuthorize()
                        .then((user) => {
                            if (user) {
                                console.log(`Authorization Refreshed: ${JSON.stringify(user)}`)
                                storeAuth(user)
                                return axios.request(error.config)
                            }
                        })
                        .catch((error) => {
                            console.log("Couldn't refresh")
                            NProgress.done()
                            clearAuth()
                            router.push('/login')
                            toast.error('Your login expired, please login again.')
                            return Promise.reject(error)
                        })
                } else {
                    NProgress.done()
                    return Promise.reject(error)
                }
            }
        )
    }, [])

    return children
}
