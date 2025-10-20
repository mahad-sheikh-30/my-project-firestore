import { getAllTransactions } from "../../api/transactionApi";
import { useQuery } from "@tanstack/react-query";

import AppDataTable from "../../components/AppDataTable/AppDataTable";

const columns = [
  {
    name: "User",
    cell: (row: any) => (
      <div>
        {row.userId?.name || "N/A"} <br />
        <small>{row.userId?.email || "N/A"}</small>
      </div>
    ),
    sortable: true,
    width: "250px",
  },
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

const AdminTransactions: React.FC = () => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
  });

  return (
    <div className="admin-trans">
      <AppDataTable
        title={"All Transactions"}
        isLoading={isLoading}
        data={transactions}
        columns={columns}
        width={"100%"}
      />
    </div>
  );
};

export default AdminTransactions;
