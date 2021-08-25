import { PageSize } from '@/data/config'
import { useMemo } from 'react'
import {
    HiChevronLeft,
    HiChevronRight,
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
} from 'react-icons/hi'

type PaginatorProps = {
    page: number
    count: number
    paginate: (delta: number) => void
}

export const Paginator = (props: PaginatorProps) => {
    const maxPage = useMemo(() => {
        if (props.count < PageSize) {
            return 1
        }

        return Math.ceil(props.count / PageSize)
    }, [props.count])

    const goToPage = (page: number) => {
        page = Math.max(1, Math.min(page, maxPage))

        props.paginate(page - props.page)
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
                    <div className="flex flex-row justify-center space-x-2">
                        <button
                            disabled={props.page === 1}
                            className="w-20 py-2 disabled:opacity-30 text-indigo-100 bg-blue-700 rounded-lg focus:shadow-outline"
                            onClick={() => {
                                goToPage(1)
                            }}
                        >
                            <HiChevronDoubleLeft className="m-auto" size="24" />
                        </button>

                        {props.page > 1 ? (
                            <button
                                className="w-20 py-2 text-indigo-100 bg-blue-700 rounded-lg focus:shadow-outline"
                                onClick={() => {
                                    goToPage(props.page - 1)
                                }}
                            >
                                <HiChevronLeft className="m-auto" size="24" />
                            </button>
                        ) : null}

                        {props.page < maxPage ? (
                            <button
                                className="w-20 py-2 text-indigo-100 bg-blue-700 rounded-lg focus:shadow-outline"
                                onClick={() => {
                                    goToPage(props.page + 1)
                                }}
                            >
                                <HiChevronRight className="m-auto" size="24" />
                            </button>
                        ) : null}

                        <button
                            disabled={props.page === maxPage}
                            className="w-20 py-2 disabled:opacity-30 text-indigo-100 bg-blue-700 rounded-lg focus:shadow-outline"
                            onClick={() => {
                                goToPage(maxPage)
                            }}
                        >
                            <HiChevronDoubleRight className="m-auto" size="24" />
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    )
}
