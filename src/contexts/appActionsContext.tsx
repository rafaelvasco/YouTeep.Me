import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'
import { useBus } from 'react-bus'
import { ComponentEvents } from '@/components/events'
import { ItemCreateRequest } from '@/types/ItemCreateRequest'
import { ItemService } from '@/backend/itemService'
import { useAppContext } from './appContext'

export interface AppActionsInterface {
    queryItems: () => void
    createItem: (request: ItemCreateRequest) => void
    addTag: (tag: string) => void
    removeTag: (tag: string) => void
    voteItem: (itemId: string) => void
    deleteItem: (itemId: string) => void
    fetchTypes: () => void
}

const AppActionsContext = createContext<AppActionsInterface>(null)

export const useAppActions = () => {
    const ctx = useContext(AppActionsContext)

    if (ctx === undefined) {
        throw new Error('useAppActions must be used within an AppStateProvider')
    }

    return ctx
}

export function AppActionsProvider({ children }) {
    const eventBus = useBus()

    const appContext = useAppContext()

    /* ===== ITEM ================================================  */
    /* ============================================================ */

    const queryItems = async () => {
        console.log('QUERY ITEMS')

        appContext.setLoadingResultList(true)

        const result = await ItemService.queryItems(appContext.getItemFilter())

        if (result) {
            appContext.setMainItemList(result)
        }

        appContext.setLoadingResultList(false)
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
        appContext.setAvailableTypes(types)
    }

    /* ===== TAGS ================================================= */
    /* ============================================================ */

    const addTag = (tag: string) => {}

    const removeTag = (tag: string) => {}

    return (
        <AppActionsContext.Provider
            value={{
                fetchTypes,
                queryItems,
                createItem,
                addTag,
                removeTag,
                voteItem,
                deleteItem,
            }}
        >
            {children}
        </AppActionsContext.Provider>
    )
}
