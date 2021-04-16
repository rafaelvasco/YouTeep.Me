import { Item } from '@/types/Item'
import { ItemCard } from './ItemCard'

type Props = {
    items: Item[]
}

export const ItemsList = ({ items }: Props) => {
    return (
        <>
            <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                    Items
                </h1>
            </div>
            <div className="container py-12">
                <div className="flex flex-wrap -m-4">
                    {items && items.length > 0 ? (
                        items.map((item) => (
                            <ItemCard key={item.id} item={item} href="https://www.google.com" />
                        ))
                    ) : (
                        <h2>No Items</h2>
                    )}
                </div>
            </div>
        </>
    )
}
