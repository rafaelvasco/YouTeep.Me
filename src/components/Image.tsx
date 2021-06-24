import { useState } from "react"
import { IconType } from "react-icons/lib"
import { FaUser } from 'react-icons/fa'

export type ImageProps = {
    src: string
    href?: string
    alt: string
    className?: string
    hoverIcon?: IconType
}

export const Image = (props: ImageProps) => {
    const [enabled, setEnabled] = useState(true)
    const [iconVisible, setIconVisible] = useState(false)


    if (!enabled) {
        return null
    }

    const handleError = () => {
        setEnabled(false)
    }

    const handleMouseEnter = () => {
        setIconVisible(true)
    }

    const handleMouseLeave = () => {
        setIconVisible(false)
    }

    return (
        <div className="relative">
            <a href={props.href ?? null} target="_blank" className="block">
                <img
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onError={handleError}
                    className={' object-cover transition-opacity ' + (iconVisible ? ' opacity-30 ' : ' opacity-100 ') + props.className ?? ''} src={props.src} alt={props.alt} />
            </a>
            <div className={' transition-opacity opacity-0 absolute top-1/2 left-1/2 transform -translate-1/2 -translate-1/2 '}>
                   <FaUser />
            </div>
        </div>
    )
}