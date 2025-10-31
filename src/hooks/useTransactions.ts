import {
  CompanyNetFilters,
  type TransactionFilters,
  getCompanyNetReportsService,
  getTransactionsService,
} from "@/services/getTransactionsService";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(
  { page = 1, size = 10, employee_id, type }: TransactionFilters = {
    page: 1,
    size: 10,
  }
) {
  return useQuery({
    queryKey: ["transactions", { page, size, employee_id, type }],
    queryFn: () =>
      getTransactionsService({
        page,
        size,
        employee_id,
        type,
      }),
  });
}
export function useCompanyNetReports(
  { page = 1, size = 10 }: CompanyNetFilters = { page: 1, size: 10 }
) {
  return useQuery({
    queryKey: ["companyNetReports", { page, size }],
    queryFn: () => getCompanyNetReportsService({ page, size }),
  });
}
