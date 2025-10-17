import React from "react";
import { getMyTransactions } from "../../api/transactionApi";
import { useQuery } from "@tanstack/react-query";
import "./Transactions.css";

import AppDataTable from "../../components/AppDataTable/AppDataTable";

const columns = [
  {
    name: "Course",
    selector: (row: any) => row.courseId?.title || "N/A",
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row: any) => `$${row.amount?.toFixed(2) || "0.00"}`,
    sortable: true,
  },
  {
    name: "Date",
    selector: (row: any) => new Date(row.createdAt).toLocaleDateString(),
    sortable: true,
  },
  {
    name: "Time",
    selector: (row: any) =>
      new Date(row.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
  },
];

const MyTransactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getMyTransactions,
  });

  return (
    <div className="trans-page">
      <AppDataTable
        title={"My Transactions"}
        data={transactions}
        columns={columns}
        isLoading={isLoading}
        width={"85%"}
      />
    </div>
  );
};

export default MyTransactions;
