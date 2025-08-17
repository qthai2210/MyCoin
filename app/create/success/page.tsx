import Link from 'next/link';
import styles from './success.module.css';

export default function SuccessPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Wallet Created Successfully!</h1>
        <p className={styles.message}>Your wallet has been created and is ready to use.</p>
        <Link href="/" className={styles.button}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
