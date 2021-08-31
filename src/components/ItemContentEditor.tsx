import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Item } from '@/types/Item'
import MarkdownIt from 'markdown-it'
import toast from 'react-hot-toast'
import { ItemService } from '@/backend/itemService'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
})

type ItemContentEditorProps = {
    itemId?: string
}

const mdParser = new MarkdownIt()

export const ItemContentEditor = (props: ItemContentEditorProps) => {
    const [editedItem, setEditedItem] = useState<Item>(null)
    const [editedContent, setEditedContent] = useState('')

    useEffect(() => {
        fetchItem(props.itemId)
    }, [props.itemId])

    const fetchItem = async (id: string) => {
        if (id) {
            const item = await ItemService.getItem(id)

            if (item.content && item.content.length > 0) {
                setEditedContent(item.content)
            }

            setEditedItem(item)
        } else {
            setEditedItem(null)
        }
    }

    const handleChange = ({ html, text }) => {
        setEditedContent(text)
    }

    const handleSave = async () => {
        await ItemService.editItem(editedItem.id, { content: editedContent })

        toast.success('Item Content Edited Successfuly.')
    }

    return (
        <>
            {editedItem ? (
                <div className="w-full h-full">
                    <div className="flex">
                        <h1 className="py-3 inline-flex">{editedItem.name}</h1>
                        <div className="inline-flex ">
                            <button
                                onClick={handleSave}
                                className="h-8 px-5 m-2 text-indigo-100 bg-green-500 rounded-lg focus:shadow-outline hover:bg-green-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    <MdEditor
                        value={editedContent}
                        style={{ height: '700px' }}
                        renderHTML={(text: string) => mdParser.render(text)}
                        plugins={[
                            'header',
                            'font-bold',
                            'font-italic',
                            'font-underline',
                            'font-strikethrough',
                            'list-unordered',
                            'list-ordered',
                            'block-quote',
                            'block-wrap',
                            'block-code-inline',
                            'block-code-block',
                            'clear',
                            'logger',
                            'mode-toggle',
                            'full-screen',
                        ]}
                        onChange={handleChange}
                        config={{
                            allowPasteImage: false,
                        }}
                    />
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <h2>No Item Selected</h2>
                </div>
            )}
        </>
    )
}
