import { AuthContext } from '@/contexts/authContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FaUser } from 'react-icons/fa'

export const UserButton = () => {
    const { loggedIn, userInfo } = useContext(AuthContext)

    const [isSectionOpen, setIsSectionOpen] = useState(false)
    const dropDownElement = useRef<HTMLDivElement>()
    const buttonElement = useRef<HTMLButtonElement>()

    const router = useRouter()

    const handleClickOutside = useCallback((event) => {
        if (
            dropDownElement.current &&
            buttonElement.current &&
            !dropDownElement.current.contains(event.target) &&
            !buttonElement.current.contains(event.target)
        ) {
            setIsSectionOpen(false)
        }
    }, [])

    const handleClick = () => {
        if (loggedIn) {
            setIsSectionOpen(!isSectionOpen)
        } else {
            router.push('/login')
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [handleClickOutside])

    return (
        <div className="relative">
            <button
                ref={buttonElement}
                type="button"
                onClick={handleClick}
                className="rounded-md mr-4 p-3 text-gray-800 dark:text-white font-light outline-none focus:outline-none hover:text-black dark:hover:text-gray-50 text-xl"
            >
                <FaUser className="inline-flex mr-4" />
                {loggedIn ? <span className="text-sm inline-flex">{userInfo.email}</span> : false}
            </button>

            <div
                hidden={!isSectionOpen}
                ref={dropDownElement}
                className="p-5 w-60 duration-500 ease-in-out absolute z-20 bg-white dark:bg-gray-800 rounded overflow-hidden shadow-lg"
            >
                {loggedIn ? (
                    <>
                        <div className="mt-2">
                            <Link href="">
                                <a className="flex rounded-full text-white py-2 px-4 text-xs bg-blue-400 hover:bg-blue-500">
                                    <p className="text-sm m-auto font-medium text-white leading-none">
                                        Manage your Account
                                    </p>
                                </a>
                            </Link>
                        </div>
                        <div className="mt-5">
                            <Link href="">
                                <a className="px-4 py-2 bg-red-400 rounded-full hover:bg-red-500 flex">
                                    <p className="text-sm m-auto font-medium text-white leading-none">
                                        Logout
                                    </p>
                                </a>
                            </Link>
                        </div>
                    </>
                ) : (
                    false
                )}
            </div>
        </div>
    )
}
