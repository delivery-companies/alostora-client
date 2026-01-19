import { AppLayout } from "@/components/AppLayout";
import { IncomingOrdersStatistics } from "./Repositories";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IncomingRepoOrders } from "./Orders/index.tsx";
import { useAuth } from "@/store/authStore.ts";

export const IncomingOrders = () => {
  const { mainRepository, type } = useAuth();
  const [params] = useSearchParams();
  const [repo, setRepo] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    const repoParam = params.get("repo");

    if (repoParam !== null) {
      setRepo(repoParam);
    }
  }, [params]);

  return (
    <AppLayout>
      {!repo && mainRepository && type === "RETURN" ? (
        <IncomingOrdersStatistics />
      ) : (
        <IncomingRepoOrders
          setRepo={() => {
            setRepo(undefined);
          }}
          repo={repo}
        />
      )}
    </AppLayout>
  );
};
