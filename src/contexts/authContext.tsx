import { logout, refreshAuthorize } from '@/backend/authService'
import { User } from '@/types/User'
import { UserRole } from '@/types/UserRole'
import { createContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type LoggedUserInfo = {
    id: string
    email: string
    role: UserRole
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
        role: null,
    } as LoggedUserInfo)

    const storeAuth = (user: User) => {
        setLoggedIn(true)
        setUserInfo({
            id: user.id,
            email: user.email,
            role: user.role,
        })
    }

    const clearAuth = async () => {
        const result = await logout()

        if (result) {
            setLoggedIn(false)
            setUserInfo({ email: '', role: null, id: null })
        }

        toast.success('User Logged Out')
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
