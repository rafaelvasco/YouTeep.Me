import Image from 'next/image'
import { useBus } from 'react-bus'
import { ComponentEvents } from './events'
import { Item } from '@/types/Item'

type Props = {
    item: Item
}

export const ItemCard = (props: Props) => {
    const eventBus = useBus()

    const triggerView = () => {
        eventBus.emit(ComponentEvents.ItemViewTriggered, props.item)
    }

    return (
        <div className="relative cursor-pointer p-4 md:w-1/2 md" style={{ maxWidth: '544px' }}>
            <div className="h-full border-2 border-gray-200 bg-gray-100 border-opacity-60 dark:border-gray-800 dark:bg-gray-800 rounded-md overflow-hidden transition-colors">
                <Image
                    onClick={triggerView}
                    alt={props.item.name}
                    src={props.item.mainImage ?? '/static/images/time-machine.jpg'}
                    className="lg:h-48 md:h-36 object-cover object-center bg-white"
                    width={544}
                    height={306}
                />
                <div className="p-6">
                    <h2
                        onClick={triggerView}
                        className="text-2xl font-bold leading-8 tracking-tight mb-3"
                    >
                        {props.item.name}
                    </h2>
                    <p className="uppercase bg-blue-600 rounded-xl py-1 px-3 w-min text-white max-w-none dark:white mb-3">
                        {props.item.type.name}
                    </p>
                </div>
            </div>
        </div>
    )
}
