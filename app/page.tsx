import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.logoHeader}>
        <Image
          src="/logo-enkrypt.svg"
          alt="Enkrypt"
          width={120}
          height={28}
          className={styles.logo}
        />
      </div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <Image
              src="/logo-enkrypt.svg"
              alt="Enkrypt"
              width={180}
              height={42}
              className={styles.cardLogo}
            />

            <h1 className={styles.title}>
              Multiple Chains.
              <br />
              One Wallet.
            </h1>

            <p className={styles.description}>
              Enkrypt is a wallet that gives you easy access to all things
              crypto and web3.
            </p>

            <p className={styles.features}>
              Switch accounts and chains with 1 click.
              <br />
              Enkrypt currently supports the Ethereum and Polkadot ecosystems
              with more chains on the way!
            </p>

            <div className={styles.actions}>
              <Link href="/create" className={styles.primaryButton}>
                Create a new wallet
              </Link>

              <Link href="/restore" className={styles.secondaryLink}>
                Restore existing wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
