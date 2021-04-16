import { AuthContext } from '@/contexts/authContext'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

export const PageAuthWrapper = (WrappedComponent) => {
    const router = useRouter()
    const authContext = useContext(AuthContext)
    const [verified, setVerified] = useState(false)

    useEffect(() => {
        authorize()
    }, [])

    const authorize = async () => {
        const user = await authContext.tryAuthorize()

        if (!user) {
            router.replace('/login')
            setVerified(false)
        } else {
            setVerified(true)
        }
    }

    if (verified) {
        return <WrappedComponent />
    }
}
