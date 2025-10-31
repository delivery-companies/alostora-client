import { getOrderReceipt } from "@/services/getOrderReceipt";
import { useMutation } from "@tanstack/react-query";

export const useOrderReceipt = (name: string) => {
    return useMutation({
        mutationFn: (id: string[]) => getOrderReceipt(id, name)
    });
};
