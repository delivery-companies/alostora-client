import { AppLayout } from "@/components/AppLayout";
import type { OrdersFilter } from "@/services/getOrders";
import { LoadingOverlay, Select } from "@mantine/core";
import { useState } from "react";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { columns } from "./columns";
import { useAuth } from "@/store/authStore";
import { useRepositories } from "@/hooks/useRepositories";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { RepositoryEntriesFilters } from "../RepostioryOrders/filters";

export const ExportedOrders = () => {
  const { role, branchId } = useAuth();
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_CAR",
    getOutComing: true,
    to_repository_id: undefined,
  });
  // const [isTyping, setIsTyping] = useState(false);
  // const typingTimer = useRef<NodeJS.Timeout | null>(null); // Explicitly type the timer
  // const TYPING_DELAY = 500; // Time in milliseconds to detect manual typing
  const { data: repositoriesData } = useRepositories({
    size: 100000,
    minified: true,
    branchId,
  });

  const {
    data: orders = {
      data: {
        orders: [],
      },
      pagesCount: 0,
    },
    isLoading,
  } = useRepositoryOrders(filters);

  return (
    <AppLayout>
      <RepositoryEntriesFilters filters={filters} setFilters={setfilters} />

      {role === "BRANCH_MANAGER" ? (
        <Select
          data={getSelectOptions(repositoriesData?.data || [])}
          style={{ maxWidth: "400px" }}
          searchable
          clearable
          placeholder="المخزن"
          label="المخزن"
          limit={100}
          value={filters.repository_id}
          onChange={(value) => {
            setfilters({
              ...filters,
              repository_id: value,
            });
          }}
        />
      ) : null}
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
