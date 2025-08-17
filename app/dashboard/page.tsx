import Link from "next/link";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>MyCoin Wallet Dashboard</h1>
        <p>Your wallet has been successfully created!</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h2>Wallet setup complete</h2>
          <p>
            Your wallet is ready to use. You can now send and receive
            cryptocurrency.
          </p>
          <div className={styles.balanceBox}>
            <p className={styles.balanceLabel}>Current Balance</p>
            <p className={styles.balanceAmount}>0 ETH</p>
          </div>
          <Link href="/" className={styles.homeLink}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
