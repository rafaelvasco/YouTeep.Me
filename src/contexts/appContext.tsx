import { ItemFilter, itemFilterEmpty, itemFiltersCompare } from '@/types/ItemFilter'
import { PageSize } from '@/data/config'
import { everything, ItemType } from '@/types/ItemType'
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { useBus } from 'react-bus'
import { ComponentEvents } from '@/components/events'
import { ItemCreateRequest } from '@/types/ItemCreateRequest'
import { ItemService } from '@/backend/itemService'
import { useRouter } from 'next/router'
import { buildQueryUrl } from '@/lib/utils'
import { useMemo } from 'react'
import { useEffect } from 'react'

export interface AppStateData {
    availableTypes: ItemType[]
    availableTags: string[]

    isLoadingResultList: () => boolean

    getAvailableItemTypes: () => Array<ItemType>
    setItemFilterPage: (page: number) => void
    getItemFilterPage: () => number
    setItemFilterType: (typeId: string) => void
    getItemFilterType: () => ItemType
    setItemFilterQueryText: (query: string) => void
    getItemFilterQueryText: () => string
    getItemFilter: () => ItemFilter

    updateFilterFromUrlQuery: (query: any) => void
    updateUrlQueryFromFilter: (itemFilter: ItemFilter) => void

    queryItems: () => void

    createItem: (request: ItemCreateRequest) => void

    addTag: (tag: string) => void
    removeTag: (tag: string) => void

    voteItem: (itemId: string) => void
    deleteItem: (itemId: string) => void

    getItemList: () => ItemQueryResult
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

    console.log('App State COntainer')

    const initialFilter = useMemo(
        () => ({
            type: null,
            page: 1,
            pageSize: PageSize,
            tags: null,
            queryText: null,
            active: true,
        }),
        []
    )

    const [itemsFilter, setItemsFilter] = useState<ItemFilter>(initialFilter)

    const [loadingResultList, setLoadingResultList] = useState(false)

    const router = useRouter()

    const [mainItemList, setMainItemList] = useState<ItemQueryResult>(null)

    const [availableTypes, setAvailableTypes] = useState<ItemType[]>([])

    const [adminActivated, setAdminActivated] = useState(false)

    const [availableTags, setAvailableTags] = useState([])

    /* ===== ITEM ================================================  */
    /* ============================================================ */

    const queryItems = async () => {
        console.log('QUERY ITEMS')

        setLoadingResultList(true)

        const result = await ItemService.queryItems(itemsFilter)

        if (result) {
            setMainItemList(result)
        }

        setLoadingResultList(false)
    }

    const createItem = async (request: ItemCreateRequest) => {
        const result = await ItemService.createItem(request)

        if (result) {
            toast.success(`Item Created Successfully!`)
            await queryItems()
        }
    }

    const voteItem = async (itemId: string) => {
        const itemDb = await ItemService.getItem(itemId)

        const result = await ItemService.voteItem(itemId, itemDb.votes + 1)

        if (result) {
            await queryItems()
        }
        eventBus.emit(ComponentEvents.ItemListModified)
    }

    const deleteItem = async (itemId: string) => {
        const result = await ItemService.deleteItem(itemId)

        if (result) {
            await queryItems()
            toast.success(`Item Removed Successfully!`)
            eventBus.emit(ComponentEvents.ItemListModified)
        }
    }

    /* ===== TYPES ================================================ */
    /* ============================================================ */

    const fetchTypes = async () => {
        const types = await ItemService.fetchItemTypes()
        setAvailableTypes(types)
    }

    /* ===== TAGS ================================================= */
    /* ============================================================ */

    const addTag = (tag: string) => {}

    const removeTag = (tag: string) => {}

    /* ===== SEARCH FILTER =======================================  */
    /* ============================================================ */

    const setItemFilterPage = (page: number) => {
        console.log('Set Filter Page')
        setItemsFilter({
            ...itemsFilter,
            page: page,
        })
    }

    const setItemFilterType = (typeId: string) => {
        console.log('Set Filter Type')
        setItemsFilter({
            ...itemsFilter,
            type: typeId,
        })
    }

    const getAvailableItemTypes = () => {
        return availableTypes
    }

    const getItemFilterType = () => {
        return itemsFilter?.type
            ? availableTypes.find((t) => t.id === itemsFilter.type)
            : everything()
    }

    const getItemFilterPage = () => {
        return itemsFilter?.page
    }

    const setItemFilterQueryText = (query: string) => {
        console.log('Set Filter Query Text')
        setItemsFilter({
            ...itemsFilter,
            queryText: query,
            page: 1,
        })
    }

    const getItemFilterQueryText = () => {
        return itemsFilter?.queryText
    }

    const getItemList = () => {
        return mainItemList
    }

    const isLoadingResultList = () => {
        return loadingResultList
    }

    const getItemFilter = () => {
        return itemsFilter
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

    /* ===== INITIALIZATION========================================  */
    /* ============================================================ */

    const convertQueryToFilter = (query): ItemFilter => {
        return {
            type: query.type ? (query.type as string) : null,
            tags: query.tags ?? null,
            page: parseInt(query.page) ?? 1,
            pageSize: PageSize,
            queryText: query.queryText ?? null,
        }
    }

    const updateFilterFromUrlQuery = (query: any) => {
        if (Object.keys(query).length > 0) {
            const filter = convertQueryToFilter(query)

            if (!itemFiltersCompare(filter, itemsFilter)) {
                setItemsFilter(filter)
            }
        }
    }

    const updateUrlQueryFromFilter = (itemFilter: ItemFilter) => {
        if (!itemFilterEmpty(itemFilter)) {
            const url = buildQueryUrl(itemFilter)
            router.push(url)
        } else {
            router.replace('/')
        }
    }

    useEffect(() => {
        fetchTypes()
    }, [])

    useEffect(() => {
        if (itemsFilter !== initialFilter) {
            queryItems()
        }
    }, [itemsFilter])

    /* ===========================================================  */
    /* ============================================================ */

    return (
        <AppStateContext.Provider
            value={{
                availableTypes,
                availableTags,
                createItem,
                queryItems,
                addTag,
                removeTag,
                getAvailableItemTypes,
                setItemFilterPage,
                getItemFilterPage,
                setItemFilterType,
                getItemFilterType,
                setItemFilterQueryText,
                getItemFilterQueryText,
                getItemFilter,
                getItemList,
                getAdminActive,
                setAdminActive,
                isLoadingResultList,
                toggleAdminActive,
                voteItem,
                deleteItem,
                updateFilterFromUrlQuery,
                updateUrlQueryFromFilter,
            }}
        >
            {children}
        </AppStateContext.Provider>
    )
}
