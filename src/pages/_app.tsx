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
import 'react-markdown-editor-lite/lib/index.css'
import { AuthProvider } from '@/contexts/authContext'
import { AppStateProvider } from '@/contexts/appContext'
import { Layout } from '@/components/Layout'
import { AppActionsProvider } from '@/contexts/appActionsContext'
import { useEffect } from 'react'
import api from '@/backend/api'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

const App = ({ Component, pageProps }: AppProps) => {
    useEffect(() => {
        api.interceptors.request.use(
            (config) => {
                NProgress.start()
                return config
            },
            (error) => {
                NProgress.done()
                return Promise.reject(error)
            }
        )
    }, [])

    return (
        <MsgBusProvider>
            <AppStateProvider>
                <AppActionsProvider>
                    <AuthProvider>
                        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                            <Head>
                                <meta
                                    name="viewport"
                                    content="width=device-width, initial-scale=1"
                                />
                            </Head>
                            <DefaultSeo {...SEO} />
                            <Layout>
                                <Component {...pageProps} />
                                <Toaster />
                                <div id="modal-container"></div>
                            </Layout>
                        </ThemeProvider>
                    </AuthProvider>
                </AppActionsProvider>
            </AppStateProvider>
        </MsgBusProvider>
    )
}

export default App
