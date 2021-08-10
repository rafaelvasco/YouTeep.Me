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

export const getUrlFileExtension = (url: string): string => {
    const patternFileExtension = /\.([0-9a-z]+)(?:[\?#]|$)/i

    //Get the file Extension
    var match = url.match(patternFileExtension)

    if (match) {
        const ext = match[0].slice(1)
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg'
            case 'png':
                return 'image/png'
            case 'webp':
                return 'image/webp'
            case 'gif':
                return 'image/gif'
            case 'bmp':
                return 'image/bmp'
            default:
                return 'image/'
        }
    }
}
