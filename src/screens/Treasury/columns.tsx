import { Text, rem } from "@mantine/core";
import { IconArrowDownLeft, IconArrowUpRight } from "@tabler/icons-react";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/services/getTransactionsService";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "رقم المعامله",
  },
  {
    accessorKey: "createdBy.name",
    header: "الناشئ",
  },
  {
    accessorKey: "employee.user.name",
    header: "الموظف",
  },
  {
    accessorKey: "type",
    header: "نوع المعامله",
    accessorFn: ({ type }) => {
      return type === "DEPOSIT" ? "ايداع داخل القاصه" : "سحب من القاصه";
    },
  },
  {
    header: "داخل / خارج",
    cell: ({ row }) => {
      const { type, paidAmount } = row.original;

      const renderIcon =
        type === "WITHDRAW" ? (
          <IconArrowDownLeft
            style={{ width: rem(30), height: rem(30), color: "red" }}
            stroke={1.5}
          />
        ) : (
          <IconArrowUpRight
            style={{ width: rem(30), height: rem(30), color: "green" }}
            stroke={1.5}
          />
        );

      return (
        <div className="flex items-center gap-2">
          {renderIcon}
          <Text
            size="sm"
            className="mx-2"
            c={type === "WITHDRAW" ? "red" : "green"}>
            {paidAmount.toLocaleString()}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    accessorFn: ({ createdAt }) => {
      const date = new Date(createdAt);
      return date.toLocaleString();
    },
  },
];
