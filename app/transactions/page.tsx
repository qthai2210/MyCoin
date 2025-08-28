"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import TransactionHistoryTabs from "@/components/TransactionHistoryTabs";
import Link from "next/link";

export default function TransactionsPage() {
  const { wallet } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <Link
          href="/dashboard"
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {wallet ? (
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-sm font-medium text-gray-500 mb-1">
              Wallet Address
            </h2>
            <div className="font-mono text-sm break-all">{wallet.address}</div>
          </div>

          <TransactionHistoryTabs />
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please connect a wallet to view transaction history.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
