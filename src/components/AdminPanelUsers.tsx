import { useFetch } from '@/backend/requestHooks'
import { editUser } from '@/backend/userService'
import { User } from '@/types/User'
import { UserRole } from '@/types/UserRole'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Select } from './Select'
import { SkeletonLoader } from './SkeletonLoader'
import { Table } from './Table'
import { Toggler } from './Toggler'

export const AdminPanelUsers = () => {
    const [queryResult, error, mutate] = useFetch<User[]>('user')

    useEffect(() => {
        if (error) {
            toast.error(`An error ocurred while loading Users: ${error}`)
        }
    }, [error])

    const onUserActiveChanged = async (active: boolean, user: User) => {
        await editUser(user.id, { active })

        toast.success(active ? 'User is now Active.' : 'User Deactivated.')

        mutate()
    }

    const onUserRoleChanged = async (selected: UserRole | null, user: User) => {
        await editUser(user.id, { role: selected })

        toast.success('User role changed Successfuly')

        mutate()
    }

    return (
        <>
            {queryResult ? (
                <Table
                    className="w-full table-auto"
                    columnClasses={['', '', '', 'text-center']}
                    properties={{
                        id: 'Id',
                        email: 'Email',
                        role: 'Role',
                        active: 'Active',
                    }}
                    items={queryResult}
                    customRenderers={{
                        active: (user) => {
                            return (
                                <Toggler
                                    data={user}
                                    onChange={onUserActiveChanged}
                                    active={user.active}
                                />
                            )
                        },
                        role: (user) => {
                            return (
                                <Select
                                    data={user}
                                    value={user.role}
                                    options={[
                                        { label: 'Admin', value: UserRole.ADMIN },
                                        { label: 'User', value: UserRole.USER },
                                    ]}
                                    onChange={onUserRoleChanged}
                                />
                            )
                        },
                    }}
                />
            ) : (
                <SkeletonLoader />
            )}
        </>
    )
}
