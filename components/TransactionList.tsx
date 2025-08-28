"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";

export default function TransactionList() {
  const { wallet, transactions, loadTransactionHistory, isLoading } =
    useWallet();

  // Format address to show only beginning and end like 0x9522...BAfe5
  const formatAddress = (address: string): string => {
    if (!address) return "Unknown Address";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Format timestamp to "X secs/mins/hours ago"
  const timeAgo = (timestamp: string): string => {
    const now = new Date();
    const txDate = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - txDate.getTime()) / 1000);

    if (seconds < 60) return `${seconds} secs ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;

    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  // Format transaction hash/ID
  const formatTxId = (txId: string): string => {
    if (!txId) return "";
    return txId.length > 16 ? `${txId.substring(0, 16)}...` : txId;
  };

  React.useEffect(() => {
    if (wallet?.address && transactions.length === 0) {
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  // Get transaction icon based on type
  const getTransactionIcon = (txType: string) => {
    if (txType === "outgoing" || txType === "SENT") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Latest Transactions</h2>
          <div className="animate-pulse w-20 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-medium">Latest Transactions</h2>
        <button className="text-blue-500 text-sm flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Customize
        </button>
      </div>

      <div className="divide-y">
        {transactions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <>
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id || tx.transactionId}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <div
                      className={`w-8 h-8 rounded-full ${
                        tx.type === "outgoing" || tx.type === "SENT"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      } flex items-center justify-center`}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                    <div className="text-sm">
                      <div className="font-medium text-blue-500">
                        {formatTxId(tx.hash || tx.id || tx.transactionId || "")}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {timeAgo(tx.timestamp)}
                        {tx.status && (
                          <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-xs rounded text-green-800">
                            {tx.status}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm">
                      <div className="text-gray-500">
                        From{" "}
                        <span className="font-medium">
                          {formatAddress(tx.fromAddress)}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        To{" "}
                        <span className="font-medium">
                          {formatAddress(tx.toAddress)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-medium ${
                          tx.type === "incoming"
                            ? "text-green-500"
                            : "text-gray-700"
                        }`}
                      >
                        {tx.amount} {wallet?.network?.currency || "MYCOIN"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="p-4 border-t text-center">
        <Link
          href="/transactions"
          className="text-blue-500 text-sm flex items-center justify-center"
        >
          VIEW ALL TRANSACTIONS
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
