"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api, Transaction, PaginationInfo } from "@/services/api";

export default function BlockchainExplorer() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.getAllBlockchainTransactions(page, 10);
      setTransactions(result.transactions);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
      console.error("Error loading blockchain transactions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions(currentPage);
  }, [currentPage]);

  // Format address to show only beginning and end
  const formatAddress = (address: string): string => {
    if (!address) return "Unknown";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Format transaction hash/ID for display
  const formatTxId = (txId: string): string => {
    if (!txId) return "";
    return `${txId.substring(0, 10)}...`;
  };

  // Helper function to render pagination controls
  const renderPagination = () => {
    if (!pagination) return null;

    const pages = [];
    const { page, pages: totalPages } = pagination;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={page <= 1}
        className="px-3 py-1 rounded border mr-2 disabled:opacity-50"
      >
        &laquo; Prev
      </button>
    );

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 rounded mx-1 ${
            i === page ? "bg-blue-500 text-white" : "border"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={page >= totalPages}
        className="px-3 py-1 rounded border ml-2 disabled:opacity-50"
      >
        Next &raquo;
      </button>
    );

    return <div className="flex justify-center mt-6">{pages}</div>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blockchain Explorer</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium">All Transactions</h2>
          <p className="text-sm text-gray-500">
            Showing all transactions on the MyCoin blockchain
          </p>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Loading transactions...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <p className="text-lg">{error}</p>
            <button
              onClick={() => loadTransactions(currentPage)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Try Again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    From
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr
                    key={tx.transactionId || tx.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {formatTxId(tx.transactionId || tx.hash || tx.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAddress(tx.fromAddress)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAddress(tx.toAddress)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tx.amount} MYC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {renderPagination()}
          </div>
        )}
      </div>
    </div>
  );
}
