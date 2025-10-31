import { api } from "@/api";
import { editOrderEndpoint } from "@/api/apisUrl";
import { orderSecondaryStatusArabicNames } from "@/lib/orderSecondaryStatusArabicNames";

export interface RepositoryConfirmOrderByReceiptNumberPayload {
    repositoryID?: number;
    secondaryStatus?: keyof typeof orderSecondaryStatusArabicNames;
}

export const repositoryConfirmOrderByReceiptNumberService = async ({
    orderId,
    data
}: {
    orderId: string;
    data: RepositoryConfirmOrderByReceiptNumberPayload;
}) => {
    const response = await api.patch<RepositoryConfirmOrderByReceiptNumberPayload>(
        `${editOrderEndpoint}repository-confirm-order-by-receipt-number/${orderId}`,
        data
    );
    return response.data;
};
