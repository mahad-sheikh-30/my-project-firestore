import React, { useEffect, useState } from "react";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import { getAllTransactions } from "../../api/transactionApi";
import { useQuery } from "@tanstack/react-query";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";

const AdminTransactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  return (
    <div className="admin-trans">
      {isLoading && <FullPageLoader />}
      <h2 style={{ textAlign: "center" }}>All Transactions</h2>
      <TransactionsTable transactions={transactions} isAdmin />
    </div>
  );
};

export default AdminTransactions;
