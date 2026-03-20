import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, mainnet } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Witching Hour',
  projectId: '17703620f46ce5a72d0b624db25bcfaa',
  chains: [base, mainnet],
  ssr: true,
})
