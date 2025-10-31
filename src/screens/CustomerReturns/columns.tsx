import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Order } from "@/services/getOrders";
import { Flex, Text, rem } from "@mantine/core";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "receiptNumber",
    header: "رقم الوصل",
  },
  {
    accessorKey: "recipientPhones",
    header: "رقم الهاتف",
    cell: ({ row }) => {
      const { recipientPhones } = row.original;

      return recipientPhones.length > 0 ? (
        <Flex gap="xs">
          <Text size="sm">{recipientPhones[0]}</Text>
        </Flex>
      ) : (
        <Text size="sm">لا يوجد</Text>
      );
    },
  },
  {
    accessorKey: "deliveryAgent.name",
    header: "المندوب",
    cell: ({ row }) => {
      const { deliveryAgent } = row.original;
      if (!deliveryAgent) return <Text size="sm">--</Text>;
      return <Text size="sm">{deliveryAgent?.name || "--"}</Text>;
    },
  },
  {
    accessorKey: "client.name",
    header: "العميل",
  },
  {
    accessorKey: "store.name",
    header: "المتجر",
  },
  {
    header: "العنوان",
    cell: ({ row }) => {
      const { recipientAddress, governorate } = row.original;
      return (
        <Text truncate maw={rem(200)} size="sm">
          {governorateArabicNames[governorate]} - {recipientAddress}
        </Text>
      );
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    accessorFn: ({ status, secondaryStatus, repository, deliveryAgent }) => {
      return `${orderStatusArabicNames[status]}  ${
        orderSecondaryStatusArabicNames[secondaryStatus]
          ? ` - ${orderSecondaryStatusArabicNames[secondaryStatus]} -  ${
              secondaryStatus === "IN_REPOSITORY"
                ? repository?.name
                : secondaryStatus === "WITH_AGENT"
                ? deliveryAgent?.name
                : ""
            }`
          : ""
      }`;
    },
  },
];
