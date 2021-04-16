import Router from 'next/router'

import type { AppProps } from 'next/app'

import { ThemeProvider } from 'next-themes'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'

import { SEO } from '@/components/SEO'

import NProgress from 'nprogress'

import { Provider as MsgBusProvider } from 'react-bus'

import { Toaster } from 'react-hot-toast'

import '@/styles/tailwind.css'
import '@/styles/global.css'
import 'nprogress/nprogress.css'
import { AuthContainer } from '@/contexts/authContext'
import { RequestResponseInterceptor } from '@/backend/requestResponseInterceptor'
import { Layout } from '@/components/Layout'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <MsgBusProvider>
            <AuthContainer>
                <RequestResponseInterceptor>
                    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                        <Head>
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                        </Head>
                        <DefaultSeo {...SEO} />
                        <Layout>
                            <Component {...pageProps} />
                            <Toaster />
                        </Layout>
                    </ThemeProvider>
                </RequestResponseInterceptor>
            </AuthContainer>
        </MsgBusProvider>
    )
}

export default App
