import qs from 'query-string'

export const buildQueryUrl = (object, path = '/') => {
    const query = qs.stringify(object, { skipNull: true })
    return path + '?' + query
}
