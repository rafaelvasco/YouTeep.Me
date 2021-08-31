import { useFetch } from '@/backend/requestHooks'
import { PageSize } from '@/data/config'
import { Item } from '@/types/Item'
import { ItemFilter } from '@/types/ItemFilter'
import { ItemQueryResult } from '@/types/ItemQueryResult'
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
import { useAppContext } from '@/contexts/appContext'
import { ItemService } from '@/backend/itemService'

const ModalComponent = dynamic(() => import('@/components/Modal').then((mod) => mod.Modal), {
    ssr: false,
}) as typeof Modal

export const AdminPanelItems = () => {
    const appState = useAppContext()

    const eventBus = useBus()

    const [itemsQueryResult, setItemsQueryResult] = useState<ItemQueryResult>(null)

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

    useEffect(() => {
        fetchItems()
    }, [page])

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        const result = await ItemService.queryItems(query)
        if (result) {
            setItemsQueryResult(result)
        }
    }

    const onItemTypeChanged = async (itemTypeId: string, item: Item) => {
        await ItemService.editItem(item.id, { type: itemTypeId })

        toast.success('Item Type changed Successfuly')

        await fetchItems()
    }

    const onItemNameChanged = async (name: string, item: Item) => {
        await ItemService.editItem(item.id, { name })

        toast.success('Item Named changed Successfuly')

        await fetchItems()
    }

    useListener(ComponentEvents.ItemListModified, async () => {
        await fetchItems()
    })

    return (
        <>
            {itemsQueryResult?.items ? (
                <div className="flex flex-col w-full">
                    <Table
                        className="w-full table-auto"
                        properties={{
                            id: 'Id',
                            name: 'Name',
                            type: 'Type',
                            user: 'User',
                            createdAt: 'Created',
                        }}
                        items={itemsQueryResult.items}
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
                                        options={appState.getAvailableItemTypes().map((type) => {
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

                    <div>
                        <Paginator
                            page={page}
                            count={itemsQueryResult.totalQty}
                            paginate={(delta: number) => {
                                setPage(page + delta)
                            }}
                        />
                    </div>
                    {deleteModalOpen ? (
                        <ModalComponent
                            confirm={() => {
                                appState.deleteItem(itemToDelete)
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
