import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Task } from "../data/type";
import React from "react";
import { Ellipsis } from "lucide-react";
import { DataTableRowAction } from "@/types/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface GetTaskTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Task> | null>
  >;
}

export function getTaskTableColumns({
  setRowAction,
}: GetTaskTableColumnsProps): ColumnDef<Task>[] {
  return [
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      enableColumnFilter: false,
      enableSorting: false,
      meta: {
        label: "Title",
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { status } = row.original;
        return (
          <div className="flex space-x-2">
            <Badge variant="outline" className="bg-muted border border-muted">
              {status.name}
            </Badge>
          </div>
        );
      },
      enableColumnFilter: true,
      enableSorting: false,
      meta: {
        label: "Status",
        variant: "taskStatus",
        options: [],
      },
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: "deadline",
      accessorKey: "deadline",
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataTableColumnHeader column={column} title="Deadline" />
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      meta: {
        label: "Deadline",
        alignHeader: "end",
        alignCell: "end",
      },
      cell: ({ row }) => {
        const { deadline } = row.original;
        return <div className="flex justify-end">{formatDate(deadline)}</div>;
      },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataTableColumnHeader column={column} title="Created At" />
        </div>
      ),
      enableSorting: false,
      meta: {
        label: "Created At",
        alignHeader: "end",
        alignCell: "end",
      },
      cell: ({ row }) => {
        const { createdAt } = row.original;
        return <div className="flex justify-end">{formatDate(createdAt)}</div>;
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="min-w-8 rounded-full" asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-2 p-4 m-0 justify-enddata-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      minSize: 40,
      maxSize: 40,
    },
  ];
}
