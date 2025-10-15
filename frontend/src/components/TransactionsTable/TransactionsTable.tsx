import React from "react";
import DataTable from "react-data-table-component";
import "./TransactionsTable.css";
import type { TableColumn } from "react-data-table-component";
interface Transaction {
  _id: string;
  paymentIntentId: string;
  amount: number;
  createdAt: string;
  userId?: { name: string; email: string };
  courseId?: { title: string; price: number };
}

interface Props {
  transactions: Transaction[];
  isAdmin?: boolean;
  isLoading?: boolean;
}

const TransactionsTable: React.FC<Props> = ({ transactions, isAdmin }) => {
  const columns: TableColumn<Transaction>[] = [
    ...(isAdmin
      ? [
          {
            name: "User",
            selector: (row: any) => row.userId?.name || "N/A",
            sortable: true,
            cell: (row: any) => (
              <div>
                <strong>{row.userId?.name || "N/A"}</strong>
                <br />
                <small>{row.userId?.email}</small>
              </div>
            ),
            grow: 2,
          },
        ]
      : []),
    {
      name: "Course",
      selector: (row) => row.courseId?.title || "N/A",
      sortable: true,
      grow: 2,
    },
    {
      name: "Amount",
      selector: (row) =>
        `$${row.courseId?.price ? row.courseId.price.toFixed(2) : "0.00"}`,
      sortable: true,
      grow: 1,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      grow: 1,
    },
    {
      name: "Time",
      selector: (row) =>
        new Date(row.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      grow: 1,
    },
  ];

  return (
    <div className="transactions-table">
      <div
        className="datatable-wrapper"
        style={isAdmin ? { width: "95%" } : { width: "80%" }}
      >
        <DataTable
          columns={columns}
          data={transactions}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          striped
          responsive
          noDataComponent="No transactions found."
          customStyles={{
            table: {
              style: {
                borderRadius: "10px",
                overflowX: "auto",
              },
            },
            headCells: {
              style: {
                backgroundColor: "var(--primary)",
                color: "white",
                fontWeight: "bold",
                fontSize: "15px",
              },
            },
            rows: {
              style: {
                borderBottom: "1px solid #ddd",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
