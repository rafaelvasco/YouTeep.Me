import { refreshAuthorize } from '@/backend/authService'
import { User } from '@/types/User'
import { createContext, useEffect, useState } from 'react'

type LoggedUserInfo = {
    id: string
    email: string
    role: string
}

type AuthContextProps = {
    loggedIn: boolean
    userInfo: LoggedUserInfo
    storeAuth: (user: User) => void
    clearAuth: () => void
    tryAuthorize: () => Promise<User | null>
}

export const AuthContext = createContext({} as AuthContextProps)

export const AuthContainer = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState({
        id: null,
        email: '',
        role: '',
    } as LoggedUserInfo)

    const storeAuth = (user: User) => {
        setLoggedIn(true)
        setUserInfo({
            id: user.id,
            email: user.email,
            role: user.role,
        })
    }

    const clearAuth = () => {
        setLoggedIn(false)
        setUserInfo({ email: '', role: '', id: null })
    }

    const tryAuthorize = async (): Promise<User | null> => {
        try {
            const user = await refreshAuthorize()

            if (user) {
                console.log('Logged in using Refresh Token')
                storeAuth(user)
                return user
            } else {
                clearAuth()
            }
        } catch (error) {}

        return null
    }

    useEffect(() => {
        if (!loggedIn) {
            tryAuthorize()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ loggedIn, userInfo, storeAuth, clearAuth, tryAuthorize }}>
            {children}
        </AuthContext.Provider>
    )
}
