"use client";

import { DataTable } from "@/components/table/data-table";
import React, { useEffect } from "react";
import { getTaskTableColumns } from "./columns";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { DataTableRowAction } from "@/types/data-table";
import { Task } from "../data/type";
import { useTasks } from "../hooks/use-tasks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddTask } from "../hooks/use-add-task";
import { AddFormDialog } from "./add-form-dialog";
import { useUpdateTask } from "../hooks/use-update-task";
import { UpdateFormDialog } from "./update-form-dialog";
import { DeleteConfirmDialog } from "./delete-form-dialog";
import { useDeleteTask } from "../hooks/use-delete-task";

export default function TableTasks() {
  const { data, isLoading, isRefetching } = useTasks();
  const { dialog, isLoading: isLoadingAdd, setDialog, onSubmit } = useAddTask();
  const { isLoading: isLoadingUpdate, onUpdateSubmit } = useUpdateTask();
  const { isLoading: isLoadingDelete, onDeleteSubmit } = useDeleteTask();

  const [rowAction, setRowAction] =
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
            <Button className="space-x-1" onClick={() => setDialog(true)}>
              <span>Add</span> <Plus />
            </Button>
          </div>
        </div>

        <DataTable table={table} isLoading={isLoading}>
          <DataTableToolbar table={table}></DataTableToolbar>
        </DataTable>
      </div>

      <AddFormDialog
        open={dialog}
        isLoadingSubmit={isLoadingAdd}
        onOpenChange={(open) => setDialog(open)}
        onSubmit={(data, setError) =>
          onSubmit(
            {
              ...data,
              description: data.description ?? "",
            },
            setError
          )
        }
      />

      <UpdateFormDialog
        currentRow={rowAction?.row.original}
        open={rowAction?.variant === "update"}
        isLoadingSubmit={isLoadingUpdate}
        onOpenChange={() => setRowAction(null)}
        onSubmit={(uuid, data, setError) =>
          onUpdateSubmit(uuid, data, setError, () => setRowAction(null))
        }
      />

      <DeleteConfirmDialog
        currentRow={rowAction?.row.original}
        open={rowAction?.variant === "delete"}
        isLoading={isLoadingDelete}
        onOpenChange={() => setRowAction(null)}
        onConfirm={(uuid) => onDeleteSubmit(uuid, () => setRowAction(null))}
      />
    </>
  );
}
