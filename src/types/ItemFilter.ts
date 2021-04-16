export type ItemFilter = {
    itemTypeId: string
    tags: string[]
    page: number
    pageSize: number
}

export const itemFilterEmpty = (filter: ItemFilter) => {
    return (
        filter.itemTypeId === null &&
        (!filter.tags || filter.tags.length === 0) &&
        filter.page === 1
    )
}
