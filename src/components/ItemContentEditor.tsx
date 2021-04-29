import { getItem } from '@/backend/itemService'
import { useEffect, useState } from 'react'
import { Item } from '@/types/Item'

type ItemContentEditorProps = {
    itemId?: string
}

export const ItemContentEditor = (props: ItemContentEditorProps) => {
    const [editedItem, setEditedItem] = useState({} as Item)
    const [editedContent, setEditedContent] = useState('')
    const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')

    useEffect(() => {
        fetchItem(props.itemId)
    }, [props.itemId])

    const fetchItem = async (id: string) => {
        if (id) {
            const item = await getItem(id)
            setEditedItem(item)
        } else {
            setEditedItem(null)
        }
    }

    return (
        <>
            {editedItem ? (
                <div className="w-full h-full">
                    <h1 className="py-3">{editedItem.name}</h1>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <h2>No Item Selected</h2>
                </div>
            )}
        </>
    )
}
