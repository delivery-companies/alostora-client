import { AppLayout } from "@/components/AppLayout";
import type { ReportsFilters } from "@/services/getReports";
import { Grid, LoadingOverlay, Text } from "@mantine/core";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";
import { TreasuryCard } from "./components/TreasuryCard";
import { TreasuryFilters } from "./components/TreasuryFilters";
import { useTransactions } from "@/hooks/useTransactions";
import { AddTransaction } from "./components/AddTransaction";

export const TreasuryScreen = () => {
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
  });

  const { data, isLoading, isError } = useTransactions({
    page: filters.page,
    size: filters.size,
    employee_id: filters.created_by_id ? +filters.created_by_id : undefined,
    type: filters.type ? filters.type : undefined,
  });

  return (
    <AppLayout isError={isError}>
      <TreasuryFilters filters={filters} setFilters={setFilters} />
      <Grid>
        <TreasuryCard
          title="القاصه"
          value={data?.total || 0}
          isLoading={isLoading}
          color="green"
        />
        <TreasuryCard
          title="ما تم ايداعه في القاصه"
          value={data?.totalDepoist || 0}
          isLoading={isLoading}
          color="blue"
        />
        <TreasuryCard
          title="ما تم سحبه من القاصه"
          value={data?.totalWithdraw || 0}
          isLoading={isLoading}
          color="red"
        />
        <TreasuryCard
          title="ما تم استلامه من المناديب بعد خصم اجر المندوب"
          value={data?.receivedFromAgents || 0}
          isLoading={isLoading}
          color="orange"
        />
        <TreasuryCard
          title="فلوس مع المناديب"
          value={data?.notReceived || 0}
          isLoading={isLoading}
          color="violet"
        />
        <TreasuryCard
          title="ما تم دفعه للعملاء"
          value={data?.paidToClients || 0}
          isLoading={isLoading}
          color="yellow"
        />
        <TreasuryCard
          title="مبالغ مستحقه لعملاء"
          value={data?.forClients || 0}
          isLoading={isLoading}
          color="teal"
        />
      </Grid>
      <div className="relative">
        <LoadingOverlay visible={isLoading} />
        <div className="flex justify-between ">
          <Text c="green" size="xl" tt="uppercase" fw={700} mt={25}>
            المعاملات داخل القاصه
          </Text>
          <AddTransaction />
        </div>
        <DataTable
          data={data?.data || []}
          columns={columns}
          filters={{
            ...filters,
            pagesCount: data?.pagesCount,
          }}
          setFilters={setFilters}
        />
      </div>
    </AppLayout>
  );
};
