import { ENV } from '@/env'
import Script, { ScriptProps } from 'next/script'

type Props = {
  gaMeasurementId?: string
  strategy?: ScriptProps['strategy']
  debugMode?: boolean
  defaultConsent?: 'granted' | 'denied'
  nonce?: string
}

function GtagProvider({
  debugMode = false,
  gaMeasurementId,
  strategy = 'afterInteractive', // next/script strategy option
  defaultConsent = 'granted', // Set the status of Google Analytics's tracking consent
  nonce, // next/script nonce option, //TODO: Set nonce from headers
}: Props) {
  const _gaMeasurementId = ENV.gaMeasurementId ?? gaMeasurementId

  if (!_gaMeasurementId) {
    return null
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${_gaMeasurementId}`}
        strategy={strategy}
      />
      <Script id="google-analytics" nonce={nonce}>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${
              defaultConsent === 'denied'
                ? `gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });`
                : ``
            }
            gtag('config', '${_gaMeasurementId}', {
              page_path: window.location.pathname,
              ${debugMode ? `debug_mode: ${debugMode},` : ''}
            });
          `}
      </Script>
    </>
  )
}

export default GtagProvider
