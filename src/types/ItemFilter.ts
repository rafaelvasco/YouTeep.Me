export type ItemFilter = {
    type: string | null
    tags: string[] | null
    page: number
    pageSize: number
}

export const itemFilterEmpty = (filter: ItemFilter) => {
    return filter.type === null && !filter.tags && filter.page === 1
}
