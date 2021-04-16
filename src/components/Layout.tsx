import siteMetadata from '@/data/siteMetadata.json'
import { Footer } from './Footer'
import { LinkEx } from './Link'
import { SectionContainer } from './SectionContainer'
import { ThemeSwitch } from './ThemeSwitch'
import { UserButton } from './UserButton'

export const Layout = ({ children }) => (
    <SectionContainer>
        <div className="flex flex-col justify-between">
            <header className="flex items-center justify-between py-10">
                <div>
                    <LinkEx href="/" aria-label="YouTeepMe!">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-blue-800 dark:text-blue-200 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                                YouTeepMe!
                            </h1>
                        </div>
                        <p className="p-3 text-lg leading-7 text-gray-500 dark:text-gray-400">
                            {siteMetadata.description}
                        </p>
                    </LinkEx>
                </div>
                <div>
                    <UserButton />
                </div>
                <div className="flex items-center text-base leading-5">
                    <ThemeSwitch />
                </div>
            </header>
            <main className="mb-auto">{children}</main>
            <Footer />
        </div>
    </SectionContainer>
)
