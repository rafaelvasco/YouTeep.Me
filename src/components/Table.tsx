import { nanoid } from 'nanoid'
import React from 'react'

function objectValues<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => obj[objKey as keyof T])
}

function objectKeys<T extends {}>(obj: T) {
    return Object.keys(obj).map((objKey) => objKey as keyof T)
}

type PrimitiveType = string | Symbol | number | boolean

function isPrimitive(value: any): value is PrimitiveType {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'symbol'
    )
}

interface MinTableItem {
    id: PrimitiveType
}

type TableProperties<T extends MinTableItem> = Partial<Record<keyof T, string>>

type CustomRenderers<T extends MinTableItem> = Partial<Record<keyof T, (it: T) => React.ReactNode>>

interface TableProps<T extends MinTableItem> {
    className?: string
    columnClasses?: string[]
    items: T[]
    properties: TableProperties<T>
    actions?: Array<(it: T) => React.ReactNode>
    customRenderers?: CustomRenderers<T>
}

const tableBaseClass =
    'mx-auto w-full whitespace-nowrap rounded-lg bg-gray-100 dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-600 overflow-hidden '

const tableHeadTrClass =
    'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-200 uppercase text-sm leading-normal '

const tableHeadThBaseClass = 'font-semibold text-sm uppercase px-6 py-4 text-left '

const tableBodyClass = 'divide-y divide-gray-200 dark:divide-gray-600 '

const tableBodyTdClass = 'px-6 py-4 text-black dark:text-gray-200 '

export const Table = <T extends MinTableItem>(props: TableProps<T>) => {
    function renderRow(item: T, properties: TableProperties<T>) {
        return (
            <tr key={nanoid()}>
                {objectKeys(properties).map((itemProperty, index) => {
                    const customRenderer = props.customRenderers?.[itemProperty]

                    const colClass = tableBodyTdClass + props.columnClasses?.[index] ?? ''

                    if (customRenderer) {
                        return (
                            <td key={nanoid()} className={colClass}>
                                {customRenderer(item)}
                            </td>
                        )
                    }

                    return (
                        <td key={nanoid()} className={colClass}>
                            {isPrimitive(item[itemProperty]) ? item[itemProperty] : ''}
                        </td>
                    )
                })}
                {props.actions ? (
                    <td
                        key={nanoid()}
                        className={
                            tableBodyTdClass +
                                props.columnClasses?.[props.columnClasses.length - 1] ?? ''
                        }
                    >
                        <div className={'flex'}>
                            {props.actions.map((action) => {
                                return (
                                    <div key={nanoid()} className="inline-flex mx-1.5">
                                        {action(item)}
                                    </div>
                                )
                            })}
                        </div>
                    </td>
                ) : null}
            </tr>
        )
    }

    return (
        <table className={tableBaseClass + (props.className ?? '')}>
            <thead>
                <tr className={tableHeadTrClass}>
                    {objectValues(props.properties).map((headerValue, index) => {
                        const colClass = tableHeadThBaseClass + props.columnClasses?.[index] ?? ''

                        return (
                            <th key={nanoid()} className={colClass}>
                                {headerValue}
                            </th>
                        )
                    })}
                    {props.actions ? (
                        <th
                            key={nanoid()}
                            className={
                                tableHeadThBaseClass +
                                    props.columnClasses?.[props.columnClasses.length - 1] ?? ''
                            }
                        >
                            Actions
                        </th>
                    ) : null}
                </tr>
            </thead>
            {props.items && props.items.length > 0 ? (
                <tbody className={tableBodyClass}>
                    {props.items.map((item) => {
                        return renderRow(item, props.properties)
                    })}
                </tbody>
            ) : (
                <tbody className={tableBodyClass}>
                    <tr>
                        <td className={tableBodyTdClass}>No Items</td>
                    </tr>
                </tbody>
            )}
        </table>
    )
}
