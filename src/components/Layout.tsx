import { useAuthContext } from '@/contexts/authContext'
import siteMetadata from '@/data/siteMetadata.json'
import { UserRole } from '@/types/UserRole'
import { AdminButton } from './AdminButton'
import { Footer } from './Footer'
import { LinkEx } from './Link'
import { SectionContainer } from './SectionContainer'
import { ThemeSwitch } from './ThemeSwitch'
import { UserButton } from './UserButton'

export const Layout = ({ children }) => {
    const { isLoggedIn, getUserInfo } = useAuthContext()

    return (
        <div className="flex flex-col justify-between p-5">
            <SectionContainer>
                <header className="flex items-center justify-between py-10">
                    <div>
                        <LinkEx href="/" aria-label="YouTeepMe!">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-blue-800 dark:text-blue-200 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                                    YouTeepMe!
                                </h1>
                            </div>
                            <p className="p-3 leading-7 text-xs text-gray-500 dark:text-gray-400">
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
                    {isLoggedIn() && getUserInfo().role === UserRole.ADMIN ? <AdminButton /> : null}
                </header>
            </SectionContainer>

            <main className="mb-auto">{children}</main>
            <Footer />
        </div>
    )
}
