import { z } from "zod";

export const groupSchema = z.object({
  name: z
    .string()
    .regex(/^[A-Z]{2,4}-\d+$/, "Guruh nomi FN-24 ko'rinishida bo'lsin (2-4 katta harf, chiziqcha, raqamlar)"),
  course: z.string().trim().min(2, "Kurs nomini kiriting"),
  teacher: z.string().trim().min(3, "O'qituvchi ismi kamida 3 ta belgi bo'lsin"),
  days: z.enum(["toq", "juft"], {
    errorMap: () => ({ message: "Kunlarni tanlang (toq yoki juft)" }),
  }),
  time: z.string().min(1, "Dars vaqtini kiriting"),
  monthlyPrice: z.coerce
    .number({ invalid_type_error: "Narxni raqamda kiriting" })
    .min(100000, "Oylik narx kamida 100 000 so'm bo'lishi kerak"),
  startDate: z.string().min(1, "Boshlanish sanasini kiriting"),
  status: z.enum(["active", "finished"], {
    errorMap: () => ({ message: "Guruh holatini tanlang" }),
  }),
});
