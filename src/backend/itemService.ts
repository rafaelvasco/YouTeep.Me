import { Item } from '@/types/Item'
import { ItemCreateRequest } from '@/types/ItemCreateRequest'
import { ItemFilter } from '@/types/ItemFilter'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { ItemType } from '@/types/ItemType'
import toast from 'react-hot-toast'
import api from './api'

type EditItemProps = {
    name?: string
    type?: string
    content?: string
    votes?: number
}

export class ItemService {
    static queryItems = async (itemFilter: ItemFilter): Promise<ItemQueryResult> => {
        try {
            const result = await api.post<ItemQueryResult>('item/query', itemFilter)
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

    static fetchItemTypes = async (): Promise<ItemType[]> => {
        try {
            const result = await api.get<ItemType[]>('item/types')
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

    static getItem = async (itemId: string): Promise<Item | null> => {
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

    static createItem = async (item: ItemCreateRequest): Promise<any | null> => {
        try {
            const formData = new FormData()

            formData.append('userId', item.userId)
            formData.append('name', item.name)
            formData.append('content', item.content)
            formData.append('typeId', item.typeId)

            if (item.mainImage) {
                formData.append('mainImage', item.mainImage)
            } else if (item.mainImageUrl) {
                formData.append('mainImageUrl', item.mainImageUrl)
            }

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

    static editItem = async (itemId: string, props: EditItemProps): Promise<any | null> => {
        try {
            const result = await api.patch('item', props, {
                params: {
                    id: itemId,
                },
            })
            return result
        } catch (e) {
            if (e.response.status !== 200) {
                if (e.response) {
                    toast.error(e.response.data.message)
                } else {
                    toast.error(e.message)
                }
            }
        }

        return null
    }

    static voteItem = async (itemId: string, votes: number): Promise<any | null> => {
        try {
            const result = await api.patch(
                'item/vote',
                { votes },
                {
                    params: {
                        id: itemId,
                    },
                }
            )
            return result
        } catch (e) {
            if (e.response.status !== 200) {
                if (e.response) {
                    toast.error(e.response.data.message)
                } else {
                    toast.error(e.message)
                }
            }
        }

        return null
    }

    static deleteItem = async (itemId: string): Promise<any | null> => {
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
}
