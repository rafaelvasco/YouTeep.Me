export type ItemFilter = {
    type: string | null
    tags: string[] | null
    page: number
    pageSize: number
    queryText: string | null
}

export const itemFilterEmpty = (filter: ItemFilter) => {
    return filter.type === null && !filter.tags && filter.page === 1
}
