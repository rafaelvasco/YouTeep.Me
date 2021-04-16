import Item from '@/types/Item'
import toast from 'react-hot-toast'
import api from './api'

export const createItem = async (item: Item): Promise<any | null> => {
    try {
        const result = await api.post('item', item)
        return result
    } catch (e) {
        if (e.response.status === 500) {
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
        if (e.response.status === 500) {
            if (e.response) {
                toast.error(e.response.data.message)
            } else {
                toast.error(e.message)
            }
        }
    }
}
