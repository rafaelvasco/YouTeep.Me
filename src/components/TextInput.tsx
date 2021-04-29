import { nanoid } from 'nanoid'
import React, { useRef, useState } from 'react'

type TextInputProps<T extends {}> = {
    name: string
    placeholder?: string
    value?: string
    className?: string
    data?: T
    onChange?: (newValue: string, data: T) => void
}

export const TextInput = React.forwardRef(<T extends {}>(props: TextInputProps<T>, ref?) => {
    const element = useRef(null)
    const [value, setValue] = useState(props.value)

    const baseClass =
        'bg-gray-200 dark:bg-gray-900 mt-1 block w-full rounded-md border-none shadow-inner focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 '

    const handleBlur = () => {
        if (element.current.value !== value) {
            props.onChange?.(element.current.value, props.data ?? null)
            setValue(element.current.value)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            element.current.blur()
        }
    }

    return (
        <input
            name={props.name}
            ref={(el) => {
                if (typeof ref === 'function') {
                    ref(el)
                } else if (ref) {
                    ref.current = el
                }
                element.current = el
            }}
            type="text"
            placeholder={props.placeholder ?? ''}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={baseClass + props.className ?? ''}
            id={nanoid()}
            defaultValue={props.value}
        />
    )
})
