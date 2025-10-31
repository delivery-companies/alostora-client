import { AppLayout } from "@/components/AppLayout";
import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, TextInput, Grid, Select } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditOrderPayload,
  saveOrderInRepositoryService,
} from "@/services/editOrder";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { RepositoryEntriesFilters } from "./filters";
import { columns } from "./columns";
import { useEmployees } from "@/hooks/useEmployees";

export const AssignOrderToAgent = () => {
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "WITH_AGENT",
    status: "WITH_DELIVERY_AGENT",
  });
  const queryClient = useQueryClient();

  const [receiptNumber, setReceiptNumber] = useState("");
  const [selectedAgent, setSelectAgent] = useState("");
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

  const { data: Agents } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["DELIVERY_AGENT"],
  });

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
    if (selectedAgent === "") {
      toast.error("الرجاء تحديد المندوب");
      return;
    }
    editOrder({
      secondaryStatus: "WITH_AGENT",
      status: "WITH_DELIVERY_AGENT",
      deliveryAgentID: +selectedAgent,
    });
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
        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
          <Select
            value={selectedAgent}
            allowDeselect
            label="المندوب"
            searchable
            clearable
            onChange={(e) => {
              setSelectAgent(e || "");
            }}
            placeholder="اختر المندوب"
            data={getSelectOptions(Agents?.data || [])}
            limit={100}
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
