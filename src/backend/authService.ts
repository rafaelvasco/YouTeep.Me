import { LoginData } from '@/types/LoginData'
import { User } from '@/types/User'
import toast from 'react-hot-toast'
import api from './api'

export const refreshAuthorize = async (): Promise<User | null> => {
    const response = await api.get('auth/refresh-authorize')

    if (response.data) {
        return response.data as User
    }

    return null
}

export const login = async (loginData: LoginData): Promise<User | null> => {
    try {
        const response = await api.post('auth/login', loginData)

        if (response.data) {
            return response.data as User
        }
    } catch (e) {
        if (e.response) {
            toast.error(e.response.data.message)
        } else {
            toast.error(e.message)
        }
    }

    return null
}
