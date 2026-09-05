<p align="center">
  <img src="./assets/logo-lockup.png" width="340" alt="SoroTip logo" />
</p>

# SoroTip App

**On-chain tipping and creator monetization frontend for Stellar Soroban**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-brightgreen?logo=stellar)](https://stellar.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Drips Wave](https://img.shields.io/badge/Drips-Wave%20Program-8A2BE2)](https://drips.network/wave)

## What is SoroTip

SoroTip is an on-chain tipping and creator monetization protocol on Stellar
Soroban. This app is its web frontend: a public tip page for every creator,
a dashboard for managing your profile and funding goals, and a directory for
discovering creators — all built on [`@sorotip/sdk`](https://www.npmjs.com/package/@sorotip/sdk),
talking directly to the deployed [`sorotip-contracts`](https://github.com/SoroTip/sorotip-contracts)
contract over Soroban RPC. There's no backend and no database — every read and
write goes straight to the chain.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **@sorotip/sdk** — client, Freighter wallet adapter, and React hooks

## Local Setup

```bash
git clone https://github.com/SoroTip/sorotip-app.git
cd sorotip-app
npm install
cp .env.example .env.local
# edit .env.local with your deployed contract's id
npm run dev
```

Without a `Freighter` browser extension installed, wallet-gated pages
(Dashboard, History) will prompt you to connect but read-only pages (creator
profiles, Explore) work immediately.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_STELLAR_NETWORK` | `testnet`, `mainnet`, or `futurenet`. |
| `NEXT_PUBLIC_CONTRACT_ID` | The deployed SoroTip contract's id (`C...`). Required — pages show a "not configured" state until this is set. |
| `NEXT_PUBLIC_RPC_URL` | Soroban RPC endpoint. Defaults to the public testnet RPC if unset. |

## Contributing via Drips Wave

This repo is part of the [Stellar Wave Program](https://drips.network/wave)
on Drips. Contributors browse open issues, get assigned by the maintainer,
and earn USDC rewards for merged pull requests that resolve an issue. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow.

👉 https://drips.network/wave
