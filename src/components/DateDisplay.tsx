import { parseISO, format } from 'date-fns'
import { useEffect, useState } from 'react'

export const DateDisplay = ({ dateString }) => {
    const [date, setDate] = useState(dateString ? parseISO(dateString) : null)

    useEffect(() => {
        if (!date) {
            setDate(new Date())
        }
    }, [date])

    return date && <span>{format(date, "LLLL d, yyyy 'at' h:m a")}</span>
}
