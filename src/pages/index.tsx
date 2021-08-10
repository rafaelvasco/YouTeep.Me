import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata.json'
import { ItemFilter, itemFilterEmpty } from '@/types/ItemFilter'
import { useRouter } from 'next/dist/client/router'
import { useBus, useListener } from 'react-bus'
import { buildQueryUrl } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { PageSize } from '@/data/config'
import { deleteItem } from '@/backend/itemService'
import toast from 'react-hot-toast'
import { ComponentEvents } from '@/components/events'
import { FilterPanel } from '@/components/FilterPanel'
import { AdminPanel } from '@/components/AdminPanel'
import { MainItemList } from '@/components/MainItemList'
import { SectionContainer } from '@/components/SectionContainer'
import { ItemCreator } from '@/components/ItemCreator'
import { useAppContext } from '@/contexts/appContext'

const Home = () => {
    const appState = useAppContext()

    const [loaded, setLoaded] = useState(false)

    const router = useRouter()

    const eventBus = useBus()

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

    useListener(ComponentEvents.ItemDeleteConfirmed, async (itemId: string) => {
        console.log('Item delete confirmed')
        const result = await deleteItem(itemId)
        if (result) {
            eventBus.emit(ComponentEvents.ItemListModified)
            toast.success(`Item Removed Successfully!`)
        }
    })

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
                            <ItemCreator />
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
    }
}

export default Home
