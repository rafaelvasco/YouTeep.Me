import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import ContentLoader from 'react-content-loader'

export const SkeletonLoader = (props) => {
    const [mounted, setMounted] = useState(false)

    const { theme } = useTheme()

    useEffect(() => setMounted(true), [])

    if (!mounted) {
        return null
    }

    return (
        <ContentLoader
            backgroundColor={theme === 'light' ? '#f3f3f3' : '#0d1117'}
            foregroundColor={theme === 'light' ? '#ecebeb' : '#1F2937'}
            viewBox="0 0 100% 650"
            height={650}
            width={'100%'}
            {...props}
        >
            <rect x="0" y="0" rx="5" ry="5" width="40%" height="20" />
            <rect x="0" y="42" rx="5" ry="5" width="100%" height="200" />
            <rect x="0" y="265" rx="5" ry="5" width="100%" height="10" />
            <rect x="0" y="285" rx="5" ry="5" width="100%" height="10" />
            <rect x="0" y="305" rx="5" ry="5" width="100%" height="10" />
            <rect x="0" y="335" rx="5" ry="5" width="65%" height="10" />
            <rect x="75%" y="335" rx="5" ry="5" width="10%" height="10" />
            <rect x="0" y="355" rx="5" ry="5" width="65%" height="10" />
            <rect x="75%" y="355" rx="5" ry="5" width="30%" height="10" />
            <rect x="0" y="375" rx="5" ry="5" width="65%" height="10" />
            <rect x="75%" y="375" rx="5" ry="5" width="30%" height="10" />
            <rect x="0" y="395" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="395" rx="5" ry="5" width="30%" height="8" />
            <rect x="0" y="415" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="415" rx="5" ry="5" width="30%" height="8" />
            <rect x="0" y="445" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="445" rx="5" ry="5" width="30%" height="8" />
            <rect x="0" y="465" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="465" rx="5" ry="5" width="30%" height="8" />
            <rect x="0" y="485" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="485" rx="5" ry="5" width="30%" height="8" />
            <rect x="0" y="505" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="505" rx="5" ry="5" width="30%" height="8" />
            <rect x="0" y="525" rx="5" ry="5" width="65%" height="8" />
            <rect x="75%" y="525" rx="5" ry="5" width="30%" height="8" />
            <rect x="75%" y="550" rx="5" ry="5" width="10%" height="10" />
            <circle cx="76.5%" cy="590" r="18" />
            <circle cx="80%" cy="590" r="18" />
            <circle cx="83.5%" cy="590" r="18" />
            <circle cx="87%" cy="590" r="18" />
            <circle cx="90.5%" cy="590" r="18" />
            <circle cx="94%" cy="590" r="18" />
        </ContentLoader>
    )
}
