import { ItemFilter } from '@/types/ItemFilter'
import { PageSize } from '@/data/config'
import { everything, ItemType } from '@/types/ItemType'
import { createContext, useContext, useState } from 'react'
import { ItemQueryResult } from '@/types/ItemQueryResult'
import { useMemo } from 'react'
import { useEffect } from 'react-router/node_modules/@types/react'

interface AppStateInterface {
    isLoadingResultList: () => boolean
    getAvailableItemTypes: () => Array<ItemType>
    getItemFilterPage: () => number
    getItemFilterType: () => ItemType
    getItemFilterQueryText: () => string
    getItemFilter: () => ItemFilter
    getItemList: () => ItemQueryResult
    getAdminActive: () => boolean

    setItemsFilter: (filter: ItemFilter) => void
    setItemFilterPage: (page: number) => void
    setItemFilterType: (typeId: string) => void
    setItemFilterQueryText: (query: string) => void
    setAdminActive: (active: boolean) => void

    toggleAdminActive: () => void

    setAvailableTypes: (types: Array<ItemType>) => void
    setLoadingResultList: (loading: boolean) => void
    setMainItemList: (result: ItemQueryResult) => void
    setAvailableTags: (tags: Array<any>) => void
}

const AppStateContext = createContext({} as AppStateInterface)

export const useAppContext = () => {
    const ctx = useContext(AppStateContext)

    if (ctx === undefined) {
        throw new Error('useAppContext must be used within an AppStateContainer')
    }

    return ctx
}

export function AppStateProvider({ children }) {
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

    const [mainItemList, setMainItemList] = useState<ItemQueryResult>(null)

    const [availableTypes, setAvailableTypes] = useState<ItemType[]>([])

    const [adminActivated, setAdminActivated] = useState(false)

    const [availableTags, setAvailableTags] = useState([])

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

    const getAdminActive = () => {
        return adminActivated
    }

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

    const setItemFilterQueryText = (query: string) => {
        console.log('Set Filter Query Text')
        setItemsFilter({
            ...itemsFilter,
            queryText: query,
            page: 1,
        })
    }

    const setAdminActive = (active: boolean) => {
        setAdminActivated(active)
    }

    const toggleAdminActive = () => {
        setAdminActivated(!adminActivated)
    }

    /* ===== INITIALIZATION========================================  */
    /* ============================================================ */

    const value = useMemo(
        () => ({
            getAvailableItemTypes,
            getItemFilterPage,
            getItemFilterType,
            getItemFilterQueryText,
            getItemFilter,
            getItemList,
            getAdminActive,
            setItemsFilter,
            setItemFilterType,
            setItemFilterQueryText,
            setAvailableTypes,
            setItemFilterPage,
            setAdminActive,
            setMainItemList,
            setAvailableTags,
            setLoadingResultList,
            isLoadingResultList,
            toggleAdminActive,
        }),
        [itemsFilter, mainItemList, loadingResultList, adminActivated, availableTypes]
    )

    /* ===========================================================  */
    /* ============================================================ */

    return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}
