import { PageAuthWrapper } from '@/components/PageAuthWrapper'
import { PageSeo } from '@/components/SEO'
import { AuthContext } from '@/contexts/authContext'
import siteMetadata from '@/data/siteMetadata.json'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

const Admin = () => {
    const authContext = useContext(AuthContext)
    const router = useRouter()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
        if (authContext.tryAuthorize()) {
            setAuthorized(true)
        } else {
            setAuthorized(false)
            console.log('Tried to access admin page, but not authorized')
            router.push('/login')
        }
    }, [])

    return (
        <>
            <div className="my-5">
                {authorized ? (
                    <PageSeo
                        title={siteMetadata.title}
                        description={siteMetadata.description}
                        url={siteMetadata.siteUrl}
                    />
                ) : null}
            </div>
        </>
    )
}

export default Admin
