import { useFetch } from '@/backend/requestHooks'
import ItemFilter from '@/types/ItemFilter'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useBus, useListener } from 'react-bus'
import ItemQueryResult from '@/types/ItemQueryResult'
import { PageSize } from '@/data/config'
import { mutate } from 'swr'
import { ComponentEvents } from './events'
import { ItemsList } from './ItemsList'
import { SkeletonLoader } from './SkeletonLoader'

type Props = {
    filter: ItemFilter
}

export const PaginatedItemsList = ({ filter }: Props) => {
    const [queryResult, error] = useFetch<ItemQueryResult>('item/query', filter)

    const [page, setPage] = useState(filter.page)

    const eventBus = useBus()

    const maxPage = useMemo(() => {
        if (!queryResult) {
            return 0
        }

        if (queryResult.totalQty === 0) {
            return 1
        }

        return Math.ceil(queryResult.totalQty / PageSize)
    }, [queryResult])

    const paginate = (delta: number) => {
        setPage(page + delta)
    }

    useEffect(() => {
        eventBus.emit(ComponentEvents.PaginationChanged, page)
    }, [page])

    useEffect(() => {
        if (error) {
            toast.error(`An error ocurred while loading Items: ${error}`)
        }
    }, [error])

    useListener(ComponentEvents.ItemListModified, () => {
        mutate(['item/query', filter])
    })

    return (
        <>
            {queryResult ? (
                <>
                    <ItemsList items={queryResult.items} />

                    {queryResult.totalQty > PageSize ? (
                        <>
                            <div className="p-3 flex flex-row justify-center">
                                <span>
                                    Page {page} of {maxPage}
                                </span>
                            </div>
                            <div className="flex flex-row justify-center">
                                {page === 1 ? (
                                    <button
                                        className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                        onClick={() => {
                                            paginate(1)
                                        }}
                                    >
                                        Next
                                    </button>
                                ) : (
                                    false
                                )}

                                {page > 1 && page < maxPage ? (
                                    <>
                                        <button
                                            className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                            onClick={() => {
                                                paginate(-1)
                                            }}
                                        >
                                            Previous
                                        </button>
                                        <button
                                            className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                            onClick={() => {
                                                paginate(1)
                                            }}
                                        >
                                            Next
                                        </button>
                                    </>
                                ) : (
                                    ''
                                )}

                                {page === maxPage ? (
                                    <button
                                        className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                        onClick={() => {
                                            paginate(-1)
                                        }}
                                    >
                                        Previous
                                    </button>
                                ) : (
                                    ''
                                )}
                            </div>
                        </>
                    ) : (
                        false
                    )}
                </>
            ) : (
                <SkeletonLoader />
            )}
        </>
    )
}
