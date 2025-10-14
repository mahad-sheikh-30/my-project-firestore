import React, { useState, useEffect } from "react";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import { getMyTransactions } from "../../api/transactionApi";
import { useQuery } from "@tanstack/react-query";

const MyTransactions: React.FC = () => {
  // const [transactions, setTransactions] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getMyTransactions,
  });

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  // const fetchTransactions = async () => {
  //   try {
  //     const data = await getMyTransactions();

  //     setTransactions(data);
  //   } catch (err) {
  //     console.error("Error fetching transactions:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (isLoading) return <p>Loading your transactions...</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>My Transactions</h2>
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default MyTransactions;
