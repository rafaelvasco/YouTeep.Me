import { useEffect } from 'react'
import { useBus } from 'react-bus'
import { RiAdminFill } from 'react-icons/ri'
import { ComponentEvents } from './events'

export const AdminButton = () => {
    useEffect(() => {}, [])

    const event = useBus()

    const handleClick = () => {
        event.emit(ComponentEvents.AdminModeTriggered)
    }

    return (
        <>
            <button className="p-3" onClick={handleClick}>
                <RiAdminFill />
            </button>
        </>
    )
}
