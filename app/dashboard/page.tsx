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
    blockchainTransactions,
    isLoading,
    error,
    refreshWalletStats,
    loadTransactionHistory,
    loadBlockchainTransactions,
  } = useWallet();

  // Use blockchain transactions for display
  const displayTransactions =
    blockchainTransactions.length > 0 ? blockchainTransactions : [];

  useEffect(() => {
    setMounted(true);

    // Refresh data when dashboard loads
    if (wallet?.address) {
      refreshWalletStats();
      // Load blockchain transactions instead of user's transactions
      loadBlockchainTransactions();

      // Also load user's transaction history
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  // Debug - log transactions to see what's available
  useEffect(() => {
    if (displayTransactions.length > 0) {
      console.log(
        `Loaded ${displayTransactions.length} blockchain transactions:`,
        displayTransactions
      );
    }
  }, [displayTransactions]);

  // Function to handle transaction refresh with better debugging
  const handleRefreshTransactions = () => {
    if (wallet?.address) {
      console.log("Manually refreshing blockchain transactions");
      setIsLoading(true);
      loadBlockchainTransactions()
        .then(() => {
          console.log("Blockchain transaction refresh complete");
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error refreshing blockchain transactions:", err);
          setIsLoading(false);
        });
    }
  };

  // Function to refresh personal transaction history
  const handleRefreshHistory = () => {
    if (wallet?.address) {
      console.log("Refreshing personal transaction history");
      loadTransactionHistory()
        .then(() => {
          console.log("Transaction history refresh complete");
        })
        .catch((err) => {
          console.error("Error refreshing transaction history:", err);
        });
    }
  };

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
                activeTab === "history" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
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

        {activeTab === "overview" && (
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
              <div className={styles.transactionsHeader}>
                <h3 className={styles.sectionTitle}>Blockchain Transactions</h3>
                <div className={styles.transactionActions}>
                  <button
                    onClick={handleRefreshTransactions}
                    className={styles.refreshButton}
                    title="Refresh blockchain transactions"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path d="M8 5L5 2L8 5Z" fill="currentColor" />
                      <path
                        d="M8 5L5 2M5 2L2 5M5 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button className={styles.customizeButton}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M13.5 8C13.5 8 11.5 12 8 12C4.5 12 2.5 8 2.5 8C2.5 8 4.5 4 8 4C11.5 4 13.5 8 13.5 8Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Customize
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className={styles.loadingState}>
                  <p>Loading blockchain transactions...</p>
                </div>
              ) : displayTransactions.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No blockchain transactions yet</p>
                  <p className={styles.emptyStateSubtext}>
                    Blockchain transaction history will appear here
                  </p>
                  <button
                    onClick={handleRefreshTransactions}
                    className={styles.refreshEmptyButton}
                  >
                    Refresh Blockchain
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.transactionsTable}>
                    {displayTransactions.slice(0, 10).map((tx) => (
                      <div
                        key={tx._id || tx.id || tx.hash || tx.transactionId}
                        className={styles.transactionRow}
                      >
                        <div className={styles.txIconCol}>
                          <div className={styles.documentIcon}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M5 7H11"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M5 10H9"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className={styles.txHashCol}>
                          <a href="#" className={styles.txHash}>
                            {(
                              tx.hash ||
                              tx.id ||
                              tx.transactionId ||
                              ""
                            ).substring(0, 10)}
                            ...
                          </a>
                          <div className={styles.txTime}>
                            {new Date(tx.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className={styles.txDetailsCol}>
                          <div className={styles.txAddressLine}>
                            <span className={styles.txAddressLabel}>From</span>
                            <a href="#" className={styles.txAddress}>
                              {formatAddress(tx.fromAddress || "")}
                            </a>
                          </div>
                          <div className={styles.txAddressLine}>
                            <span className={styles.txAddressLabel}>To</span>
                            <a href="#" className={styles.txAddress}>
                              {formatAddress(tx.toAddress || "")}
                            </a>
                          </div>
                        </div>
                        <div className={styles.txAmountCol}>
                          <div className={styles.txAmount}>{tx.amount} MYC</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {displayTransactions.length > 10 && (
                    <div className={styles.viewAllContainer}>
                      <Link href="/explorer" className={styles.viewAllLink}>
                        VIEW BLOCKCHAIN EXPLORER →
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className={styles.tabContent}>
            <TransactionHistoryView
              transactions={transactions}
              walletAddress={wallet.address}
              isLoading={isLoading}
              onRefresh={handleRefreshHistory}
            />
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

// Transaction History View Component
function TransactionHistoryView({
  transactions,
  walletAddress,
  isLoading,
  onRefresh,
}: {
  transactions: any[];
  walletAddress: string;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className={styles.formCard}>
      <div className={styles.transactionsHeader}>
        <h2 className={styles.formTitle}>Transaction History</h2>
        <button
          onClick={onRefresh}
          className={styles.refreshButton}
          title="Refresh transaction history"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M8 5L5 2L8 5Z" fill="currentColor" />
            <path
              d="M8 5L5 2M5 2L2 5M5 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <p>Loading transaction history...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No transaction history found</p>
          <p className={styles.emptyStateSubtext}>
            Your personal transactions will appear here once you send or receive
            MYC
          </p>
          <button onClick={onRefresh} className={styles.refreshEmptyButton}>
            Refresh History
          </button>
        </div>
      ) : (
        <div className={styles.transactionsTable}>
          {transactions.map((tx) => {
            // Determine if transaction is incoming or outgoing
            const isIncoming =
              tx.toAddress?.toLowerCase() === walletAddress.toLowerCase();
            return (
              <div
                key={tx.transactionId || tx._id || tx.id || tx.hash}
                className={`${styles.transactionRow} ${
                  isIncoming ? styles.incomingTx : styles.outgoingTx
                }`}
              >
                <div className={styles.txIconCol}>
                  <div
                    className={`${styles.txTypeIcon} ${
                      isIncoming ? styles.incomingIcon : styles.outgoingIcon
                    }`}
                  >
                    {isIncoming ? "↓" : "↑"}
                  </div>
                </div>
                <div className={styles.txHashCol}>
                  <div className={styles.txType}>
                    {isIncoming ? "Received" : "Sent"}
                  </div>
                  <div className={styles.txTime}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className={styles.txDetailsCol}>
                  <div className={styles.txAddressLine}>
                    <span className={styles.txAddressLabel}>
                      {isIncoming ? "From" : "To"}
                    </span>
                    <a href="#" className={styles.txAddress}>
                      {formatAddress(
                        isIncoming ? tx.fromAddress : tx.toAddress || ""
                      )}
                    </a>
                  </div>
                </div>
                <div className={styles.txAmountCol}>
                  <div
                    className={`${styles.txAmount} ${
                      isIncoming ? styles.incomingAmount : styles.outgoingAmount
                    }`}
                  >
                    {isIncoming ? "+" : "-"}
                    {tx.amount} MYC
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
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

//           QR Code for {formatAddress(address)}
//         </div>
//       </div>

//       <div className={styles.addressContainer}>
//         <p className={styles.addressLabel}>Your MyCoin Address</p>
//         <div className={styles.addressValue}>
//           {address}
//           <button
//             className={styles.copyFullButton}
//             onClick={() => navigator.clipboard.writeText(address)}
//           >
//             Copy
//           </button>
//         </div>
//       </div>

//       <p className={styles.receiveInfo}>
//         Share your address to receive MYC and other tokens compatible with the
//         MyCoin network.
//       </p>
//     </div>
//   );
// }
