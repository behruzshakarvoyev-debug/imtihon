import { z } from "zod";

export const paymentSchema = z.object({
  studentId: z.string().min(1, "Talabani tanlang"),
  amount: z.coerce.number().min(1000, "Summa kamida 1 000 so'm bo'lishi kerak"),
  month: z.string().min(1, "Oyni tanlang"),
  method: z.enum(["naqd", "karta", "click"], {
    errorMap: () => ({ message: "To'lov usulini tanlang" }),
  }),
  paidAt: z.string().min(1, "To'lov sanasini kiriting"),
});
