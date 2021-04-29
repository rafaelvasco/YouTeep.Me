import { PageSize } from '@/data/config'
import { ReactNode, useEffect, useMemo, useState } from 'react'

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

    return (
        <>
            {props.count > PageSize ? (
                <>
                    <div className="p-3 flex flex-row justify-center">
                        <span>
                            Page {props.page} of {maxPage}, Total Items: {props.count}
                        </span>
                    </div>
                    <div className="flex flex-row justify-center">
                        {props.page === 1 ? (
                            <button
                                className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                onClick={() => {
                                    props.paginate(1)
                                }}
                            >
                                Next
                            </button>
                        ) : (
                            false
                        )}

                        {props.page > 1 && props.page < maxPage ? (
                            <>
                                <button
                                    className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                    onClick={() => {
                                        props.paginate(-1)
                                    }}
                                >
                                    Previous
                                </button>
                                <button
                                    className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                    onClick={() => {
                                        props.paginate(1)
                                    }}
                                >
                                    Next
                                </button>
                            </>
                        ) : (
                            ''
                        )}

                        {props.page === maxPage ? (
                            <button
                                className="h-10 w-1/2 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-700 rounded-lg focus:shadow-outline hover:bg-blue-800"
                                onClick={() => {
                                    props.paginate(-1)
                                }}
                            >
                                Previous
                            </button>
                        ) : (
                            ''
                        )}
                    </div>
                </>
            ) : null}
        </>
    )
}
