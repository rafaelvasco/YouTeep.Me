import { editItem } from '@/backend/itemService'
import { useFetch } from '@/backend/requestHooks'
import { PageSize } from '@/data/config'
import { Item } from '@/types/Item'
import { ItemFilter } from '@/types/ItemFilter'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { ItemType } from '@/types/ItemType'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useBus, useListener } from 'react-bus'
import toast from 'react-hot-toast'
import { DateDisplay } from './DateDisplay'
import { ComponentEvents } from './events'
import { Paginator } from './Paginator'
import { Select } from './Select'
import { Table } from './Table'
import { TextInput } from './TextInput'
import { Modal } from '@/components/Modal'
import { ConfirmModal } from './ConfirmModal'
import Loader from 'react-loader-spinner'



const ModalComponent = dynamic(() => import('@/components/Modal').then((mod) => mod.Modal), {
    ssr: false,
}) as typeof Modal

export const AdminPanelItems = () => {
    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const eventBus = useBus()

    const [page, setPage] = useState(1)

    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const [itemToDelete, setItemToDelete] = useState(null)

    const query = useMemo(
        () =>
            ({
                type: null,
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

    useListener(ComponentEvents.ItemListModified, () => {
        mutate()
    })

    return (
        <>
            {queryResult ? (
                <div className="flex flex-col w-full">
                    <div>
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
                                (it: Item) => {
                                    return (
                                        <button
                                            className="px-5 py-2 bg-blue-500 rounded-lg text-white"
                                            onClick={() => {
                                                setDeleteModalOpen(true)
                                                setItemToDelete(it.id)
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )
                                },
                            ]}
                        />
                    </div>
                    <div>
                        <Paginator
                            page={page}
                            count={queryResult.totalQty}
                            paginate={(delta: number) => {
                                setPage(page + delta)
                            }}
                        />
                    </div>
                    {deleteModalOpen ? (
                        <ModalComponent
                            confirm={() => {
                                eventBus.emit(ComponentEvents.ItemDeleteConfirmed, itemToDelete)
                            }}
                            setOpen={setDeleteModalOpen}
                            confirmLabel="Yes, Remove"
                            closeLabel="No, Cancel"
                        >
                            <ConfirmModal
                                title="Confirm"
                                message="Are you sure you want to remove this Item ?"
                            />
                        </ModalComponent>
                    ) : null}
                </div>
            ) : (
                <div className="flex justify-center align-middle w-full h-full">
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs
                    />
                </div>
            )}
        </>
    )
}
