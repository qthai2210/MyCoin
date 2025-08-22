# MyCoin Wallet

A cryptocurrency wallet implementation built with Next.js that provides secure wallet management.

## Features

### Wallet Creation

- Create a new wallet with a recovery phrase
- Import existing wallet using:
  - Private key
  - Recovery phrase (12 or 24 words)
  - JSON keystore file

### Wallet Management

- View account balance and USD value
- See transaction history
- Secure wallet with password

### Transactions

- Send cryptocurrency to other addresses
- Receive cryptocurrency with shareable address
- Swap and buy cryptocurrency (UI only)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## User Flow

The application follows this user flow:

1. Landing page → Create wallet or Restore wallet
2. Choose wallet creation method (new phrase, private key, etc.)
3. Set password → View recovery phrase → Verify phrasev

4. Dashboard (view balance, send/receive crypto)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
