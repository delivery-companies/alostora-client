// import { Button } from "@/components/ui/button";
// import { useChangeOrderStatus } from "@/hooks/useChangeOrderStatus";
import { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { orderStatusArabicNames } from "@/lib/orderStatusArabicNames";
import type { Order } from "@/services/getOrders";
import { Badge, Flex, Text, rem } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";
// import { MoreHorizontal } from "lucide-react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { SelectRepositoryModal } from "./SelectRepositoryModal";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "",
    header: "#",
    cell: ({ row }) => {
      return <Text size="sm">{row.index + 1}</Text>;
    },
  },
  {
    accessorKey: "id",
    header: "رقم الطلبيه",
  },
  {
    accessorKey: "receiptNumber",
    header: "رقم الوصل",
  },
  {
    accessorKey: "recipientPhone",
    header: "رقم الهاتف",
    cell: ({ row }) => {
      const { recipientPhones } = row.original;
      return recipientPhones.length > 1 ? (
        <Flex gap="xs">
          <Text size="sm">{recipientPhones[0]}</Text>
          <Badge color="blue" variant="light">
            {recipientPhones.length - 1}
          </Badge>
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
    accessorFn: ({ status, secondaryStatus, repository }) => {
      return `${
        secondaryStatus === "IN_REPOSITORY" &&
        (status === "IN_GOV_REPOSITORY" || status === "IN_MAIN_REPOSITORY")
          ? "في " + repository?.name
          : secondaryStatus === "IN_REPOSITORY"
          ? orderStatusArabicNames[status] + " " + "في " + repository?.name
          : secondaryStatus === "IN_CAR"
          ? "مرسل إلي " + repository?.name
          : secondaryStatus === "WITH_AGENT" &&
            status !== "WITH_DELIVERY_AGENT" &&
            status !== "WITH_RECEIVING_AGENT"
          ? orderStatusArabicNames[status] + "-" + "مع المندوب"
          : secondaryStatus === "WITH_CLIENT"
          ? orderStatusArabicNames[status] + "-" + "مع العميل"
          : orderStatusArabicNames[status]
      }`;
    },
  },
  // {
  //     id: "actions",
  //     cell: ({ row }) => {
  //         const { id } = row.original;
  //         const [changeStatusOpened, { open: openChangeStatus, close: closeChangeStatus }] =
  //             useDisclosure(false);
  //         const [isMenuOpen, setMenuOpen] = useState(false);

  //         const { mutate: changeStatus, isLoading } = useChangeOrderStatus();

  //         const handleChangeStatus = (status: keyof typeof orderStatusArabicNames) => {
  //             changeStatus(
  //                 {
  //                     id,
  //                     data: {
  //                         status,
  //                         secondaryStatus: status === "RETURNED" ? "WITH_AGENT" : undefined
  //                     }
  //                 },
  //                 {
  //                     onSuccess: () => {
  //                         toast.success("تم تعديل حالة الطلب بنجاح");
  //                     }
  //                 }
  //             );
  //         };

  //         return (
  //             <Menu
  //                 position="bottom-end"
  //                 zIndex={150}
  //                 opened={isMenuOpen}
  //                 onChange={() => {
  //                     if (changeStatusOpened) return;
  //                     setMenuOpen(!isMenuOpen);
  //                 }}
  //             >
  //                 <Menu.Target>
  //                     <Button variant="ghost" className="h-8 w-8 p-0">
  //                         <MoreHorizontal className="h-4 w-4" />
  //                     </Button>
  //                 </Menu.Target>
  //                 <Menu.Dropdown>
  //                     <Menu.Item
  //                         disabled={isLoading}
  //                         onClick={() => {
  //                             handleChangeStatus("RESEND");
  //                         }}
  //                     >
  //                         اعادة ارسال الطلب
  //                     </Menu.Item>
  //                     <Menu.Item
  //                         disabled={isLoading}
  //                         onClick={() => {
  //                             handleChangeStatus("RETURNED");
  //                         }}
  //                     >
  //                         ارجاع الطلب الي المندوب
  //                     </Menu.Item>
  //                     <SelectRepositoryModal
  //                         close={closeChangeStatus}
  //                         id={id}
  //                         open={openChangeStatus}
  //                         opened={changeStatusOpened}
  //                     />
  //                 </Menu.Dropdown>
  //             </Menu>
  //         );
  //     }
  // }
];
