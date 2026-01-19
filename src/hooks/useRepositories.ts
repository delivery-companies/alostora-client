import type { Filters } from "@/services/getEmployeesService";
import { getRepositoriesService } from "@/services/getRepositoriesService";
import { useQuery } from "@tanstack/react-query";

export const useRepositories = (
  { page = 1, size = 10, minified, type, branchId }: Filters = {
    page: 1,
    size: 10,
  }
) => {
  return useQuery({
    queryKey: ["repositories", { page, size, minified, type, branchId }],
    queryFn: () =>
      getRepositoriesService({ page, size, minified, type, branchId }),
  });
};
