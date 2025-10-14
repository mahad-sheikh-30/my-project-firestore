import React, { useEffect, useState } from "react";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import { getAllTransactions } from "../../api/transactionApi";
import { useQuery } from "@tanstack/react-query";

const AdminTransactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  if (isLoading) return <p>Loading all transactions...</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>All Transactions</h2>
      <TransactionsTable transactions={transactions} isAdmin />
    </div>
  );
};

export default AdminTransactions;
