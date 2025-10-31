import { api } from "@/api";
import type { Filters } from "./getEmployeesService";

export interface Transaction {
  type: "DEPOSIT" | "WITHDRAW";
  for: string;
  paidAmount: number;
  employee: {
    user: {
      name: string;
      id: number;
    };
  } | null;
  company: {
    name: string;
    id: number;
  };
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string;
    id: number;
  } | null;
}

export interface GetTransactionsResponse {
  status: string;
  page: number;
  pagesCount: number;
  totalDepoist: number;
  totalWithdraw: number;
  total: number;
  receivedFromAgents: number;
  notReceived: number;
  forClients: number;
  paidToClients: number;
  data: Transaction[];
}

export interface CompanyNetReport {
  employeeId: number;
  employeeName: string;
  totalCompanyNet: number;
  totalDeposit: number;
  totalWithdraw: number;
}

export interface GetCompanyNetReportsResponse {
  status: string;
  page: number;
  pagesCount: number;
  totalGroups: number;
  data: CompanyNetReport[];
}

export interface TransactionFilters extends Filters {
  employee_id?: number;
  type?: string;
}

export const getTransactionsService = async (
  { page = 1, size = 10, employee_id, type }: TransactionFilters = {
    page: 1,
    size: 10,
  }
) => {
  const response = await api.get<GetTransactionsResponse>("/transactions", {
    params: {
      page,
      size,
      employee_id: employee_id || undefined,
      type: type || undefined,
    },
  });

  return response.data;
};

export interface CompanyNetFilters {
  page?: number;
  size?: number;
}

export const getCompanyNetReportsService = async (
  { page = 1, size = 10 }: CompanyNetFilters = { page: 1, size: 10 }
) => {
  const response = await api.get<GetCompanyNetReportsResponse>(
    "/transactions/getWallets",
    {
      params: { page, size },
    }
  );
  return response.data;
};
