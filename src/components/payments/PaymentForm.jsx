import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "../../schemas/paymentSchema";
import { currentMonth } from "../../utils/debt";
import { formatMoney } from "../../utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const today = () => new Date().toISOString().slice(0, 10);

const emptyValues = () => ({
  studentId: "",
  amount: "",
  month: currentMonth(),
  method: "naqd",
  paidAt: today(),
});

function Field({ label, error, children }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

function PaymentForm({ defaultValues, students, payments, onSubmit, isSubmitting }) {
  const {
    register, handleSubmit, control, reset, setValue, watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: defaultValues || emptyValues(),
  });

  useEffect(() => {
    reset(defaultValues || emptyValues());
  }, [defaultValues, reset]);

  const studentId = watch("studentId");
  const month = watch("month");

  // Talaba tanlanganda summa avtomatik guruh narxi bo'ladi
  function handleStudentChange(value, onChange) {
    onChange(value);
    const student = students.find((s) => String(s.id) === value);
    if (student?.group) setValue("amount", student.group.monthlyPrice);
  }

  // Shu oy uchun to'liq to'lagan bo'lsa ogohlantirish
  const selected = students.find((s) => String(s.id) === studentId);
  let warning = "";
  if (selected?.group) {
    const paid = payments
      .filter((p) => p.studentId === selected.id && p.month === month)
      .reduce((sum, p) => sum + p.amount, 0);
    if (paid >= selected.group.monthlyPrice) {
      warning = `Bu talaba ${month} oyi uchun to'liq to'lagan (${formatMoney(paid)}).`;
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <Field label="Talaba" error={errors.studentId}>
        <Controller
          name="studentId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(v) => handleStudentChange(v, field.onChange)}
            >
              <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.lastName} {s.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      {warning && (
        <p className="rounded bg-yellow-50 p-2 text-sm text-yellow-800">{warning}</p>
      )}

      <Field label="Summa (so'm)" error={errors.amount}>
        <Input type="number" {...register("amount")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Oy" error={errors.month}>
          <Input type="month" {...register("month")} />
        </Field>
        <Field label="To'lov sanasi" error={errors.paidAt}>
          <Input type="date" {...register("paidAt")} />
        </Field>
      </div>

      <Field label="Usul" error={errors.method}>
        <Controller
          name="method"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="naqd">Naqd</SelectItem>
                <SelectItem value="karta">Karta</SelectItem>
                <SelectItem value="click">Click</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </form>
  );
}

export default PaymentForm;