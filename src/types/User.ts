import { UserRole } from './UserRole'

export type User = {
    id: string
    email: string
    role: UserRole
    active: boolean
}
