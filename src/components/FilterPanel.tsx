import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useTheme } from 'next-themes'
import { useFetch } from '@/backend/requestHooks'
import toast from 'react-hot-toast'
import { everything, ItemType } from '@/types/ItemType'
import { TextInput } from './TextInput'
import { useAppContext } from '@/contexts/appContext'

type SelectorProps = {
    color: string
    itemType: ItemType
    active: boolean
    callback: Function
}

const ActivitySelector = ({ color, itemType, active, callback }: SelectorProps) => {
    const elementClass = classNames(
        'focus:outline-none',
        'uppercase',
        'cursor-default',
        'px-4',
        'py-1',
        'mx-1',
        'my-1',
        'border-4',
        'text-black-300',
        'rounded-full',
        {
            ['bg-transparent']: !active,
            [`border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''} `]: !active,
            [`hover:border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''}`]:
                !active,
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
            {itemType.name}
        </button>
    )
}

export const FilterPanel = () => {
    const appState = useAppContext()

    const [mounted, setMounted] = useState(false)

    const { theme } = useTheme()

    const [itemTypes, itemTypesFetchError] = useFetch<ItemType[]>('item/types')

    useEffect(() => {
        if (itemTypesFetchError) {
            toast.error(`An error ocurred while loading Item Types: ${itemTypesFetchError}`)
        }
    }, [itemTypesFetchError])

    useEffect(() => setMounted(true), [])

    const onClickSelector = (itemType: ItemType) => {
        appState.setMainFilterType(itemType.id)
    }

    if (!mounted) {
        return null
    }

    return (
        <>
            <div className="flex my-5">
                <div className="flex m-auto flex-wrap">
                    <ActivitySelector
                        itemType={everything()}
                        callback={onClickSelector}
                        active={appState.getMainFilter().type === null}
                        color={theme === 'dark' ? 'white' : 'black'}
                    />

                    {itemTypes
                        ? itemTypes.map((type: ItemType) => {
                              return (
                                  <ActivitySelector
                                      key={type.id}
                                      itemType={type}
                                      callback={onClickSelector}
                                      active={appState.getMainFilter().type === type.id}
                                      color={type.color}
                                  />
                              )
                          })
                        : null}
                </div>
            </div>
            <div className="w-full my-5 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg p-10 text-gray-800 dark:text-gray-100 relative overflow-hidden min-w-80 max-w-3xl">
                <div className="relative mt-1">
                    <TextInput placeholder="Search..." name="searchInput" />
                    <button className="block w-7 h-7 text-center text-xl leading-0 absolute top-2 right-2 text-gray-400 focus:outline-none hover:text-gray-900">
                        <i className="mdi mdi-magnify"></i>
                    </button>
                </div>
                <div className="absolute top-0 left-0 w-full h-2 flex">
                    <div
                        className={`h-2 bg-${
                            appState.getMainFilter().type !== null
                                ? appState.getMainFilterType().color + '-500'
                                : theme === 'dark'
                                ? 'white'
                                : 'black'
                        } flex-1`}
                    ></div>
                </div>
            </div>
        </>
    )
}
