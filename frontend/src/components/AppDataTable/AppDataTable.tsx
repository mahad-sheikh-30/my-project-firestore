import React from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import "./AppDataTable.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface AppDataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  title?: string;
  onEdit?: (row: T) => void;
  onDelete?: (id: string) => void;
  actions?: boolean;
  width?: string;
}

function AppDataTable<T extends { id?: string | number }>({
  data,
  columns,
  isLoading,
  title,
  onEdit,
  onDelete,
  actions = false,
  width = "100%",
}: AppDataTableProps<T>) {
  const actionColumn: TableColumn<T> = {
    name: "Actions",
    cell: (row) => (
      <div className="action-buttons">
        {onEdit && (
          <button onClick={() => onEdit(row)} className="edit-btn">
            Edit
          </button>
        )}
        {onDelete && row.id && (
          <button
            onClick={() => onDelete(row.id!.toString())}
            className="delete-btn"
          >
            Delete
          </button>
        )}
      </div>
    ),
    ignoreRowClick: true,
    width: "220px",
  };

  return (
    <div className="app-data-table">
      {title && <h1 className="table-title">{title}</h1>}
      <div className="datatable-wrapper" style={{ width }}>
        <DataTable
          columns={actions ? [...columns, actionColumn] : columns}
          data={data}
          progressPending={isLoading}
          progressComponent={<LoadingSpinner />}
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
          highlightOnHover
          striped
          responsive
          noDataComponent="No records found."
          customStyles={{
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
}

export default AppDataTable;
