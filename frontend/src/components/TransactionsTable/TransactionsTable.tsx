// src/components/TransactionsTable/TransactionsTable.tsx
import React from "react";
import "./TransactionsTable.css";

interface Transaction {
  _id: string;
  paymentIntentId: string;
  amount: number;
  createdAt: string;
  userId?: { name: string; email: string };
  courseId?: { title: string; price: number; category?: string };
}

interface Props {
  transactions: Transaction[];
  isAdmin?: boolean;
}

const TransactionsTable: React.FC<Props> = ({ transactions, isAdmin }) => {
  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            {isAdmin && <th>User</th>}
            <th>Course</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: "center" }}>
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((tx) => {
              const date = new Date(tx.createdAt);
              const fDate = date.toLocaleDateString();
              const fTime = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={tx._id}>
                  {isAdmin && (
                    <td>
                      {tx.userId?.name || "N/A"} <br />
                      <small>{tx.userId?.email}</small>
                    </td>
                  )}
                  <td>{tx.courseId?.title || "N/A"}</td>
                  <td>${tx.amount.toFixed(2)}</td>
                  <td>{fDate}</td>
                  <td>{fTime}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
