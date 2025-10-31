import { AppLayout } from "@/components/AppLayout";
import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, TextInput, Grid, Select } from "@mantine/core";
import { useState } from "react";
import toast from "react-hot-toast";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { useRepositories } from "@/hooks/useRepositories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  EditOrderPayload,
  saveOrderInRepositoryService,
} from "@/services/editOrder";
import { AxiosError } from "axios";
import { APIError } from "@/models";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useAuth } from "@/store/authStore";
import { RepositoryEntriesFilters } from "./filters";
import { columns } from "./columns";

export const ForwardedToMain = () => {
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_CAR",
  });
  const queryClient = useQueryClient();

  const [receiptNumber, setReceiptNumber] = useState("");
  const { mainRepository } = useAuth();
  const [selectedRepository, setSelectedRepository] = useState("");
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

  const { data: repositoriesData } = useRepositories({
    size: 100000,
    minified: true,
    type: "EXPORT",
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
    if (mainRepository && selectedRepository === "") {
      toast.error("الرجاء تحديد مخزن");
      return;
    }
    if (mainRepository) {
      editOrder({
        forwardedToGov: true,
        secondaryStatus: "IN_CAR",
        status: "IN_GOV_REPOSITORY",
        repositoryID: +selectedRepository,
      });
    } else {
      editOrder({
        forwardedToMainRepo: true,
        secondaryStatus: "IN_CAR",
        status: "IN_MAIN_REPOSITORY",
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
        {mainRepository ? (
          <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
            <Select
              value={selectedRepository}
              allowDeselect
              label="المخزن"
              searchable
              clearable
              onChange={(e) => {
                setSelectedRepository(e || "");
              }}
              placeholder="اختر المخزن"
              data={getSelectOptions(repositoriesData?.data || [])}
              limit={100}
            />
          </Grid.Col>
        ) : (
          ""
        )}
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
