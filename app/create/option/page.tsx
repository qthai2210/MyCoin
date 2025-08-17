import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WalletOption from "@/components/WalletOption";
import Link from "next/link";
import styles from "./option.module.css";

export default function WalletOptionsPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.walletContainer}>
        <Link href="/create" className={styles.backLink}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back</span>
        </Link>

        <h1 className={styles.title}>Choose wallet creation method</h1>
        <p className={styles.subtitle}>
          Select one of the available methods to create your wallet
        </p>

        <div className={styles.optionsContainer}>
          <WalletOption
            icon="/icons/browser-extension.svg"
            title="Install Enkrypt browser extension"
            description="MEW's official browser extension. Connect to web3 on Ethereum and Polygon, manage your NFTs, buy send and swap"
            official={true}
            linkTo="/create/password"
          />

          <WalletOption
            icon="/icons/mobile-app.svg"
            title="Download MEW wallet app"
            description="Our official mobile app to create your wallet, and connect to MEW Web using your mobile phone"
            official={true}
            linkTo="/create/password"
          />

          <WalletOption
            icon="/icons/hardware-wallet.svg"
            title="Buy a hardware wallet"
            description="For the highest standard of security, buy a hardware wallet and use it with MEW"
            official={false}
            linkTo="/create/password"
          />

          <WalletOption
            icon="/icons/software-wallet.svg"
            title="Software"
            description="Software methods like Keystore File and Mnemonic Phrase should only be used in offline settings by experienced users"
            official={false}
            notRecommended={true}
            linkTo="/create/password"
          />

          <WalletOption
            icon="/icons/restore-wallet.svg"
            title="Restore Existing Wallet"
            description="Recover your wallet using a recovery phrase, private key, or keystore file"
            linkTo="/restore/password"
            isRestore={true}
          />
        </div>
      </div>

      <Footer />
    </main>
  );
}
