import React, { RefObject, useEffect } from 'react'

export const useClickOutside = (ref: RefObject<HTMLElement>, handler: Function) => {
    useEffect(() => {
        const clickListener = (event) => {
            // Do nothing if clickin ref's element or its children
            if (!ref.current || ref.current.contains(event.target)) {
                return
            }

            handler(event)
        }

        document.addEventListener('mousedown', clickListener)
        document.addEventListener('touchstart', clickListener)

        return () => {
            document.removeEventListener('mousedown', clickListener)
            document.removeEventListener('touchstart', clickListener)
        }
    }, [ref, handler])
}
