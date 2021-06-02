import { Item } from '@/types/Item'
import MarkdownIt from 'markdown-it'
import Image from 'next/image'

type ItemViewModalProps = {
    item: Item
}

const mdParser = new MarkdownIt()

export const ItemViewModal = (props: ItemViewModalProps) => {
    const html = props.item.content ? mdParser.render(props.item.content) : null

    return (
        <div className=" grid grid-cols-2 gap-10">
            <div className="p-1 border-2 align-middle border-opacity-10 rounded-lg border-gray-800 dark:border-gray-700  ">
                <Image
                    alt={props.item.name}
                    layout="fixed"
                    src={props.item.mainImage ?? '/static/images/time-machine.jpg'}
                    className="object-cover object-center bg-white"
                    width={590}
                    height={590}
                />
            </div>

            <div>
                {html ? (
                    <div
                        className="overflow-hidden max-h-96 custom-html-style max-w-lg text-gray-800 dark:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: html }}
                    ></div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <h1 className="text-gray-800 dark:text-gray-100 text-lg">No Content</h1>
                    </div>
                )}
            </div>
        </div>
    )
}
