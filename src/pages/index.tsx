import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata.json'
import { FilterPanel } from '@/components/FilterPanel'
import { AdminPanel } from '@/components/AdminPanel'
import { MainItemList } from '@/components/MainItemList'
import { SectionContainer } from '@/components/SectionContainer'
import { ItemCreator } from '@/components/ItemCreator'
import { useAppContext } from '@/contexts/appContext'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ItemFilter, itemFilterEmpty, itemFiltersCompare } from '@/types/ItemFilter'
import { PageSize } from '@/data/config'
import { buildQueryUrl } from '@/lib/utils'
import { useAppActions } from '@/contexts/appActionsContext'
import { useAuthContext } from '@/contexts/authContext'

const Home = () => {
    const appState = useAppContext()
    const appActions = useAppActions()

    const { isLoggedIn } = useAuthContext()

    const router = useRouter()

    useEffect(() => {
        updateFilterFromUrlQuery(router.query)
    }, [router.isReady])

    useEffect(() => {
        updateUrlQueryFromFilter(appState.getItemFilter())
    }, [appState.getItemFilter()])

    const convertQueryToFilter = (query): ItemFilter => {
        return {
            type: query.type ? (query.type as string) : null,
            tags: query.tags ?? null,
            page: parseInt(query.page) ?? 1,
            pageSize: PageSize,
            queryText: query.queryText ?? null,
        }
    }

    const updateFilterFromUrlQuery = (query: any) => {
        if (Object.keys(query).length > 0) {
            const filter = convertQueryToFilter(query)

            if (!itemFiltersCompare(filter, appState.getItemFilter())) {
                appState.setItemsFilter(filter)
            }
        }
    }

    const updateUrlQueryFromFilter = (itemFilter: ItemFilter) => {
        if (!itemFilterEmpty(itemFilter)) {
            const url = buildQueryUrl(itemFilter)
            router.push(url)
        } else {
            router.replace('/')
        }
    }

    useEffect(() => {
        appActions.fetchTypes()
    }, [])

    useEffect(() => {
        appActions.queryItems()
    }, [appState.getItemFilter()])

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
                            {isLoggedIn() ? <ItemCreator /> : null}
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
