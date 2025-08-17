import Link from 'next/link';
import styles from './restore.module.css';

export default function RestorePage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Restore Existing Wallet</h1>
        <p>This page is under construction.</p>
        <Link href="/" className={styles.backButton}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
