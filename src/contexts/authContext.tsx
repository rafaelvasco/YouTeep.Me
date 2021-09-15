import { AuthService } from '@/backend/authService'
import { User } from '@/types/User'
import { UserRole } from '@/types/UserRole'
import toast from 'react-hot-toast'
import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/backend/api'
import NProgress from 'nprogress'
import axios from 'axios'
import { useRouter } from 'next/router'

type LoggedUserInfo = {
    id: string
    email: string
    role: UserRole
}

type AuthContextProps = {
    storeAuth: (user: User) => void
    clearAuth: () => Promise<void>
    tryAuthorize: () => Promise<User | null>
    getUserInfo: () => LoggedUserInfo
    isLoggedIn: () => boolean
}

const AuthContext = createContext({} as AuthContextProps)

export const useAuthContext = () => {
    const ctx = useContext(AuthContext)

    if (ctx === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }

    return ctx
}

export const AuthProvider = ({ children }) => {
    // const [loggedIn, setLoggedIn] = useState(false)
    // const [userInfo, setUserInfo] = useState({
    //     id: null,
    //     email: '',
    //     role: null,
    // } as LoggedUserInfo)

    const router = useRouter()

    const storeAuth = (user: User) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userId', user.id)
            localStorage.setItem('userEmail', user.email)
            localStorage.setItem('userRole', user.role)
        }

        //setLoggedIn(true)
        // setUserInfo({
        //     id: user.id,
        //     email: user.email,
        //     role: user.role,
        // })
    }

    const clearAuth = async () => {
        console.log('Clearing Auth')
        const result = await AuthService.logout()

        if (result) {
            //setLoggedIn(false)
            //setUserInfo({ email: '', role: null, id: null })

            console.log('Clearing localstorage')

            if (typeof window !== 'undefined') {
                localStorage.removeItem('userId')
                localStorage.removeItem('userEmail')
                localStorage.removeItem('userRole')
            }
        }
    }

    const isLoggedIn = () => {
        if (typeof window === 'undefined') {
            return false
        }

        return localStorage.getItem('userId') !== null
    }

    const getUserInfo = (): LoggedUserInfo => {
        if (typeof window === 'undefined') {
            return null
        }

        return {
            id: localStorage.getItem('userId'),
            email: localStorage.getItem('userEmail'),
            role: localStorage.getItem('userRole') as UserRole,
        }
    }

    const tryAuthorize = async (): Promise<User | null> => {
        console.log('Try Authorize')
        try {
            const user = await AuthService.refreshAuthorize()

            if (user) {
                console.log('Logged in using Refresh Token')
                storeAuth(user)
                return user
            } else {
                await clearAuth()
            }
        } catch (error) {}

        return null
    }

    useEffect(() => {
        if (!isLoggedIn()) {
            tryAuthorize()
        }
    }, [])

    useEffect(() => {
        const authInterceptor = api.interceptors.response.use(
            (response) => {
                NProgress.done()
                return response
            },
            async (error) => {
                NProgress.done()
                const originalRequest = error.config
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true
                    console.log(`Logged IN: ${isLoggedIn()}`)
                    if (isLoggedIn()) {
                        console.log('Trying to refresh Authorize')

                        try {
                            const user = await AuthService.refreshAuthorize()
                            if (user) {
                                console.log(`Authorization Refreshed: ${JSON.stringify(user)}`)
                                storeAuth(user)
                                return axios.request(error.config)
                            }
                        } catch (error) {
                            await clearAuth()
                            toast.error('Your login expired, please login again.')
                            router.push('/login')
                            return Promise.reject(error)
                        }
                    }

                    console.log('Access denied. Please Login.')
                    toast.error('Access denied. Please Login.')
                    router.push('/login')
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.request.eject(authInterceptor)
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, getUserInfo, storeAuth, clearAuth, tryAuthorize }}
        >
            {children}
        </AuthContext.Provider>
    )
}
