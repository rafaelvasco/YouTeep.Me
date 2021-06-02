export interface ItemType {
    id: string
    name: string
    color: string
}

export function everything(): ItemType {
    return {
        id: null,
        name: 'Everything',
        color: null,
    }
}
