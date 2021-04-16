import { PageSeo } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata.json'
import { ItemFilter, itemFilterEmpty } from '@/types/ItemFilter'
import { useRouter } from 'next/dist/client/router'
import { useBus, useListener } from 'react-bus'
import { buildQueryUrl } from '@/lib/utils'
import { useContext, useEffect, useState } from 'react'
import { PageSize } from '@/data/config'
import { AuthContext } from '@/contexts/authContext'
import { deleteItem } from '@/backend/itemService'
import toast from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert'
import { ComponentEvents } from '@/components/events'
import { ConfirmModal } from '@/components/ConfirmModal'
import { FilterPanel } from '@/components/FilterPanel'
import { PaginatedItemsList } from '@/components/PaginatedItemsList'
import { ItemCreator } from '@/components/ItemCreator'

const Home = () => {
    const [itemsFilter, setFilter] = useState<ItemFilter>({
        itemTypeId: null,
        tags: [],
        page: 1,
        pageSize: PageSize,
    })

    const router = useRouter()

    const eventBus = useBus()

    const { loggedIn } = useContext(AuthContext)

    const updateQueryParams = (itemFilter: ItemFilter) => {
        if (!itemFilterEmpty(itemFilter)) {
            const url = buildQueryUrl(itemFilter)
            router.push(url)
        } else {
            router.replace('/')
        }
    }

    useEffect(() => {
        if (router.query) {
            const filter = convertQueryToFilter(router.query)
            setFilter(filter)
        } else {
            updateQueryParams(itemsFilter)
        }
    }, [])

    useEffect(() => {
        updateQueryParams(itemsFilter)
    }, [itemsFilter])

    useListener(ComponentEvents.TagSelected, (tag: string) => {
        setFilter({ ...itemsFilter, tags: [tag] })
    })

    useListener(ComponentEvents.FilterChanged, (filter: ItemFilter) => {
        console.log(`Filter changed: ${JSON.stringify(filter)}`)
        setFilter({ ...itemsFilter, itemTypeId: filter.itemTypeId })
    })

    useListener(ComponentEvents.PaginationChanged, (newPage: number) => {
        setFilter({ ...itemsFilter, page: newPage })
    })

    useListener(ComponentEvents.ItemDeleteRequested, async (itemId: string) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <ConfirmModal
                        title="Confirm"
                        message="Are you sure you want to remove this Item ?"
                        confirmButtonLabel="Yes, Remove"
                        cancelButtonLabel="No, Cancel"
                        onConfirm={() => {
                            eventBus.emit(ComponentEvents.ItemDeleteConfirmed, itemId)
                            onClose()
                        }}
                        onClose={onClose}
                    />
                )
            },
        })
    })

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
                <FilterPanel selectedItemType={itemsFilter?.itemTypeId} />
                {loggedIn ? <ItemCreator /> : null}

                <PaginatedItemsList filter={itemsFilter} />
            </div>
        </>
    )
}

const convertQueryToFilter = (query): ItemFilter => {
    return {
        itemTypeId: query.itemTypeId ?? null,
        tags: query.tags ?? [],
        page: query.page ?? 1,
        pageSize: PageSize,
    }
}

export default Home
