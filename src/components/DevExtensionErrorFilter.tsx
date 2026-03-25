'use client'

import { useEffect } from 'react'

const TARGET_MESSAGE = 'setExternalProvider is not a function'

function isKnownExtensionProviderError(value: unknown) {
  if (!(value instanceof Error)) {
    return false
  }

  const messageMatches = value.message.includes(TARGET_MESSAGE)
  const stackMatches = value.stack?.includes('chrome-extension://') ?? false

  return messageMatches || stackMatches
}

export function DevExtensionErrorFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const onError = (event: ErrorEvent) => {
      const fromExtension =
        event.filename?.startsWith('chrome-extension://') ||
        isKnownExtensionProviderError(event.error)

      if (!fromExtension) {
        return
      }

      if (event.message.includes(TARGET_MESSAGE)) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (!isKnownExtensionProviderError(event.reason)) {
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
    }

    window.addEventListener('error', onError, true)
    window.addEventListener('unhandledrejection', onUnhandledRejection, true)

    return () => {
      window.removeEventListener('error', onError, true)
      window.removeEventListener('unhandledrejection', onUnhandledRejection, true)
    }
  }, [])

  return null
}
