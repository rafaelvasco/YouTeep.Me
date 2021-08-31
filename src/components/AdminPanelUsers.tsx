import { useFetch } from '@/backend/requestHooks'
import { UserService } from '@/backend/userService'
import { User } from '@/types/User'
import { UserRole } from '@/types/UserRole'
import { useState } from 'react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Loader from 'react-loader-spinner'
import { Select } from './Select'
import { Table } from './Table'
import { Toggler } from './Toggler'

export const AdminPanelUsers = () => {
    const [users, setUsers] = useState<Array<User>>([])

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        const result = await UserService.getAllUsers()

        if (result) {
            setUsers(result)
        }
    }

    const onUserActiveChanged = async (active: boolean, user: User) => {
        await UserService.editUser(user.id, { active })
        toast.success(active ? 'User is now Active.' : 'User Deactivated.')
        await fetchUsers()
    }

    const onUserRoleChanged = async (selected: UserRole | null, user: User) => {
        await UserService.editUser(user.id, { role: selected })
        toast.success('User role changed Successfuly')
        await fetchUsers()
    }

    return (
        <>
            {users ? (
                <div className="flex flex-col w-full">
                    <Table
                        className="w-full table-auto"
                        columnClasses={['', '', '', 'text-center']}
                        properties={{
                            id: 'Id',
                            email: 'Email',
                            role: 'Role',
                            active: 'Active',
                        }}
                        items={users}
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
                                        name="userRole"
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
                </div>
            ) : (
                <div className="flex justify-center align-middle w-full h-full">
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                    />
                </div>
            )}
        </>
    )
}
