import { User } from '@/types/User'
import { UserRole } from '@/types/UserRole'
import toast from 'react-hot-toast'
import api from './api'

type EditUserProps = {
    active?: boolean
    role?: UserRole
}

export class UserService {
    static getAllUsers = async (): Promise<Array<User> | undefined> => {
        try {
            const result = await api.get<Array<User>>('user')
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

    static getUser = async (userId: string): Promise<User | null> => {
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

    static editUser = async (userId: string, props: EditUserProps): Promise<any | null> => {
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
}
