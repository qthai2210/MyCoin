"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import { Transaction } from "@/services/api";

export function TransactionHistory() {
  const { wallet, transactions, loadTransactionHistory, isLoading, error } =
    useWallet();

  React.useEffect(() => {
    if (wallet?.address) {
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  if (isLoading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!wallet) {
    return <div className="p-4">Please load a wallet to view transactions</div>;
  }

  if (transactions.length === 0) {
    return <div className="p-4">No transactions found for this wallet</div>;
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const getTransactionType = (
    tx: Transaction
  ): "incoming" | "outgoing" | "self" => {
    if (tx.fromAddress === wallet.address && tx.toAddress === wallet.address) {
      return "self";
    } else if (tx.toAddress === wallet.address) {
      return "incoming";
    } else {
      return "outgoing";
    }
  };

  return (
    <div className="border rounded-lg p-6 shadow-md bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <button
          onClick={loadTransactionHistory}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From/To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => {
              const txType = getTransactionType(tx);
              return (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txType === "incoming" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Received
                      </span>
                    )}
                    {txType === "outgoing" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sent
                      </span>
                    )}
                    {txType === "self" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Self
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txType === "incoming" ? (
                      <div>
                        <div className="text-sm text-gray-500">From:</div>
                        <div className="font-mono">
                          {formatAddress(tx.fromAddress)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-gray-500">To:</div>
                        <div className="font-mono">
                          {formatAddress(tx.toAddress)}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        txType === "incoming"
                          ? "text-green-600"
                          : txType === "outgoing"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {txType === "incoming"
                        ? "+"
                        : txType === "outgoing"
                        ? "-"
                        : ""}
                      {tx.amount}
                    </div>
                    {tx.fee && (
                      <div className="text-xs text-gray-500">Fee: {tx.fee}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        tx.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                    {tx.blockNumber && (
                      <div className="text-xs text-gray-500 mt-1">
                        Block: {tx.blockNumber}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
