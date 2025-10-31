import { AppLayout } from "@/components/AppLayout";
import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, TextInput, Grid } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditOrderPayload,
  saveOrderInRepositoryService,
} from "@/services/editOrder";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { useAuth } from "@/store/authStore";
import { RepositoryEntriesFilters } from "./filters";

export const RepositoryOrders = () => {
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_REPOSITORY",
  });
  const queryClient = useQueryClient();

  const [receiptNumber, setReceiptNumber] = useState("");
  const { mainRepository } = useAuth();
  // const [isTyping, setIsTyping] = useState(false);
  // const typingTimer = useRef<NodeJS.Timeout | null>(null); // Explicitly type the timer
  // const TYPING_DELAY = 500; // Time in milliseconds to detect manual typing

  const {
    data: orders = {
      data: {
        orders: [],
      },
      pagesCount: 0,
    },
    isLoading,
  } = useRepositoryOrders(filters);

  const { mutate: editOrder, isLoading: saveLoading } = useMutation({
    mutationFn: (data: EditOrderPayload) => {
      return saveOrderInRepositoryService({
        id: receiptNumber,
        data,
      });
    },
    onSuccess: () => {
      toast.success("تم تعديل الطلب بنجاح");
      setReceiptNumber("");
      // navigate("/orders");
      // form.reset();
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
      queryClient.invalidateQueries({
        queryKey: ["timeline"],
      });
    },
    onError: (error: AxiosError<APIError>) => {
      toast.error(error.response?.data.message || "حدث خطأ ما");
      setReceiptNumber("");
    },
  });

  const confirm = async () => {
    if (mainRepository) {
      editOrder({
        secondaryStatus: "IN_REPOSITORY",
        status: "IN_MAIN_REPOSITORY",
      });
    } else {
      editOrder({
        secondaryStatus: "IN_REPOSITORY",
        status: "IN_GOV_REPOSITORY",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      confirm();
      // setReceiptNumber(""); // Clear input after saving
    }
  };

  return (
    <AppLayout>
      <RepositoryEntriesFilters filters={filters} setFilters={setfilters} />
      <Grid align="center" gutter="lg">
        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
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
        </Grid.Col>
        <Button
          className="mt-6"
          disabled={saveLoading || receiptNumber === ""}
          onClick={confirm}
          loading={saveLoading}>
          تأكيد
        </Button>
      </Grid>
      <div className="relative mt-12">
        <LoadingOverlay visible={isLoading} />
        <OrdersTable
          key={orders.data.orders.length}
          setFilters={setfilters}
          filters={{
            ...filters,
            pagesCount: orders.pagesCount,
          }}
          data={orders.data.orders}
          columns={columns}
        />
      </div>
    </AppLayout>
  );
};
