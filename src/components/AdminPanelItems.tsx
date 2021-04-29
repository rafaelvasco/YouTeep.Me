import { editItem } from '@/backend/itemService'
import { useFetch } from '@/backend/requestHooks'
import { PageSize } from '@/data/config'
import { Item } from '@/types/Item'
import { ItemFilter } from '@/types/ItemFilter'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { ItemType } from '@/types/ItemType'
import { useEffect, useMemo, useState } from 'react'
import { useBus } from 'react-bus'
import toast from 'react-hot-toast'
import { DateDisplay } from './DateDisplay'
import { ComponentEvents } from './events'
import { Select } from './Select'
import { SkeletonLoader } from './SkeletonLoader'
import { Table } from './Table'
import { TextInput } from './TextInput'

export const AdminPanelItems = () => {
    const [page, setPage] = useState(1)

    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const eventBus = useBus()

    const query = useMemo(
        () =>
            ({
                itemTypeId: null,
                tags: [],
                page: page,
                pageSize: PageSize,
            } as ItemFilter),
        [page]
    )

    const [queryResult, error, mutate] = useFetch<ItemQueryResult>('item/query', query)

    useEffect(() => {
        if (error) {
            toast.error(`An error ocurred while fetching Items: ${error}`)
        }
    }, [error])

    useEffect(() => {
        if (itemTypesFetchError) {
            toast.error(`An error ocurred while fetching ItemTypes: ${error}`)
        }
    }, [itemTypesFetchError])

    useEffect(() => {
        if (queryResult) {
            console.log(queryResult.items)
        }
    }, [queryResult])

    const onItemTypeChanged = async (itemTypeId: string, item: Item) => {
        await editItem(item.id, { type: itemTypeId })

        toast.success('Item Type changed Successfuly')

        mutate()
    }

    const onItemNameChanged = async (name: string, item: Item) => {
        await editItem(item.id, { name })

        toast.success('Item Named changed Successfuly')

        mutate()
    }

    return (
        <>
            {queryResult ? (
                <Table
                    className="w-full table-auto"
                    properties={{
                        id: 'Id',
                        name: 'Name',
                        type: 'Type',
                        user: 'User',
                        createdAt: 'Created',
                    }}
                    items={queryResult.items}
                    customRenderers={{
                        name: (item) => {
                            return (
                                <TextInput
                                    name="itemName"
                                    className="w-full"
                                    value={item.name}
                                    data={item}
                                    onChange={onItemNameChanged}
                                />
                            )
                        },
                        type: (item) => {
                            return (
                                <Select
                                    className="ligh"
                                    name="itemType"
                                    data={item}
                                    value={item.type.id}
                                    options={itemTypes.map((type) => {
                                        return {
                                            label: type.name.toUpperCase(),
                                            value: type.id,
                                        }
                                    })}
                                    onChange={onItemTypeChanged}
                                />
                            )
                        },
                        user: (item) => {
                            return <span>{item.user.email}</span>
                        },
                        createdAt: (item) => {
                            return <DateDisplay dateString={item.createdAt} />
                        },
                    }}
                    actions={[
                        (it: Item) => {
                            return (
                                <button
                                    className="px-5 py-2 bg-blue-500 rounded-lg text-white"
                                    onClick={() => {
                                        eventBus.emit(
                                            ComponentEvents.AdminItemPanelItemEditSelected,
                                            it.id
                                        )
                                    }}
                                >
                                    Edit Content
                                </button>
                            )
                        },
                    ]}
                />
            ) : (
                <SkeletonLoader />
            )}
        </>
    )
}
