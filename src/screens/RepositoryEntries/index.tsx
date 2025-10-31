import { AppLayout } from "@/components/AppLayout";
// import { useCreateReport } from "@/hooks/useCreateReport";
// import { useCreateReportsDocumentation } from "@/hooks/useCreateReportsDocumentation";
import {  useRepositoryOrders } from "@/hooks/useOrders";
import type { OrdersFilter } from "@/services/getOrders";
// import { useRepositoryOrdersStore } from "@/store/repositoryEntriesOrders";
import { LoadingOverlay } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import {  useState } from "react";
// import toast from "react-hot-toast";
import { DataTable } from "../Employees/data-table";
// import { ChangeOrdersRepositories } from "./components/ChangeOrdersRepositories";
// import { DeleteSelectedRepositoryEntriesModal } from "./components/DeleteSelectedRepositoryEntriesModal";
import { RepositoryEntriesFilters } from "./components/RepositoryEntriesFilters";
import { SendOrderToRepository } from "./components/SendOrderToRepository";
import { columns } from "./components/columns";

// const repositoryEntriesInitialStatuses = ["RETURNED", "PARTIALLY_RETURNED", "REPLACED"];

export const RepositoryEntries = () => {
    // const { deleteAllRepositoryOrders, repositoryOrders } = useRepositoryOrdersStore();
    const [filters, setFilters] = useState<OrdersFilter>({
        page:1,
        size:10,
        pagesCount:1,
        client_id:undefined,
        repository_id:undefined,
        store_id:undefined,
        governorate:undefined,
        secondaryStatus:"IN_REPOSITORY",
        status:"RETURNED"
    });

    const [search, setSearch] = useDebouncedState("", 300);


    const { data: orders= {
                data: {
                    orders: [],
                },
                pagesCount: 0
            },isInitialLoading,isError}=useRepositoryOrders(filters)

    
    // const { mutateAsync: createGeneralReport, isLoading: isCreatingReport } = useCreateReportsDocumentation();
    // // const { mutateAsync: createReport, isLoading: isCreateReportLoading } = useCreateReport();

    // const isRepositoryOrdersSelected = repositoryOrders.length;

    // const handleCreateGeneralReport = () => {
    //     toast.promise(
    //         createGeneralReport(
    //             {
    //                 type: "GENERAL",
    //                 ordersIDs: isRepositoryOrdersSelected
    //                     ? repositoryOrders.map((order) => Number(order.id))
    //                     : "*",
    //                 params: {
    //                     ...filters,
    //                     statuses: filters.statuses?.length
    //                         ? filters.statuses
    //                         : repositoryEntriesInitialStatuses,
    //                     search
    //                 }
    //             },
    //             {
    //                 onSuccess: () => deleteAllRepositoryOrders()
    //             }
    //         ),
    //         {
    //             loading: "جاري تحميل تقرير...",
    //             success: "تم تحميل تقرير بنجاح",
    //             error: (error) => error.message || "حدث خطأ ما"
    //         }
    //     );
    // };

    // const handleCreateReport = (type: "CLIENT" | "COMPANY" | "REPOSITORY") => {
        
    //     toast.promise(
    //         createReport(
    //             {
    //                 type,
    //                 secondaryType: "RETURNED",
    //                 companyID: type === "COMPANY" ? Number(filters.company_id) : undefined,
    //                 clientID: type === "CLIENT" ? Number(filters.client_id) : undefined,
    //                 storeID: type === "CLIENT" ? Number(filters.store_id) : undefined,
    //                 repositoryID: type === "REPOSITORY" ? Number(filters.repository_id) : undefined,
    //                 ordersIDs: isRepositoryOrdersSelected
    //                     ? repositoryOrders.map((order) => Number(order.id))
    //                     : "*",
    //                 params: {
    //                     ...filters,
    //                     repository_report:type === "REPOSITORY"? "0":undefined,
    //                     company_report:type === "COMPANY" ? "0":undefined,
    //                     client_report:type === "CLIENT" ? "0":undefined,
    //                     statuses: filters.statuses?.length
    //                         ? filters.statuses
    //                         : repositoryEntriesInitialStatuses,
    //                     search
    //                 }
    //             },
    //             {
    //                 onSuccess: () => deleteAllRepositoryOrders()
    //             }
    //         ),
    //         {
    //             loading: "جاري تحميل الكشف...",
    //             success: "تم تحميل الكشف بنجاح",
    //             error: (error) => error.message || "حدث خطأ ما"
    //         }
    //     );
    // };

    const [receiptError] = useState<string | null>(null);

    return (
        <AppLayout isError={isError}>
            <div className="flex items-center mb-6 gap-2 flex-wrap">
                <h1 style={{color:"#e72722",textAlign:"center",fontWeight:"bold"}}>ادخال الطلبات الراجعه اللى المخزن</h1>
                {/* <DeleteSelectedRepositoryEntriesModal /> */}
                {/* <ChangeOrdersRepositories /> */}
                {/* <Button disabled={isCreatingReport} onClick={handleCreateGeneralReport}>
                    انشاء تقرير
                </Button> */}
                {/* <Button
                    disabled={isCreateReportLoading}
                    onClick={() => {
                        if (!filters.company_id) {
                            toast.error("يجب اختيار شركة");
                            return;
                        }
                        handleCreateReport("COMPANY");
                    }}
                >
                    انشاء كشف رواجع للشركة
                </Button> */}
                {/* <Button
                    disabled={isCreateReportLoading}
                    onClick={() => {
                        if (!filters.store_id) {
                            toast.error("يجب اختيار المتجر");
                            return;
                        }
                        handleCreateReport("CLIENT");
                    }}
                >
                    انشاء كشف رواجع للعميل
                </Button> */}
                {/* <Button
                    disabled={isCreateReportLoading}
                    onClick={() => {
                        if (!filters.repository_id) {
                            toast.error("يجب اختيار مخزن");
                            return;
                        }
                        handleCreateReport("REPOSITORY");
                    }}
                >
                    انشاء كشف رواجع للمخزن
                </Button> */}
            </div>
            <RepositoryEntriesFilters
                filters={filters}
                setFilters={setFilters}
                search={search}
                setSearch={setSearch}
                receiptError={receiptError}
            />
            <SendOrderToRepository />
            <div className="relative mt-12">
                <LoadingOverlay visible={isInitialLoading} />
                <DataTable
                    filters={{
                        ...filters,
                        pagesCount: orders.pagesCount
                    }}
                    setFilters={setFilters}
                    data={orders.data.orders}
                    columns={columns}
                />
            </div>
        </AppLayout>
    );
};
