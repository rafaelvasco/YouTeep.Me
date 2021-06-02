import { Item } from '@/types/Item'
import { ItemCreateRequest } from '@/types/ItemCreateRequest'
import toast from 'react-hot-toast'
import api from './api'

export const getItem = async (itemId: string): Promise<Item | null> => {
    try {
        const result = await api.get<Item>('item', {
            params: {
                id: itemId,
            },
        })

        return result.data
    } catch (e) {
        if (e.response.status === 500 || e.response.status === 400) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }

        return null
    }
}

export const createItem = async (item: ItemCreateRequest): Promise<any | null> => {
    try {
        const formData = new FormData()

        formData.append('userId', item.userId)
        formData.append('name', item.name)
        formData.append('content', item.content)
        formData.append('typeId', item.typeId)
        formData.append('mainImage', item.mainImage)

        const result = await api.post('item', formData)
        return result
    } catch (e) {
        if (e.response.status === 500 || e.response.status === 400) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return null
}

export type EditItemProps = {
    name?: string
    type?: string
    content?: string
}

export const editItem = async (itemId: string, props: EditItemProps): Promise<any | null> => {
    try {
        const result = await api.patch('item', props, {
            params: {
                id: itemId,
            },
        })
        return result
    } catch (e) {
        if (e.response.status === 500 || e.response.status === 400) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }

    return null
}

export const deleteItem = async (itemId: string): Promise<any | null> => {
    console.trace(`Delete Item.`)

    try {
        const result = await api.delete('item', {
            params: {
                id: itemId,
            },
        })
        return result
    } catch (e) {
        if (e.response.status === 500 || e.response.status === 400) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }
}
