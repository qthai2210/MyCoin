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
            icon="/icons/passphrase.svg"
            title="Generate new seed phrase"
            description="Create a new wallet with a secure, randomly generated 12-word recovery phrase"
            official={true}
            linkTo="/create/password"
          />

          <WalletOption
            icon="/icons/private-key.svg"
            title="Import private key"
            description="Import an existing wallet using your private key"
            linkTo="/create/import/private-key"
          />

          <WalletOption
            icon="/icons/recovery.svg"
            title="Import recovery phrase"
            description="Import an existing wallet using a 12 or 24-word recovery phrase"
            linkTo="/create/import/phrase"
          />

          <WalletOption
            icon="/icons/json.svg"
            title="Import JSON file"
            description="Import a wallet from a JSON keystore file"
            linkTo="/create/import/json"
          />

          {/* Restore option with separator */}
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
