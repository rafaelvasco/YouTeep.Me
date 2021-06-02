import { ItemFilter } from '@/types/ItemFilter'
import qs from 'query-string'

export const buildQueryUrl = (filter: ItemFilter, path = '/') => {
    // let urlQueryObj = {} as Partial<ItemFilterUrlQuery>

    // urlQueryObj.page = filter.page
    // urlQueryObj.pageSize = filter.pageSize

    // if (filter.type.id !== null) {
    //     urlQueryObj.type = filter.type.id
    // }

    // if (filter.tags && filter.tags.length > 0) {
    //     urlQueryObj.tags = filter.tags
    // }

    const query = qs.stringify(filter, { skipNull: true })
    return path + '?' + query
}
