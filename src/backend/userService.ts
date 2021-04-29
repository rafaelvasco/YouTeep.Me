import { User } from '@/types/User'
import { UserRole } from '@/types/UserRole'
import toast from 'react-hot-toast'
import api from './api'

export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const result = await api.get<User>('user', {
            params: {
                id: userId,
            },
        })
        return result.data
    } catch (e) {
        if (e.response.status === 500 || e.response.status === 400) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }
}

export type EditUserProps = {
    active?: boolean
    role?: UserRole
}

export const editUser = async (userId: string, props: EditUserProps): Promise<any | null> => {
    try {
        const result = await api.patch('user', props, {
            params: {
                id: userId,
            },
        })
        return result
    } catch (e) {
        if (e.response.status === 500 || e.response.status === 400) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return null
}
