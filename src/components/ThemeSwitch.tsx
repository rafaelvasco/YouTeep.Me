import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

export const ThemeSwitch = () => {
    const { theme, setTheme } = useTheme()

    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return null
    }

    return (
        <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="w-8 h-8 p-1 ml-1 mr-1 rounded sm:ml-4 focus:outline-none"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
    )
}
