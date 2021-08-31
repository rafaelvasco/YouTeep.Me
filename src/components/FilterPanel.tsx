import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useTheme } from 'next-themes'
import { everything, ItemType } from '@/types/ItemType'
import { TextInput } from './TextInput'
import { useAppContext } from '@/contexts/appContext'
import { useRef } from 'react'
import { useMemo } from 'react'

type SelectorProps = {
    color: string
    itemType: ItemType
    active: boolean
    callback: Function
}

const ActivitySelector = ({ color, itemType, active, callback }: SelectorProps) => {
    const elementClass = useMemo(() => {
        return classNames(
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
                [`border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''} `]:
                    !active,
                [`hover:border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''}`]:
                    !active,
            },
            {
                [`border-${color}${color !== 'white' && color !== 'black' ? '-500' : ''}`]: active,
                [`bg-${color}${color !== 'white' && color !== 'black' ? '-500' : ''}`]: active,
                [`${color != 'white' ? 'text-white' : 'text-black'}`]: active,
            }
        )
    }, [active, color])

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

    const inputQueryRef = useRef<HTMLInputElement>()

    const [lastTextQuery, setLastTextQuery] = useState('')
    const [textQuery, setTextQuery] = useState('')

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!lastTextQuery) {
            return
        }
        const timerId = setTimeout(() => updateQueryFilter(), 800)
        return () => clearTimeout(timerId)
    }, [textQuery])

    const updateQueryFilter = () => {
        appState.setMainFilterQueryText(textQuery)
    }

    const onClickSelector = (itemType: ItemType) => {
        appState.setMainFilterType(itemType.id)
    }

    const onQueryTextChanged = (text: string) => {
        if (appState.getMainFilterQueryText() && text === appState.getMainFilterQueryText()) {
            return
        }

        setLastTextQuery(textQuery)
        setTextQuery(text)
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
                        active={
                            appState.getMainFilterType() && appState.getMainFilterType().id === null
                        }
                        color={theme === 'dark' ? 'white' : 'black'}
                    />

                    {appState.getAvailableItemTypes()
                        ? appState.getAvailableItemTypes().map((type: ItemType) => {
                              return (
                                  <ActivitySelector
                                      key={type.id}
                                      itemType={type}
                                      callback={onClickSelector}
                                      active={
                                          appState.getMainFilterType() &&
                                          appState.getMainFilterType().id === type.id
                                      }
                                      color={type.color}
                                  />
                              )
                          })
                        : null}
                </div>
            </div>
            <div className="w-full my-5 mx-auto rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg p-10 text-gray-800 dark:text-gray-100 relative overflow-hidden min-w-80 max-w-3xl">
                <div className="relative mt-1">
                    <TextInput
                        ref={inputQueryRef}
                        onChange={onQueryTextChanged}
                        placeholder="Search..."
                        name="searchInput"
                    />
                </div>
                <div className="absolute top-0 left-0 w-full h-2 flex">
                    <div
                        className={`h-2 bg-${
                            appState.getMainFilterType() && appState.getMainFilterType() !== null
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
