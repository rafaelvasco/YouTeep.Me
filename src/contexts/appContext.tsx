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
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { buildQueryUrl } from '@/lib/utils'

export interface AppStateData {
    availableTypes: ItemType[]
    availableTags: string[]

    getAvailableItemTypes: () => Array<ItemType>
    setMainFilterPage: (page: number) => void
    getMainFilterPage: () => number
    setMainFilterType: (typeId: string) => void
    getMainFilterType: () => ItemType
    setMainFilterQueryText: (query: string) => void
    getMainFilterQueryText: () => string
    setMainFilter: (filter: ItemFilter) => void

    queryItems: () => void

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
        queryText: null,
    })

    const router = useRouter()

    const [mainItemList, setMainItemList] = useState<ItemQueryResult>(null)

    const [availableTypes, setAvailableTypes] = useState<ItemType[]>([])

    const [adminActivated, setAdminActivated] = useState(false)

    const [availableTags, setAvailableTags] = useState([])

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

    const getAvailableItemTypes = () => {
        return availableTypes
    }

    const getMainFilterType = () => {
        return itemsFilter?.type
            ? availableTypes.find((t) => t.id === itemsFilter.type)
            : everything()
    }

    const getMainFilterPage = () => {
        return itemsFilter?.page
    }

    const setMainFilterQueryText = (query: string) => {
        setItemsFilter({
            ...itemsFilter,
            queryText: query,
            page: 1,
        })
    }

    const getMainFilterQueryText = () => {
        return itemsFilter?.queryText
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

    const updateFilterFromUrlQuery = async (query) => {
        if (Object.keys(query).length > 0) {
            const filter = convertQueryToFilter(query)

            if (!itemFiltersCompare(filter, itemsFilter)) {
                console.log('NOT EQUAL')
                setMainFilter(filter)
            }
        }
    }

    const filterToUrlQuery = (itemFilter: ItemFilter) => {
        if (!itemFilterEmpty(itemFilter)) {
            const url = buildQueryUrl(itemFilter)
            router.push(url)
        } else {
            router.replace('/')
        }
    }

    /* ===========================================================  */
    /* ============================================================ */

    useEffect(() => {
        fetchTypes()
    }, [])

    useEffect(() => {
        updateFilterFromUrlQuery(router.query)
    }, [router.isReady])

    useEffect(() => {
        filterToUrlQuery(itemsFilter)
    }, [itemsFilter])

    useEffect(() => {
        console.log('QUERY ITEMS')
        queryItems()
    }, [itemsFilter])

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
                setMainFilterPage,
                getMainFilterPage,
                setMainFilterType,
                getMainFilterType,
                setMainFilterQueryText,
                getMainFilterQueryText,
                setMainFilter,
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
