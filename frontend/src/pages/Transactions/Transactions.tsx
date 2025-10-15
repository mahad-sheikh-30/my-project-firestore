import React, { useState, useEffect } from "react";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import { getMyTransactions } from "../../api/transactionApi";
import { useQuery } from "@tanstack/react-query";
import "./Transactions.css";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
const MyTransactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getMyTransactions,
  });

  return (
    <div className="trans-page">
      {isLoading && <FullPageLoader />}
      <h2 style={{ textAlign: "center" }}>My Transactions</h2>
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default MyTransactions;
