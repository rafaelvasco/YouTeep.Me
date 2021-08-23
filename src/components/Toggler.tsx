import { useCallback, useEffect, useRef, useState } from 'react'

interface TogglerProps<T extends {}> {
    label?: string
    active?: boolean
    data?: T
    onChange?: (newState: boolean, data: T) => void
}

export const Toggler = <T extends {}>(props: TogglerProps<T>) => {
    const [active, setActive] = useState(props.active ?? false)

    const element = useRef(null)

    const handleOnChange = useCallback(() => {
        setActive(element.current.checked)
        props.onChange?.(element.current.checked, props.data ?? null)
    }, [])

    return (
        <>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="toggleB" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input
                            ref={element}
                            checked={active ?? false}
                            onChange={handleOnChange}
                            type="checkbox"
                            id="toggleB"
                            className="sr-only"
                        />
                        <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full"></div>
                    </div>
                    {props.label ? (
                        <div className="ml-3 text-gray-700 font-medium">{props.label}</div>
                    ) : null}
                </label>
            </div>
        </>
    )
}
