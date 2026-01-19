import { AppLayout } from "@/components/AppLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/authStore";
import { useSearchParams } from "react-router-dom";
import { IncomingOrdersStatistics } from "./Repositories";
import { Orders } from "./Orders";

export const ExportedOrders = () => {
  const { mainRepository } = useAuth();
  const [params] = useSearchParams();
  const [repo, setRepo] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    if (params.get("repo")) {
      setRepo(params.get("repo"));
    } else {
      setRepo(undefined);
    }
  }, [params]);

  return (
    <AppLayout>
      {!repo && mainRepository ? (
        <IncomingOrdersStatistics />
      ) : (
        <Orders repo={repo} />
      )}
    </AppLayout>
  );
};
