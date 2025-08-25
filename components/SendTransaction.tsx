"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";

export function SendTransaction() {
  const { wallet, walletStats, sendCoins, isLoading, error } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransactionError(null);
    setSuccess(false);

    if (!recipient) {
      setTransactionError("Recipient address is required");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTransactionError("Please enter a valid amount");
      return;
    }

    if (walletStats && numAmount > walletStats.balance) {
      setTransactionError("Insufficient funds");
      return;
    }

    const result = await sendCoins(recipient, numAmount);
    if (result) {
      setSuccess(true);
      setRecipient("");
      setAmount("");
    }
  };

  if (!wallet || !wallet.privateKey) {
    return (
      <div className="border rounded-lg p-6 shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4">Send Coins</h2>
        <p className="text-red-500">
          You need a wallet with a private key to send transactions
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Send Coins</h2>

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Transaction has been sent.</span>
        </div>
      )}

      {(error || transactionError) && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || transactionError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount {walletStats?.network?.currency || "MYCOIN"}
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
            />
            {walletStats && (
              <div className="absolute right-3 top-3 text-sm text-gray-500">
                Balance: {walletStats.balance}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            {walletStats?.network && `Network: ${walletStats.network.name}`}
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
