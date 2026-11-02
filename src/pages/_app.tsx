import '@/styles/global.css'
import '@/styles/date-picker.css'
import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import type { AppPageProps } from '@/apis/server/app'
import { profileAtom } from '@/atoms/profile'
import { settingsAtom, useSettingsStateValue } from '@/atoms/settings'
import { themeAtom } from '@/atoms/theme'
import Layout from '@/components/layouts'
import Theme from '@/components/layouts/Theme'
import { NOT_REQUIRE_AUTH } from '@/constants/auth'
import { ThemeMode } from '@/enums/theme'
import { initLiff } from '@/utils/liff'
import { getLoginUrl, getSafeRedirect } from '@/utils/url'

const HydrateAtoms = ({
  pageProps,
  children
}: {
  pageProps: AppPageProps
  children: React.ReactNode
}) => {
  useHydrateAtoms([
    [profileAtom, pageProps.profile || {}],
    [settingsAtom, pageProps.settings || {}],
    [themeAtom, pageProps.theme || ThemeMode.dark]
  ] as const)
  return children
}

const AppContent = ({ Component, pageProps }: AppProps<AppPageProps>) => {
  const router = useRouter()
  const settings = useSettingsStateValue()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    initialData()
  }, [])

  /** Client guard: runs once after the first (SSR) page load. */
  const initialData = async () => {
    const isPublic = NOT_REQUIRE_AUTH.includes(router.pathname)

    if (settings?.liff_id) {
      await initLiff(settings.liff_id)
    }

    if (pageProps.authenticated && isPublic) {
      await router.replace(getSafeRedirect(router.query.redirect_url))
    } else if (!pageProps.authenticated && !isPublic) {
      await router.replace(getLoginUrl(router.asPath))
    }

    setLoading(false)
  }

  const metaData = settings?.meta_data || {}
  const title = metaData.meta_title || settings?.name || 'VYRA Terminal'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
        />
        <link rel="icon" href="/images/favicon.svg" />
        {!!metaData.meta_description && (
          <meta name="description" content={metaData.meta_description} />
        )}
        {!!metaData.meta_keywords && <meta name="keywords" content={metaData.meta_keywords} />}
        <meta property="og:title" content={title} key="title" />
        {!!metaData.meta_description && (
          <meta property="og:description" content={metaData.meta_description} />
        )}
      </Head>
      <Theme
        primaryColor={settings?.primary_color}
        darkPrimaryColor={settings?.dark_primary_color}
        secondaryColor={settings?.secondary_color}
      />
      {!loading && (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
      <Toaster />
      <div id={'drawer-root'} />
      <div id={'modal-root'} />
      <div id={'print-root'} />
    </>
  )
}

const MyApp = (props: AppProps<AppPageProps>) => {
  return (
    <Provider>
      <HydrateAtoms pageProps={props.pageProps}>
        <AppContent {...props} />
      </HydrateAtoms>
    </Provider>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  const { req, res } = appContext.ctx

  if (typeof window !== 'undefined' || !req || !res) {
    return appProps
  }

  const { getServerAppProps } = await import('@/apis/server/app')
  const serverProps = await getServerAppProps(req, res)

  return { ...appProps, pageProps: { ...appProps.pageProps, ...serverProps } }
}

export default MyApp
