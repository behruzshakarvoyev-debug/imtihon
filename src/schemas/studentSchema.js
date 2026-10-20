import { z } from "zod";

function calcAge(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export const studentSchema = z.object({
  firstName: z.string().trim().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  lastName: z.string().trim().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, "Telefon formati: +998 va 9 ta raqam (masalan, +998901234567)"),
  birthDate: z
    .string()
    .min(1, "Tug'ilgan sanani kiriting")
    .refine((v) => {
      const age = calcAge(v);
      return age >= 10 && age <= 60;
    }, "Yosh 10 dan 60 gacha bo'lishi kerak"),
  groupId: z.string().min(1, "Guruhni tanlang"),
  status: z.enum(["active", "frozen", "left"], {
    errorMap: () => ({ message: "Holatni tanlang (faol, muzlatilgan yoki ketgan)" }),
  }),
  note: z.string().optional().default(""),
});
