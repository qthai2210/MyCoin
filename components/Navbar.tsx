/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.svg" alt="MEW" width={90} height={32} />
        </Link>

        <div className={styles.navLinks}>
          <a href="#">Buy Crypto</a>
          <a href="#">Swap Tokens</a>
          <div className={styles.dropdown}>
            <a href="#">
              More features <span className={styles.arrow}>▼</span>
            </a>
          </div>
          <div className={styles.dropdown}>
            <a href="#">
              Resources <span className={styles.arrow}>▼</span>
            </a>
          </div>
          <div className={styles.dropdown}>
            <a href="#">
              Products <span className={styles.arrow}>▼</span>
            </a>
          </div>
          <Link href="/mining" className="text-blue-500 hover:text-blue-700">
            Mining
          </Link>
        </div>

        <div className={styles.walletBtn}>
          <Link href="/" className={styles.accessWallet}>
            Access my wallet
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
