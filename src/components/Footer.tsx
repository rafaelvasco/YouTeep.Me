import siteMetadata from '@/data/siteMetadata.json'
import { LinkEx } from './Link'

export const Footer = () => (
    <footer>
        <div className="flex flex-col items-center mt-16">
            <div className="flex mb-4 space-x-4"></div>
            <div className="flex mb-2 space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div>{siteMetadata.author}</div>
                <div>{` • `}</div>
                <div>{`© ${new Date().getFullYear()}`}</div>
                <div>{` • `}</div>
                <LinkEx href="/">{siteMetadata.title}</LinkEx>
            </div>
        </div>
    </footer>
)
