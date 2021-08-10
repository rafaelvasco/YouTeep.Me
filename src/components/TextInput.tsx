import React, { Ref } from 'react'
import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'

type InputElement = HTMLInputElement | HTMLTextAreaElement
type InputChangeEvent = React.ChangeEvent<InputElement>

interface TextInputProps<T> {
    value?: string
    onChange?: (val: string, data: any) => void
    name: string
    placeholder?: string
    autoFocus?: boolean
    type?: 'email' | 'password' | 'text'
    textarea?: boolean
    className?: string
    visible?: boolean
    data?: any
    required?: boolean
    formControl?: Control<any>
}

export const TextInput = React.forwardRef(
    <T extends any>(
        {
            onChange,
            textarea = false,
            className,
            required = false,
            value,
            visible = true,
            name,
            formControl,
            data = null,
            ...rest
        }: TextInputProps<T>,
        ref?: Ref<any>
    ) => {
        const [val, setVal] = useState(value ?? '')

        const InputElement = textarea ? 'textarea' : 'input'
        const baseClass =
            'bg-gray-200 dark:bg-gray-900 mt-1 px-5 py-3 w-full rounded-md border-none shadow-inner focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50 '
        return (
            <>
                {formControl ? (
                    <Controller
                        name={name}
                        control={formControl}
                        rules={{ required }}
                        render={({ field }) => (
                            <InputElement
                                value={val}
                                ref={ref}
                                className={baseClass + (className ?? (!visible ? 'hidden' : ''))}
                                onChange={({ target: { value } }: InputChangeEvent) => {
                                    onChange?.(value, data)
                                    setVal(value)
                                    field.onChange(value)
                                }}
                                {...rest}
                            />
                        )}
                    />
                ) : (
                    <InputElement
                        value={val}
                        ref={ref}
                        className={baseClass + (className ?? '')}
                        onChange={({ target: { value } }: InputChangeEvent) => {
                            onChange?.(value, data)
                            setVal(value)
                        }}
                        {...rest}
                    />
                )}
            </>
        )
    }
)
