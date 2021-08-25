import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata.json'
import { ItemFilter, itemFilterEmpty } from '@/types/ItemFilter'
import { useRouter } from 'next/dist/client/router'
import { buildQueryUrl } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { PageSize } from '@/data/config'
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

    const [loaded, setLoaded] = useState(false)

    const router = useRouter()

    const updateQueryParams = (itemFilter: ItemFilter) => {
        console.log('Update Query Params')
        if (!itemFilterEmpty(itemFilter)) {
            const url = buildQueryUrl(itemFilter)
            router.push(url)
        } else {
            router.replace('/')
        }
    }

    useEffect(() => {
        if (!loaded && Object.keys(router.query).length > 0) {
            setLoaded(true)
            const filter = convertQueryToFilter(router.query)
            appState.setMainFilter(filter)
        }
    }, [router.query])

    useEffect(() => {
        updateQueryParams(appState.getMainFilter())
    }, [appState.getMainFilter()])

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

const convertQueryToFilter = (query): ItemFilter => {
    return {
        type: query.type ? (query.type as string) : null,
        tags: query.tags ?? null,
        page: parseInt(query.page) ?? 1,
        pageSize: PageSize,
        queryText: query.text ?? null,
    }
}

export default Home
