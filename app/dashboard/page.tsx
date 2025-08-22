"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./dashboard.module.css";
import { formatAddress, formatAmount } from "@/utils/formatter";
import { useWallet } from "@/context/WalletContext";
import { Transaction } from "@/services/api";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const {
    wallet,
    walletStats,
    transactions,
    isLoading,
    error,
    refreshWalletStats,
    loadTransactionHistory,
  } = useWallet();

  useEffect(() => {
    setMounted(true);

    // Refresh data when dashboard loads
    if (wallet?.address) {
      refreshWalletStats();
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  if (!mounted) {
    return null;
  }

  if (!wallet || !walletStats) {
    return (
      <div className={styles.container}>
        <div className={styles.noWalletMessage}>
          <h2>No Wallet Found</h2>
          <p>Please create or restore a wallet to continue</p>
          <Link href="/" className={styles.homeButton}>
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logoSection}>
          <Image src="/logo-enkrypt.svg" alt="MyCoin" width={120} height={28} />
        </div>
        <nav className={styles.nav}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                activeTab === "overview" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "send" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("send")}
            >
              Send
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "receive" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("receive")}
            >
              Receive
            </button>
          </div>
          <div className={styles.accountSection}>
            <span className={styles.networkBadge}>MyCoin</span>
            <div className={styles.addressPill}>
              <span>{formatAddress(wallet.address)}</span>
              <button
                className={styles.copyButton}
                onClick={() => navigator.clipboard.writeText(wallet.address)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4V1H14V11H11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="2"
                    y="4"
                    width="9"
                    height="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className={styles.content}>
        {isLoading && <div className={styles.loadingIndicator}>Loading...</div>}

        {error && <div className={styles.errorMessage}>Error: {error}</div>}

        {activeTab === "overview" && !isLoading && (
          <div className={styles.overviewContent}>
            <div className={styles.balanceCard}>
              <h2 className={styles.balanceLabel}>Your Balance</h2>
              <div className={styles.balanceAmount}>
                {walletStats.balance} MYC
              </div>
              <div className={styles.balanceUsd}>
                ${(walletStats.balance * 2).toFixed(2)}
              </div>
            </div>

            <div className={styles.actionsCard}>
              <Link href="/dashboard/send" className={styles.actionButton}>
                <span className={styles.actionIcon}>↑</span>
                Send
              </Link>
              <Link href="/dashboard/receive" className={styles.actionButton}>
                <span className={styles.actionIcon}>↓</span>
                Receive
              </Link>
              <button
                onClick={refreshWalletStats}
                className={styles.actionButton}
              >
                <span className={styles.actionIcon}>↻</span>
                Refresh
              </button>
              <Link href="/" className={styles.actionButton}>
                <span className={styles.actionIcon}>⚙️</span>
                Settings
              </Link>
            </div>

            <div className={styles.transactionsCard}>
              <h3 className={styles.sectionTitle}>Recent Transactions</h3>
              {transactions.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No transactions yet</p>
                </div>
              ) : (
                <div className={styles.transactionsList}>
                  {transactions.map((tx) => (
                    <div key={tx.id} className={styles.transactionItem}>
                      <div className={styles.transactionIcon}>
                        {tx.fromAddress === wallet.address ? "↑" : "↓"}
                      </div>
                      <div className={styles.transactionInfo}>
                        <div className={styles.transactionType}>
                          {tx.fromAddress === wallet.address
                            ? "Sent"
                            : "Received"}
                        </div>
                        <div className={styles.transactionAddress}>
                          {tx.fromAddress === wallet.address
                            ? `To: ${formatAddress(tx.toAddress)}`
                            : `From: ${formatAddress(tx.fromAddress)}`}
                        </div>
                      </div>
                      <div className={styles.transactionAmount}>
                        <div
                          className={`${styles.amount} ${
                            tx.fromAddress === wallet.address
                              ? styles.negative
                              : styles.positive
                          }`}
                        >
                          {tx.fromAddress === wallet.address ? "-" : "+"}
                          {tx.amount} MYC
                        </div>
                        <div className={styles.timestamp}>
                          {new Date(tx.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "send" && (
          <div className={styles.tabContent}>
            <div className={styles.redirectMessage}>
              <p>Redirecting to send page...</p>
              <Link href="/dashboard/send" className={styles.redirectButton}>
                Go to Send Page
              </Link>
            </div>
          </div>
        )}

        {activeTab === "receive" && (
          <div className={styles.tabContent}>
            <ReceiveView address={wallet.address} />
          </div>
        )}
      </main>
    </div>
  );
}

// Receive View Component
function ReceiveView({ address }: { address: string }) {
  return (
    <div className={styles.formCard}>
      <h2 className={styles.formTitle}>Receive MYC</h2>

      <div className={styles.qrContainer}>
        <div className={styles.qrPlaceholder}>
          {/* In a real app, we would generate a QR code here */}
          QR Code for {formatAddress(address)}
        </div>
      </div>

      <div className={styles.addressContainer}>
        <p className={styles.addressLabel}>Your MyCoin Address</p>
        <div className={styles.addressValue}>
          {address}
          <button
            className={styles.copyFullButton}
            onClick={() => navigator.clipboard.writeText(address)}
          >
            Copy
          </button>
        </div>
      </div>

      <p className={styles.receiveInfo}>
        Share your address to receive MYC and other tokens compatible with the
        MyCoin network.
      </p>
    </div>
  );
}
