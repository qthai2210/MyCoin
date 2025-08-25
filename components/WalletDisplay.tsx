"use client";

import React from "react";
import { useWallet } from "@/context/WalletContext";
import Image from "next/image";
import Link from "next/link";

export function WalletDisplay() {
  const { wallet, walletStats, isLoading, error, refreshWalletStats } =
    useWallet();

  if (isLoading) {
    return <div className="p-4">Loading wallet information...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!wallet || !walletStats) {
    return <div className="p-4">No wallet loaded</div>;
  }

  return (
    <div className="border rounded-lg p-6 shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Wallet Details</h2>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Balance</h3>
          <p className="text-3xl font-bold">
            {walletStats.balance} {walletStats.network?.currency || "MYCOIN"}
          </p>
        </div>
        <button
          onClick={refreshWalletStats}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Wallet Address</h3>
          <div className="flex items-center">
            <span className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
              {wallet.address}
            </span>
            <button
              className="ml-2 text-blue-500 hover:text-blue-700"
              onClick={() => {
                navigator.clipboard.writeText(wallet.address);
                alert("Address copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        </div>

        {wallet.hasPrivateKey && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Private Key</h3>
            <div className="flex items-center">
              <span className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
                {wallet.privateKey ? "••••••••••••••••" : "Not available"}
              </span>
              {wallet.privateKey && (
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    navigator.clipboard.writeText(wallet.privateKey!);
                    alert("Private key copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        )}

        {wallet.passphrase && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Recovery Passphrase</h3>
            <div className="font-mono bg-gray-100 p-2 rounded text-sm break-all">
              {wallet.passphrase}
            </div>
            <p className="text-red-500 text-sm mt-1">
              Save this passphrase securely! It cannot be recovered if lost.
            </p>
          </div>
        )}
      </div>

      {walletStats.qrCode && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">QR Code</h3>
          <div className="w-48 h-48 mx-auto">
            <Image
              src={`data:image/svg+xml;base64,${btoa(walletStats.qrCode)}`}
              alt="Wallet QR Code"
              width={200}
              height={200}
            />
          </div>
        </div>
      )}

      {walletStats.network && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Network Information</h3>
          <div className="bg-gray-100 p-3 rounded">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {walletStats.network.name}
            </p>
            <p>
              <span className="font-semibold">Chain ID:</span>{" "}
              {walletStats.network.chainId}
            </p>
            <p>
              <span className="font-semibold">Currency:</span>{" "}
              {walletStats.network.currency}
            </p>
          </div>
        </div>
      )}

      {walletStats.links?.viewOnExplorer && (
        <div className="mt-6">
          <Link
            href={walletStats.links.viewOnExplorer}
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            View on Explorer
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>
          Status:{" "}
          <span className="capitalize">{walletStats.status || "Unknown"}</span>
        </p>
        {walletStats.createdAt && (
          <p>Created: {new Date(walletStats.createdAt).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
