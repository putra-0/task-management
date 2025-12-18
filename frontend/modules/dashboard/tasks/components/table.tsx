"use client";

import { DataTable } from "@/components/table/data-table";
import React, { useEffect } from "react";
import { getTaskTableColumns } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableRowAction } from "@/types/data-table";
import { Task } from "../data/type";
import { useTasks } from "../hooks/use-tasks";

export default function TableTasks() {
  const { data, isLoading, isRefetching } = useTasks();

  const [, setRowAction] =
    React.useState<DataTableRowAction<Task> | null>(null);

  const columns = getTaskTableColumns({ setRowAction });
  const { table } = useDataTable({
    data: data?.items ?? [],
    columns: columns,
    pageCount: data?.lastPage ?? 0,
    initialState: {
      columnPinning: { right: ["actions"] },
    },
    shallow: false,
    clearOnDefault: true,
  });

  useEffect(() => {
    table.setGlobalFilter(isRefetching || isLoading);
  }, [table, isRefetching, isLoading]);

  return (
    <>
      <div className="container min-w-full mx-auto mt-3">
        <div className="mb-5 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="page-header">Providers</h2>
          </div>
          <div className="flex gap-2">
            {/* <Button className="space-x-1" onClick={() => setDialog(true)}>
              <span>Add</span> <Plus />
            </Button> */}
          </div>
        </div>

        <DataTable table={table} isLoading={isLoading}>
          <DataTableToolbar table={table}></DataTableToolbar>
        </DataTable>
      </div>
    </>
  );
}
