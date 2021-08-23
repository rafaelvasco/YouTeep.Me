import Image from 'next/image'
import Link from 'next/link'
import { useBus } from 'react-bus'
import { ComponentEvents } from './events'
import { Item } from '@/types/Item'
import { FaHeart } from 'react-icons/fa'
import { useAppContext } from '@/contexts/appContext'

type Props = {
    item: Item
}

export const ItemCard = (props: Props) => {
    const link = `/item/${props.item.id}`

    const appContext = useAppContext()

    return (
        <div className="relative p-4 md:w-1/2 md" style={{ maxWidth: '544px' }}>
            <div className="h-full border-2 border-gray-200 bg-gray-100 border-opacity-60 dark:border-gray-800 dark:bg-gray-800 rounded-md overflow-hidden">
                <Link href={link}>
                    <a>
                        <Image
                            alt={props.item.name}
                            src={props.item.mainImage ?? '/static/images/time-machine.jpg'}
                            className="lg:h-48 md:h-36 object-cover object-center bg-white"
                            width={544}
                            height={306}
                        />
                    </a>
                </Link>

                <div className="p-6">
                    <Link href={link}>
                        <a>
                            <h2 className="text-2xl font-bold leading-8 tracking-tight mb-3">
                                {props.item.name}
                                {` (${props.item.votes}) `}
                            </h2>
                        </a>
                    </Link>

                    <p className="uppercase bg-blue-600 rounded-xl py-1 px-3 w-min text-white max-w-none dark:white mb-3">
                        {props.item.type.name}
                    </p>

                    <FaHeart
                        size={32}
                        onClick={() => {
                            appContext.voteItem(props.item.id)
                        }}
                        className="absolute right-8 bottom-8 cursor-pointer text-red-600 hover:text-red-300 active:text-red-900"
                    />
                </div>
            </div>
        </div>
    )
}
