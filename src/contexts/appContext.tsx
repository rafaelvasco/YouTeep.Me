import { ItemFilter } from '@/types/ItemFilter'
import { PageSize } from '@/data/config'
import { everything, ItemType } from '@/types/ItemType'
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { useBus } from 'react-bus'
import { ComponentEvents } from '@/components/events'
import { ItemCreateRequest } from '@/types/ItemCreateRequest'
import { ItemService } from '@/backend/itemService'
import { useEffect } from 'react'

export interface AppStateData {
    availableTypes: ItemType[]
    availableTags: string[]

    setMainFilterPage: (page: number) => void
    setMainFilterType: (typeId: string) => void
    getMainFilterType: () => ItemType
    getMainFilter: () => ItemFilter
    setMainFilter: (filter: ItemFilter) => void

    queryItems: () => void

    fetchTypes: () => void

    createItem: (request: ItemCreateRequest) => void

    addTag: (tag: string) => void
    removeTag: (tag: string) => void

    voteItem: (itemId: string) => void
    deleteItem: (itemId: string) => void

    getMainItemList: () => ItemQueryResult
    getAdminActive: () => boolean
    setAdminActive: (active: boolean) => void
    toggleAdminActive: () => void
}

const AppStateContext = createContext({} as AppStateData)

export const useAppContext = () => {
    const ctx = useContext(AppStateContext)
    return ctx
}

export function AppStateContainer({ children }) {
    const eventBus = useBus()

    const [itemsFilter, setItemsFilter] = useState<ItemFilter>({
        type: null,
        page: 1,
        pageSize: PageSize,
        tags: null,
    })

    const [mainItemList, setMainItemList] = useState<ItemQueryResult>(null)

    const [availableTypes, setAvailableTypes] = useState<ItemType[]>([])

    const [adminActivated, setAdminActivated] = useState(false)

    const [availableTags, setAvailableTags] = useState([])

    //const [availableTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    // const [mainItemList, errorMainItemList, mutateMainItemList] = useFetch<ItemQueryResult>(
    //     'item/query',
    //     itemsFilter
    // )

    /* ===== ITEM ================================================  */
    /* ============================================================ */

    const queryItems = async () => {
        const result = await ItemService.queryItems(itemsFilter)

        if (result) {
            setMainItemList(result)
        }
    }

    const createItem = async (request: ItemCreateRequest) => {
        const result = await ItemService.createItem(request)

        if (result) {
            toast.success(`Item Created Successfully!`)
            //mutateMainItemList()
            await queryItems()
        }
    }

    const voteItem = async (itemId: string) => {
        const itemDb = await ItemService.getItem(itemId)

        const result = await ItemService.editItem(itemId, { votes: itemDb.votes + 1 })

        if (result) {
            //mutateMainItemList()
            await queryItems()
        }
        eventBus.emit(ComponentEvents.ItemListModified)
    }

    const deleteItem = async (itemId: string) => {
        const result = await ItemService.deleteItem(itemId)

        if (result) {
            //mutateMainItemList()
            await queryItems()
            toast.success(`Item Removed Successfully!`)
            eventBus.emit(ComponentEvents.ItemListModified)
        }
    }

    /* ===== TYPES ================================================ */
    /* ============================================================ */

    const fetchTypes = async () => {
        const result = await ItemService.fetchItemTypes()

        if (result) {
            setAvailableTypes(result)
        }
    }

    /* ===== TAGS ================================================= */
    /* ============================================================ */

    const addTag = (tag: string) => {}

    const removeTag = (tag: string) => {}

    /* ===== SEARCH FILTER =======================================  */
    /* ============================================================ */

    const setMainFilterPage = (page: number) => {
        setItemsFilter({
            ...itemsFilter,
            page: page,
        })
    }

    const setMainFilterType = (typeId: string) => {
        setItemsFilter({
            ...itemsFilter,
            type: typeId,
        })
    }

    const getMainFilterType = () => {
        return itemsFilter.type
            ? availableTypes.find((t) => t.id === itemsFilter.type)
            : everything()
    }

    const getMainFilter = () => {
        return itemsFilter
    }

    const setMainFilter = (filter: ItemFilter) => {
        setItemsFilter(filter)
    }

    const getMainItemList = () => {
        return mainItemList
    }

    /* ===== ADMIN  ==============================================  */
    /* ============================================================ */

    const getAdminActive = () => {
        return adminActivated
    }

    const setAdminActive = (active: boolean) => {
        setAdminActivated(active)
    }

    const toggleAdminActive = () => {
        setAdminActivated(!adminActivated)
    }

    /* ===========================================================  */
    /* ============================================================ */

    useEffect(() => {
        queryItems()
    }, [itemsFilter])

    // useEffect(() => {
    //     if (itemTypesFetchError) {
    //         toast.error(`An error ocurred while loading Item Types: ${itemTypesFetchError}`)
    //     }
    // }, [itemTypesFetchError])

    // useEffect(() => {
    //     if (errorMainItemList) {
    //         toast.error(`An error ocurred while loading Items: ${errorMainItemList}`)
    //     }
    // }, [errorMainItemList])

    return (
        <AppStateContext.Provider
            value={{
                availableTypes,
                availableTags,
                createItem,
                queryItems,
                fetchTypes,
                addTag,
                removeTag,
                setMainFilterPage,
                setMainFilterType,
                getMainFilterType,
                setMainFilter,
                getMainFilter,
                getMainItemList,
                getAdminActive,
                setAdminActive,
                toggleAdminActive,
                voteItem,
                deleteItem,
            }}
        >
            {children}
        </AppStateContext.Provider>
    )
}
