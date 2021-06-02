import React, { Ref, useState } from 'react'

type SelectOption<T> = {
    label: string
    value: T
    formRef?: Function
}

type SelectProps<T> = {
    name: string
    options: SelectOption<T>[]
    className?: string
    data?: any
    value?: T
    onChange?: (newValue: T | null, data: any) => void
}

export const Select = React.forwardRef(
    <T extends string>(props: SelectProps<T>, ref?: Ref<any>) => {
        const [value, setValue] = useState(props.value ?? props.options[0].value)

        const baseClass =
            'bg-gray-200 dark:bg-gray-900 min-w-min rounded-lg w-24 shadow-inner border-none text-black dark:text-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 '

        return (
            <>
                <select
                    name={props.name}
                    ref={ref}
                    className={baseClass + props.className ?? ''}
                    value={value}
                    onChange={(evt) => {
                        if (evt.target.value) {
                            const value = evt.target.value as T
                            setValue(value)
                            props.onChange?.(value, props.data ?? null)
                        } else {
                            setValue(null)
                            props.onChange?.(null, props.data ?? null)
                        }
                    }}
                >
                    {props.options.map((option) => {
                        return (
                            <option key={option.label} value={option.value}>
                                {option.label}
                            </option>
                        )
                    })}
                </select>
            </>
        )
    }
)
