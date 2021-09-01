export type ItemFilter = {
    type: string | null
    tags: string[] | null
    page: number
    pageSize: number
    queryText: string | null
    active?: boolean
}

export const itemFilterEmpty = (filter: ItemFilter) => {
    return (
        !filter || (filter.type === null && !filter.tags && filter.page === 1 && !filter.queryText)
    )
}

export const itemFiltersCompare = (filterA: ItemFilter, filterB: ItemFilter) => {
    return (
        filterA.page === filterB.page &&
        filterA.queryText === filterB.queryText &&
        filterA.type === filterB.type
    )
}
