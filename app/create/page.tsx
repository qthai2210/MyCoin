import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./create.module.css";
import Link from "next/link";

export default function CreateWalletPage() {
  return (
    <main className={styles.main}>
      <Navbar />

      <div className={styles.walletContainer}>
        <h1 className={styles.title}>Create a new wallet</h1>
        <p className={styles.subtitle}>Start the wallet creation process</p>
        <p className={styles.loginLink}>
          Already have a wallet? <Link href="/">Access Wallet</Link>
        </p>

        <div className={styles.actionContainer}>
          <p className={styles.actionDescription}>
            Create a new wallet to securely store your cryptocurrency assets,
            trade tokens, and interact with decentralized applications.
          </p>

          <Link href="/create/option" className={styles.createButton}>
            Get Started
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
