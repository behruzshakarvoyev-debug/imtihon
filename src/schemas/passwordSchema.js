import { z } from "zod";

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Joriy parolni kiriting"),
    newPassword: z.string().min(6, "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak"),
    confirmPassword: z.string().min(1, "Yangi parolni tasdiqlang"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Yangi parol va tasdiqlash mos kelmadi",
    path: ["confirmPassword"],
  });
