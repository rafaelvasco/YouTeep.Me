import { useReducer, useState } from 'react'
import { useBus, useListener } from 'react-bus'
import classNames from 'classnames'
import { ComponentEvents } from './events'
import { AdminPanelUsers } from './AdminPanelUsers'
import { AdminPanelItems } from './AdminPanelItems'
import { ItemContentEditor } from './ItemContentEditor'

type AdminSectionButtonProps = {
    id: number
    label: string
    startSelected?: boolean
}
const SECTIONS = ['Users', 'Items', 'Item Content', 'Section4']

const AdminSectionButton = ({ id, label, startSelected }: AdminSectionButtonProps) => {
    const [selected, setSelected] = useState(startSelected || false)

    const eventBus = useBus()

    const elementClass = classNames(
        'w-full',
        'p-2',
        'shadow-inner',
        'outline-none',
        'focus:outline-none',
        'text-xs',

        'rounded-lg',
        {
            ['dark:bg-green-500']: selected,
            ['bg-green-500']: selected,
        },
        {
            ['dark:bg-blue-500']: !selected,
            ['bg-gray-300']: !selected,
        }
    )

    useListener(ComponentEvents.AdminSectionSelected, (section: number) => {
        setSelected(section === id)
    })

    const handleClick = () => {
        eventBus.emit(ComponentEvents.AdminSectionSelected, id)
    }

    return (
        <button onClick={handleClick} className={elementClass}>
            {label}
        </button>
    )
}

export const AdminPanel = () => {
    const UserSection = 0
    const ItemSection = 1
    const ItemContentSection = 2

    const [itemIdEdit, setItemIdEdit] = useState(null)

    const eventBus = useBus()

    type AdminPanelStateType = {
        sectionIdx: number
        sectionButtons: JSX.Element[]
    }

    const initialState = {
        sectionIdx: 0,
        sectionButtons: SECTIONS.map((section, index) => {
            return (
                <AdminSectionButton
                    id={index}
                    key={section}
                    label={section}
                    startSelected={index === 0}
                />
            )
        }),
    } as AdminPanelStateType

    const [state, changeSection] = useReducer((state: AdminPanelStateType, newIndex: number) => {
        return { ...state, sectionIdx: newIndex }
    }, initialState)

    useListener(ComponentEvents.AdminSectionSelected, (section: number) => {
        if (section < 0) {
            section = 0
        }

        if (section > SECTIONS.length - 1) {
            section = SECTIONS.length - 1
        }

        changeSection(section)
    })

    useListener(ComponentEvents.AdminItemPanelItemEditSelected, (id: string) => {
        setItemIdEdit(id)
        eventBus.emit(ComponentEvents.AdminSectionSelected, ItemContentSection)
    })

    return (
        <div className="h-screen">
            <div className="flex space-x-4 h-4/5">
                <div className="inline-flex flex-col dark:bg-blue-900 bg-gray-100 shadow-md rounded-lg p-2 w-1/12 h-full space-y-3">
                    {state.sectionButtons}
                </div>
                <div className="inline-flex dark:bg-blue-900 bg-gray-100 shadow-md rounded-lg p-5 w-11/12 h-full">
                    {state.sectionIdx === UserSection ? (
                        <AdminPanelUsers />
                    ) : state.sectionIdx === ItemSection ? (
                        <AdminPanelItems />
                    ) : state.sectionIdx === ItemContentSection ? (
                        <ItemContentEditor itemId={itemIdEdit} />
                    ) : state.sectionIdx === 3 ? (
                        <></>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
