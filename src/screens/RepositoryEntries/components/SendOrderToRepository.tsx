import type { APIError } from "@/models";
import {
  repositoryConfirmOrderByReceiptNumberService,
  type RepositoryConfirmOrderByReceiptNumberPayload,
} from "@/services/repositoryConfirmOrderByReceiptNumber";
import { Button, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const SendOrderToRepository = () => {
  const queryClient = useQueryClient();
  const [receiptNumber, setReceiptNumber] = useState("");

  // const {
  //     mutate: getOrderDetails,
  //     reset: resetOrderDetails,
  //     isLoading: isGettingOrderDetailsLoading
  // } = useOrderDetailsByReceiptNumberAction();

  const { mutate: repositoryConfirmOrderByReceiptNumber, isLoading } =
    useMutation({
      mutationFn: (data: RepositoryConfirmOrderByReceiptNumberPayload) => {
        return repositoryConfirmOrderByReceiptNumberService({
          orderId: receiptNumber,
          data,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        toast.success("تم تعديل حالة الطلب بنجاح");
        setReceiptNumber("");
      },
      onError: (error: AxiosError<APIError>) => {
        toast.error(error.response?.data.message || "حدث خطأ ما");
      },
    });

  const handleRepositoryConfirmOrderByReceiptNumber = () => {
    if (!receiptNumber) {
      toast.error("أدخل رقم الوصل");
      return;
    }
    repositoryConfirmOrderByReceiptNumber({
      secondaryStatus: "IN_REPOSITORY",
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // setReceiptNumber(""); // Clear input after saving
      handleRepositoryConfirmOrderByReceiptNumber();
    }
  };

  // const { mutate: changeStatus, isLoading } = useChangeOrderStatus();

  // const handleChangeOrderStatus = () => {
  //     if (receiptNumber.length === 0) {
  //         toast.error("أدخل رقم الوصل");
  //         return;
  //     }

  //     getOrderDetails(receiptNumber, {
  //         onSuccess: ({ data }) => {
  //             if (!data?.orders?.[0].id) {
  //                 toast.error("الطلب غير موجود");
  //                 return;
  //             }
  //             changeStatus(
  //                 {
  //                     id: Number(data?.orders?.[0].id),
  //                     data: {
  //                         repositoryID: Number(selectedRepository),
  //                         status: "RETURNED",
  //                         secondaryStatus: "IN_REPOSITORY"
  //                     }
  //                 },
  //                 {
  //                     onSuccess: () => {
  //                         queryClient.invalidateQueries({
  //                             queryKey: ["orders"]
  //                         });
  //                         toast.success("تم تعديل حالة الطلب بنجاح");
  //                         setReceiptNumber("");
  //                         // setSelectedRepository(null);
  //                         resetOrderDetails();
  //                     }
  //                 }
  //             );
  //         }
  //     });
  // };

  return (
    <div className="flex gap-4 items-center">
      <TextInput
        value={receiptNumber}
        onChange={(event) => {
          let input = event.currentTarget.value;
          const match = input.match(/\d+/);
          setReceiptNumber(match ? match[0] : "");
        }}
        label="تأكيد مباشر برقم الوصل"
        onKeyDown={handleKeyDown}
        type="text"
      />

      <Button
        className="mt-6"
        disabled={isLoading}
        onClick={handleRepositoryConfirmOrderByReceiptNumber}
        loading={isLoading}>
        تأكيد
      </Button>
    </div>
  );
};
