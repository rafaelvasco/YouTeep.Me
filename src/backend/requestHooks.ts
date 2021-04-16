import useSWR from 'swr'
import api from './api'

const fetcher = (url: string) => api.get(url).then((res) => res.data)
const fetcherWithBody = (url: string, requestBody: any) =>
    api.post(url, requestBody).then((res) => res.data)

export const useFetch = <T>(path: string, requestBody?: any): [T, Error] => {
    if (!path) {
        throw new Error('Path is required')
    }

    if (requestBody) {
        const { data: results, error } = useSWR<T, Error>([path, requestBody], fetcherWithBody)
        return [results, error]
    } else {
        const { data: results, error } = useSWR<T, Error>(path, fetcher)
        return [results, error]
    }
}
