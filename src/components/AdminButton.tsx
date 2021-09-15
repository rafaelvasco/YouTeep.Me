import { useAppContext } from '@/contexts/appContext'
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
