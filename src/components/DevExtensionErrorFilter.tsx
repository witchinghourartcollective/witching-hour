'use client'

import { useEffect } from 'react'

const TARGET_MESSAGES = [
  'setExternalProvider is not a function',
  'destroyTonkeeper is not a function',
  'instance.destroyTonkeeper is not a function',
  'Attempting to use a disconnected port object',
  'Analytics SDK: TypeError: Failed to fetch',
  'AnalyticsSDKApiError',
] as const

function isKnownExtensionProviderError(value: unknown) {
  if (typeof value === 'string') {
    return (
      TARGET_MESSAGES.some((message) => value.includes(message)) ||
      value.includes('chrome-extension://')
    )
  }

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

      const isKnownNoise = TARGET_MESSAGES.some((message) =>
        event.message.includes(message),
      )

      if (isKnownNoise || event.filename?.startsWith('chrome-extension://')) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const isExtensionRejection =
        isKnownExtensionProviderError(event.reason) ||
        (event.reason instanceof Error &&
          (event.reason.stack?.includes('chrome-extension://') ?? false))

      if (!isExtensionRejection) {
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
    }

    window.addEventListener('error', onError, true)
    window.addEventListener('unhandledrejection', onUnhandledRejection, true)

    const originalConsoleError = window.console.error.bind(window.console)
    window.console.error = (...args) => {
      const joined = args
        .map((arg) => {
          if (typeof arg === 'string') {
            return arg
          }

          if (arg instanceof Error) {
            return [arg.message, arg.stack].filter(Boolean).join(' ')
          }

          try {
            return JSON.stringify(arg)
          } catch {
            return ''
          }
        })
        .join(' ')

      if (
        joined.includes('chrome-extension://') &&
        (joined.includes('Analytics SDK') ||
          joined.includes('AnalyticsSDKApiError') ||
          joined.includes('Failed to fetch'))
      ) {
        return
      }

      originalConsoleError(...args)
    }

    return () => {
      window.console.error = originalConsoleError
      window.removeEventListener('error', onError, true)
      window.removeEventListener('unhandledrejection', onUnhandledRejection, true)
    }
  }, [])

  return null
}
