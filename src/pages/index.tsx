import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata.json'
import { FilterPanel } from '@/components/FilterPanel'
import { AdminPanel } from '@/components/AdminPanel'
import { MainItemList } from '@/components/MainItemList'
import { SectionContainer } from '@/components/SectionContainer'
import { ItemCreator } from '@/components/ItemCreator'
import { useAppContext } from '@/contexts/appContext'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/authContext'

const Home = () => {
    const appState = useAppContext()

    const { loggedIn } = useContext(AuthContext)

    return (
        <>
            <PageSeo
                title={siteMetadata.title}
                description={siteMetadata.description}
                url={siteMetadata.siteUrl}
            />

            <div className="my-5">
                {!appState.getAdminActive() ? (
                    <>
                        <SectionContainer>
                            <FilterPanel />
                            {loggedIn ? <ItemCreator /> : null}
                            <MainItemList />
                        </SectionContainer>
                    </>
                ) : (
                    <AdminPanel />
                )}
            </div>
        </>
    )
}

export default Home
