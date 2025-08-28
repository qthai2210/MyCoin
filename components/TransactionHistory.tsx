"use client";

import React, { useEffect } from "react";
import { useWallet } from "@/context/WalletContext";

export default function TransactionHistory() {
  const { wallet, transactions, loadTransactionHistory, isLoading } =
    useWallet();

  useEffect(() => {
    if (wallet?.address) {
      loadTransactionHistory();
    }
  }, [wallet?.address]);

  // Helper function to format address for display
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Helper function to format date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded mb-2"></div>
          <div className="h-6 bg-slate-200 rounded mb-2"></div>
          <div className="h-6 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="p-4 rounded-lg bg-white shadow">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <p>Connect your wallet to view transaction history</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <button
          onClick={() => loadTransactionHistory()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {transactions.length === 0 ? (
        <p>No transactions found for this wallet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  From/To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.transactionId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === "incoming"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.type === "incoming" ? "Received" : "Sent"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        tx.type === "incoming"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {tx.type === "incoming" ? "+" : "-"}
                      {tx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {tx.type === "incoming" ? (
                      <span>From: {formatAddress(tx.fromAddress || "")}</span>
                    ) : (
                      <span>To: {formatAddress(tx.toAddress || "")}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(tx.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {tx.transactionId?.substring(0, 10) || "N/A"}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                       ${
//                         tx.status === "confirmed"
//                           ? "bg-green-100 text-green-800"
//                           : tx.status === "pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {tx.status}
//                     </span>
//                     {tx.blockNumber && (
//                       <div className="text-xs text-gray-500 mt-1">
//                         Block: {tx.blockNumber}
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
