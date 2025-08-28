"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import Link from "next/link";

export default function TransactionHistoryTabs() {
  const { wallet, transactions, loadTransactionHistory, isLoading } =
    useWallet();
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received">(
    "all"
  );
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);

  useEffect(() => {
    if (wallet?.address && transactions.length === 0) {
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  useEffect(() => {
    // Filter transactions based on the active tab
    if (activeTab === "all") {
      setFilteredTransactions(transactions);
    } else if (activeTab === "sent") {
      setFilteredTransactions(
        transactions.filter(
          (tx) => tx.type === "outgoing" || tx.type === "SENT"
        )
      );
    } else {
      setFilteredTransactions(
        transactions.filter(
          (tx) => tx.type === "incoming" || tx.type === "RECEIVED"
        )
      );
    }
  }, [activeTab, transactions]);

  // Format address to show only beginning and end
  const formatAddress = (address: string): string => {
    if (!address) return "Unknown Address";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Format timestamp to human-readable date
  const formatDate = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  // Format transaction hash/ID
  const formatTxHash = (hash: string): string => {
    if (!hash) return "";
    return hash.length > 10 ? `${hash.substring(0, 10)}...` : hash;
  };

  // Get transaction icon based on type
  const getTransactionIcon = (txType: string) => {
    if (txType === "outgoing" || txType === "SENT") {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
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
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
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
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex border-b mb-4">
          <div className="animate-pulse w-20 h-8 bg-gray-200 rounded mr-2"></div>
          <div className="animate-pulse w-20 h-8 bg-gray-200 rounded mr-2"></div>
          <div className="animate-pulse w-20 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex border-b">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "all"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Transactions
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "sent"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeTab === "received"
              ? "text-blue-600 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("received")}
        >
          Received
        </button>
        <div className="ml-auto p-2">
          <button
            onClick={() => loadTransactionHistory()}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="divide-y">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-lg font-medium mb-1">No transactions found</p>
            <p className="text-sm">
              {activeTab === "all"
                ? "You don't have any transactions yet."
                : activeTab === "sent"
                ? "You haven't sent any coins yet."
                : "You haven't received any coins yet."}
            </p>
          </div>
        ) : (
          <>
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id || tx.transactionId}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getTransactionIcon(tx.type)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 w-full">
                    <div className="md:col-span-4">
                      <div className="font-medium text-gray-900">
                        {tx.type === "outgoing" || tx.type === "SENT"
                          ? "Sent"
                          : "Received"}
                      </div>
                      <div className="text-gray-500 text-sm flex items-center">
                        <span
                          className={`inline-flex px-2 text-xs font-semibold rounded ${
                            tx.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                        <span className="ml-2">{formatDate(tx.timestamp)}</span>
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <div className="text-sm text-gray-500">
                        From:{" "}
                        <span className="font-medium">
                          {formatAddress(tx.fromAddress || "")}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        To:{" "}
                        <span className="font-medium">
                          {formatAddress(tx.toAddress || "")}
                        </span>
                      </div>
                    </div>

                    <div className="md:col-span-3 text-sm">
                      <div className="text-gray-500">Hash:</div>
                      <div className="font-mono">{formatTxHash(tx.hash)}</div>
                    </div>

                    <div className="md:col-span-1 text-right">
                      <div
                        className={`font-medium ${
                          tx.type === "incoming" || tx.type === "RECEIVED"
                            ? "text-green-600"
                            : "text-gray-800"
                        }`}
                      >
                        {tx.type === "incoming" || tx.type === "RECEIVED"
                          ? "+"
                          : ""}
                        {tx.amount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {filteredTransactions.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div>Showing {filteredTransactions.length} transactions</div>
            {filteredTransactions.length > 10 && (
              <Link
                href="/transactions"
                className="text-blue-500 hover:text-blue-700"
              >
                View all
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
