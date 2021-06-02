import { ItemFilter } from '@/types/ItemFilter'
import { PageSize } from '@/data/config'
import { everything, ItemType } from '@/types/ItemType'
import { createContext, useContext, useEffect, useState } from 'react'
import { useFetch } from '@/backend/requestHooks'
import toast from 'react-hot-toast'
import { ItemQueryResult } from '@/types/ItemQueryResult'

export interface AppStateData {
    availableTypes: ItemType[]
    availableTags: string[]

    setMainFilterPage: (page: number) => void
    setMainFilterType: (typeId: string) => void
    getMainFilterType: () => ItemType
    getMainFilter: () => ItemFilter
    setMainFilter: (filter: ItemFilter) => void

    addTag: (tag: string) => void
    removeTag: (tag: string) => void

    mutateMainItemList: () => void

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
    const [itemsFilter, setItemsFilter] = useState<ItemFilter>({
        type: null,
        page: 1,
        pageSize: PageSize,
        tags: null,
    })

    const [adminActivated, setAdminActivated] = useState(false)

    const [availableTags, setAvailableTags] = useState([])

    const [availableTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const [mainItemList, errorMainItemList, mutateMainItemList] = useFetch<ItemQueryResult>(
        'item/query',
        itemsFilter
    )

    const addTag = (tag: string) => {}

    const removeTag = (tag: string) => {}

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

    const getAdminActive = () => {
        return adminActivated
    }

    const setAdminActive = (active: boolean) => {
        setAdminActivated(active)
    }

    const toggleAdminActive = () => {
        setAdminActivated(!adminActivated)
    }

    useEffect(() => {
        if (itemTypesFetchError) {
            toast.error(`An error ocurred while loading Item Types: ${itemTypesFetchError}`)
        }
    }, [itemTypesFetchError])

    useEffect(() => {
        if (errorMainItemList) {
            toast.error(`An error ocurred while loading Items: ${errorMainItemList}`)
        }
    }, [errorMainItemList])

    return (
        <AppStateContext.Provider
            value={{
                availableTypes,
                availableTags,
                addTag,
                removeTag,
                mutateMainItemList,
                setMainFilterPage,
                setMainFilterType,
                getMainFilterType,
                setMainFilter,
                getMainFilter,
                getMainItemList,
                getAdminActive,
                setAdminActive,
                toggleAdminActive,
            }}
        >
            {children}
        </AppStateContext.Provider>
    )
}
