import { useAppContext } from '@/contexts/appContext'
import { useEffect } from 'react'
import { RiAdminFill } from 'react-icons/ri'

export const AdminButton = () => {
    const appContext = useAppContext()

    const handleClick = () => {
        appContext.toggleAdminActive()
    }

    return (
        <>
            <button className="p-3" onClick={handleClick}>
                <RiAdminFill />
            </button>
        </>
    )
}
