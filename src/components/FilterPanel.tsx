import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useBus } from 'react-bus'
import { useTheme } from 'next-themes'
import { useFetch } from '@/backend/requestHooks'
import toast from 'react-hot-toast'
import ItemType from '@/types/ItemType'
import { ComponentEvents } from './events'
import { SkeletonLoader } from './SkeletonLoader'

type SelectorProps = {
    color: string
    itemType: ItemType
    active: boolean
    callback: Function
}

const ActivitySelector = ({ color, itemType, active, callback }: SelectorProps) => {
    var elementClass = classNames(
        'focus:outline-none',
        'uppercase',
        'cursor-default',
        'px-4',
        'py-1',
        'mx-1',
        'my-1',
        'transition-colors',
        'border-4',
        'text-black-300',
        'rounded-full',
        {
            ['bg-transparent']: !active,
            [`border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''} `]: !active,
            [`hover:border-${color}${
                color !== 'white' && color !== 'black' ? '-500' : ''
            }`]: !active,
        },
        {
            [`border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''}`]: active,
            [`bg-${color}${color !== 'white' && color !== 'black' ? '-500' : ''}`]: active,
            [`${color != 'white' ? 'text-white' : 'text-black'}`]: active,
        }
    )

    return (
        <button
            onClick={() => {
                callback(itemType)
            }}
            className={elementClass}
        >
            {itemType?.name ?? 'Everything'}
        </button>
    )
}

type Props = {
    selectedItemType: string
}

export const FilterPanel = ({ selectedItemType }: Props) => {
    const eventBus = useBus()

    const [mounted, setMounted] = useState(false)

    const { theme } = useTheme()

    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    const filterItemFromItemId = (itemId: string) => {
        if (!itemId) {
            return null
        }
        const match = itemTypes.filter((it) => it.id === itemId)
        if (match.length > 0) {
            return match[0]
        }

        return null
    }

    const [currentItemType, setItemType] = useState<ItemType>(null)

    useEffect(() => {
        if (selectedItemType) {
            setItemType(filterItemFromItemId(selectedItemType))
        }
    }, [itemTypes])

    useEffect(() => {
        if (itemTypesFetchError) {
            toast.error(`An error ocurred while loading Item Types: ${itemTypesFetchError}`)
        }
    }, [itemTypesFetchError])

    useEffect(() => setMounted(true), [])

    const onClickSelector = (itemType: ItemType) => {
        setItemType(itemType)

        var filter = {
            itemTypeId: null,
            tags: [],
        }

        filter.itemTypeId = itemType?.id ?? null

        eventBus.emit(ComponentEvents.FilterChanged, filter)
    }

    if (!mounted) {
        return null
    }

    return (
        <>
            <div className="flex my-5">
                <div className="flex m-auto flex-wrap">
                    <ActivitySelector
                        itemType={null}
                        callback={onClickSelector}
                        active={currentItemType === null}
                        color={theme === 'dark' ? 'white' : 'black'}
                    />

                    {itemTypes ? (
                        itemTypes.map((type: ItemType) => {
                            return (
                                <ActivitySelector
                                    key={type.id}
                                    itemType={type}
                                    callback={onClickSelector}
                                    active={currentItemType && currentItemType.id === type.id}
                                    color={type.color}
                                />
                            )
                        })
                    ) : (
                        <SkeletonLoader />
                    )}
                </div>
            </div>
            <div className="w-full my-5 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg p-10 text-gray-800 dark:text-gray-100 relative overflow-hidden min-w-80 max-w-3xl transition-colors">
                <div className="relative mt-1">
                    <input
                        type="text"
                        className="w-full pl-3 pr-10 py-2 border-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Search..."
                    />
                    <button className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900 transition-colors">
                        <i className="mdi mdi-magnify"></i>
                    </button>
                </div>
                <div className="absolute top-0 left-0 w-full h-2 flex">
                    <div className="h-2 bg-green-500 flex-1"></div>
                    <div className="h-2 bg-yellow-500 flex-1"></div>
                    <div className="h-2 bg-blue-500 flex-1"></div>
                    <div className="h-2 bg-purple-500 flex-1"></div>
                    <div className="h-2 bg-red-500 flex-1"></div>
                </div>
            </div>
        </>
    )
}
