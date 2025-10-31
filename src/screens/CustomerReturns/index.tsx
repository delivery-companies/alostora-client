import { AppLayout } from "@/components/AppLayout";
import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, TextInput, Grid, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { columns } from "./columns";
import { useTenants } from "@/hooks/useTenants";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useSaveOrder } from "@/hooks/useSaveOrder";
import { getCustomerOrders } from "@/services/customerOutputs";
import { OrdersTable } from "../Orders/components/OrdersTable";
import { useGetCustomerOutputs } from "@/hooks/useGetCustomerOutputs";
import { useRepositories } from "@/hooks/useRepositories";
import { useStores } from "@/hooks/useStores";
import { useEmployees } from "@/hooks/useEmployees";

export const CustomerReturns = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
  });
  const [receiptNumber, setReceiptNumber] = useState("");
  const [company, setCompany] = useState("");
  const [repository, setRepository] = useState("");
  const [store, setStore] = useState("");
  const [target, setTarget] = useState("");
  const { mutateAsync: saveOrder, isLoading: isLoading } = useSaveOrder();
  const [selectedAgent, setSelectAgent] = useState("");

  const fetchOrders = async () => {
    const respose = await getCustomerOrders({
      repository: +repository,
      storeId: +store,
      companyId: +company,
      type: target,
      page: filters.page || 1,
      size: filters.size || 10,
    });
    setOrders(respose.data.orders);
    setfilters((prev) => ({ ...prev, pagesCount: respose.data.pageCount }));
  };

  useEffect(() => {
    if (store || company || repository) {
      fetchOrders();
    }
  }, [company, store, repository, filters.page, filters.size]);

  const {
    data: storesData = {
      data: [],
    },
  } = useStores({ size: 100000, minified: true });

  const {
    data: tenantsData = {
      data: [],
    },
  } = useTenants({ size: 100000, minified: true });

  const {
    data: repositories = {
      data: [],
    },
  } = useRepositories({ size: 100000, minified: true, type: "RETURN" });

  const { data: Agents } = useEmployees({
    size: 100000,
    minified: true,
    roles: ["RECEIVING_AGENT"],
  });

  const confirm = async (orderId: string) => {
    await saveOrder({
      storeId: +store,
      orderId: orderId,
      companyId: +company,
      type: target,
      repository: +repository,
    });
    await fetchOrders();
    setReceiptNumber("");
  };

  const handleChangeOrderStatus = () => {
    if (receiptNumber.length === 0) {
      toast.error("أدخل رقم الوصل");
      return;
    }
    if (target === "") {
      toast.error("أدخل نوع الطلب");
      return;
    }
    if (target === "company" && company === "") {
      toast.error("أدخل شركة الطلب");
      return;
    }
    if (target === "client" && store === "") {
      toast.error("أدخل اسم المتجر");
      return;
    }
    if (target === "repository" && repository === "") {
      toast.error("أدخل اسم المخزن");
      return;
    }
    confirm(receiptNumber);
  };

  const { mutateAsync: createReport, isLoading: createReportLoading } =
    useGetCustomerOutputs();

  const createReportHandler = () => {
    if (target === "company" && company === "") {
      toast.error("أدخل اسم الشركه");
      return;
    }
    if (target === "client" && store === "") {
      toast.error("أدخل اسم المتجر");
      return;
    }
    if (target === "repository" && repository === "") {
      toast.error("أدخل اسم المخزن");
      return;
    }

    toast
      .promise(
        createReport({
          companyId: +company,
          storeId: +store,
          type: target,
          repositoryId: +repository,
          repositoryName:
            repositories.data.find((e) => e.id === +repository)?.name || "",
          receivingAgentId: selectedAgent ? +selectedAgent : undefined,
        }),
        {
          loading: "جاري تحميل الكشف...",
          success: "تم تحميل الكشف بنجاح",
          error: (error) => error.message || "حدث خطأ ما",
        }
      )
      .then(() => {
        setOrders([]);
        setCompany("");
        setRepository("");
        setTarget("");
      });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // setReceiptNumber(""); // Clear input after saving
      handleChangeOrderStatus();
    }
  };
  return (
    <AppLayout>
      <Button
        style={{ marginBottom: "30px" }}
        disabled={orders.length === 0 || createReportLoading}
        onClick={createReportHandler}>
        انشاء كشف راجع
      </Button>
      {createReportLoading ? (
        <l-line-spinner
          size="30"
          stroke="3"
          speed="1"
          color="#e72722"></l-line-spinner>
      ) : null}
      <Grid align="center" gutter="lg">
        <Grid.Col span={{ base: 12, md: 4, lg: 2, sm: 12, xs: 12 }}>
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
        <Grid.Col span={{ base: 12, md: 4, lg: 2, sm: 12, xs: 12 }}>
          <Select
            value={target}
            allowDeselect
            label="شركه \ متجر \ مخزن"
            searchable
            clearable
            onChange={(e) => {
              setTarget(e || "");
              setRepository("");
              setCompany("");
              setStore("");
            }}
            placeholder="اختر شركه \ متجر \ مخزن"
            data={[
              { value: "company", label: "شركه" },
              { value: "client", label: "متجر" },
              { value: "repository", label: "مخزن" },
            ]}
          />
        </Grid.Col>
        {target !== "" ? (
          <Grid.Col span={{ base: 12, md: 6, lg: 2, sm: 12, xs: 12 }}>
            <Select
              value={
                target === "company"
                  ? company
                  : target === "client"
                  ? store
                  : repository
              }
              allowDeselect
              label={
                target === "company"
                  ? "شركه"
                  : target === "client"
                  ? "متجر"
                  : "المخزن المرسل اليه"
              }
              searchable
              clearable
              onChange={(e) => {
                if (target === "company") {
                  setCompany(e || "");
                } else if (target === "client") {
                  setStore(e || "");
                } else {
                  setRepository(e || "");
                }
              }}
              placeholder={
                target === "company"
                  ? "اختر شركه"
                  : target === "client"
                  ? "اختر متجر"
                  : "اختر مخزن"
              }
              data={
                target === "company"
                  ? getSelectOptions(tenantsData.data)
                  : target === "client"
                  ? getSelectOptions(storesData.data)
                  : getSelectOptions(repositories.data)
              }
            />
          </Grid.Col>
        ) : null}
        {target === "client" ? (
          <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
            <Select
              value={selectedAgent}
              allowDeselect
              label="اختر مندوب للكشف"
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
        ) : null}
        <Button
          className="mt-6"
          disabled={isLoading}
          onClick={handleChangeOrderStatus}
          loading={isLoading}>
          تأكيد
        </Button>
      </Grid>
      <div className="relative mt-12">
        <LoadingOverlay visible={isLoading} />

        <OrdersTable
          key={orders.length}
          setFilters={setfilters}
          filters={{ ...filters }}
          data={orders}
          columns={columns}
        />
      </div>
    </AppLayout>
  );
};
