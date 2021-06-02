import { useAppContext } from '@/contexts/appContext'
import { useEffect } from 'react'
import { useBus } from 'react-bus'
import { RiAdminFill } from 'react-icons/ri'
import { ComponentEvents } from './events'

export const AdminButton = () => {
    const appContext = useAppContext()

    useEffect(() => {}, [])

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
