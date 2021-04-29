import Image from 'next/image'
import { useContext } from 'react'
import { AuthContext } from '@/contexts/authContext'
import { RiDeleteBin2Fill } from 'react-icons/ri'
import { useBus } from 'react-bus'
import { ComponentEvents } from './events'
import { LinkEx } from './Link'
import { Item } from '@/types/Item'

type Props = {
    item: Item
    href: string
}

export const ItemCard = ({ item, href }: Props) => {
    const { userInfo } = useContext(AuthContext)

    const eventBus = useBus()

    return (
        <div className="relative p-4 md:w-1/2 md" style={{ maxWidth: '544px' }}>
            <div className="h-full border-2 border-gray-200 bg-gray-100 border-opacity-60 dark:border-gray-800 dark:bg-gray-800 rounded-md overflow-hidden transition-colors">
                {href ? (
                    <LinkEx href={href} aria-label={`Link to ${item.name}`}>
                        <Image
                            alt={item.name}
                            src={item.mainImage ?? '/static/images/time-machine.jpg'}
                            className="lg:h-48 md:h-36 object-cover object-center bg-white"
                            width={544}
                            height={306}
                        />
                    </LinkEx>
                ) : (
                    <Image
                        alt={item.name}
                        src={item.mainImage ?? '/static/images/time-machine.jpg'}
                        className="lg:h-48 md:h-36 object-cover object-center bg-white"
                        width={544}
                        height={306}
                    />
                )}
                <div className="p-6">
                    <h2 className="text-2xl font-bold leading-8 tracking-tight mb-3">
                        {href ? (
                            <LinkEx href={href} aria-label={`Link to ${item.name}`}>
                                {item.name}
                            </LinkEx>
                        ) : (
                            item.name
                        )}
                    </h2>
                    <p className="uppercase bg-blue-600 rounded-xl py-1 px-3 w-min text-white max-w-none dark:white mb-3">
                        {item.type.name}
                    </p>
                </div>
            </div>
        </div>
    )
}
