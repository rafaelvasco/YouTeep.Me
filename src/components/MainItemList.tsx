import { useFetch } from '@/backend/requestHooks'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useBus, useListener } from 'react-bus'
import { ComponentEvents } from './events'
import { SkeletonLoader } from './SkeletonLoader'
import { ItemFilter } from '@/types/ItemFilter'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { Paginator } from './Paginator'
import { ItemCard } from './ItemCard'

type MainItemListProps = {
    filter: ItemFilter
}

export const MainItemList = (props: MainItemListProps) => {
    const [queryResult, error, mutate] = useFetch<ItemQueryResult>('item/query', props.filter)

    const [page, setPage] = useState(props.filter.page)

    const eventBus = useBus()

    useEffect(() => {
        eventBus.emit(ComponentEvents.ItemListPaginationChanged, page)
    }, [page])

    useEffect(() => {
        if (error) {
            toast.error(`An error ocurred while loading Items: ${error}`)
        }
    }, [error])

    useListener(ComponentEvents.ItemListModified, () => {
        mutate(props.filter)
    })

    return (
        <>
            {queryResult ? (
                <div>
                    <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                            Items
                        </h1>
                    </div>
                    <div className="container py-12">
                        <div className="flex flex-wrap justify-center">
                            {queryResult.items && queryResult.items.length > 0 ? (
                                queryResult.items.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        href="https://www.google.com"
                                    />
                                ))
                            ) : (
                                <h2>No Items</h2>
                            )}
                        </div>
                    </div>

                    <Paginator
                        page={page}
                        count={queryResult.totalQty}
                        paginate={(delta: number) => {
                            setPage(page + delta)
                        }}
                    />
                </div>
            ) : (
                <SkeletonLoader />
            )}
        </>
    )
}
