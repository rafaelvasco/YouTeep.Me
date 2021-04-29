import useSWR from 'swr'
import { MutatorCallback } from 'swr/dist/types'
import api from './api'

const fetcher = (url: string) => api.get(url).then((res) => res.data)
const fetcherWithBody = (url: string, requestBody: any) =>
    api.post(url, requestBody).then((res) => res.data)

type MutatorFunc = (
    data?: any | Promise<any> | MutatorCallback<any>,
    shouldRevalidate?: boolean
) => Promise<any>

export const useFetch = <T>(path: string, requestBody?: any): [T, Error, MutatorFunc] => {
    if (!path) {
        throw new Error('Path is required')
    }

    if (requestBody) {
        const { data: results, error, mutate } = useSWR<T, Error>(
            [path, requestBody],
            fetcherWithBody
        )
        return [results, error, mutate]
    } else {
        const { data: results, error, mutate } = useSWR<T, Error>(path, fetcher)
        return [results, error, mutate]
    }
}
