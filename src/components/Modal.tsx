import { useClickOutside } from '@/hooks/useClickOutside'
import React, { useRef } from 'react'
import ReactDOM from 'react-dom'

type ModalProps = {
    children: any
    setOpen: (open: boolean) => void
    confirm?: () => void
    confirmLabel?: string
    closeLabel?: string
}

export const Modal = (props: ModalProps) => {
    const close = () => {
        props.setOpen(false)
    }

    const divRef = useRef()

    useClickOutside(divRef, () => {
        close()
    })

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-80 flex">
            <div
                ref={divRef}
                className="relative p-4 w-auto h-auto bg-white dark:bg-gray-900 m-auto flex-col flex rounded-lg shadow-lg"
            >
                <div className="w-full h-full">{props.children}</div>

                <div className="flex justify-end">
                    {props.confirm ? (
                        <button
                            onClick={() => {
                                props.confirm()
                                close()
                            }}
                            className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-blue-500 rounded-lg focus:shadow-outline hover:bg-blue-800"
                        >
                            {props.confirmLabel ?? 'Confirm'}
                        </button>
                    ) : null}

                    <button
                        onClick={close}
                        className="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-gray-500 rounded-lg focus:shadow-outline hover:bg-gray-800"
                    >
                        {props.closeLabel ?? 'Close'}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-container')
    )
}
