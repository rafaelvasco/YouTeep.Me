import { PageSize } from '@/data/config'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import { useState } from 'react'
import { useMemo } from 'react'

type PaginatorProps = {
    page: number
    count: number
    paginate: (delta: number) => void
}

export const Paginator = (props: PaginatorProps) => {
    const MaxPageDisplay = 10

    const [pageDisplayDelta, setPageDisplayDelta] = useState(0)

    const maxPage = useMemo(() => {
        if (props.count < PageSize) {
            return 1
        }

        return Math.ceil(props.count / PageSize)
    }, [props.count])

    const pageDisplayCount = useMemo(() => {
        if (maxPage <= MaxPageDisplay) {
            return maxPage
        }

        return MaxPageDisplay
    }, [props.count])

    useEffect(() => {
        setPageDisplayDelta(0)
    }, [props.count])

    const goToPage = (page: number) => {
        props.paginate(page - props.page)

        // if (props.page >= MaxPageDisplay) {
        //     setPageDisplayDelta(props.page - MaxPageDisplay)
        // } else {
        //     setPageDisplayDelta(0)
        // }
    }

    return (
        <div>
            {props.count > PageSize ? (
                <>
                    <div className="p-3 flex flex-row justify-center">
                        <span>
                            Page {props.page} of {maxPage}, Total Items: {props.count}
                        </span>
                    </div>
                    <div className="flex flex-row justify-center">
                        {props.page > 1 ? (
                            <button
                                className="w-60 py-2 text-indigo-100 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                onClick={() => {
                                    goToPage(props.page - 1)
                                }}
                            >
                                Previous
                            </button>
                        ) : null}

                        <>
                            {[...Array(pageDisplayCount)].map((_: undefined, index: number) => (
                                <button
                                    key={nanoid()}
                                    onClick={() => {
                                        goToPage(index + 1)
                                    }}
                                    className={`mx-1 w-8 dark:text-indigo-100 text-gray-800 ${
                                        props.page !== index + 1
                                            ? 'dark:bg-blue-900 bg-gray-200'
                                            : 'dark:bg-yellow-700 bg-blue-200'
                                    } rounded-lg focus:shadow-outline`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </>

                        {props.page < maxPage ? (
                            <button
                                className="w-60 py-2 text-indigo-100 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                onClick={() => {
                                    goToPage(props.page + 1)
                                }}
                            >
                                More
                            </button>
                        ) : null}
                    </div>
                </>
            ) : null}
        </div>
    )
}
