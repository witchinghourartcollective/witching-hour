'use client'

import { useEffect } from 'react'

const TARGET_MESSAGES = [
  'setExternalProvider is not a function',
  'destroyTonkeeper is not a function',
] as const

function isKnownExtensionProviderError(value: unknown) {
  if (!(value instanceof Error)) {
    return false
  }

  const messageMatches = TARGET_MESSAGES.some((message) =>
    value.message.includes(message),
  )
  const stack = value.stack ?? ''
  const stackMatches =
    stack.includes('chrome-extension://') || stack.includes('TonProvider')

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

      if (TARGET_MESSAGES.some((message) => event.message.includes(message))) {
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
