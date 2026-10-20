import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { groupSchema } from "../../schemas/groupSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const emptyValues = {
  name: "",
  course: "",
  teacher: "",
  days: "toq",
  time: "",
  monthlyPrice: "",
  startDate: "",
  status: "active",
};

function Field({ label, error, children }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

function GroupForm({ defaultValues, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: defaultValues || emptyValues,
  });

  useEffect(() => {
    reset(defaultValues || emptyValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Guruh nomi" error={errors.name}>
          <Input {...register("name")} placeholder="FN-24" />
        </Field>
        <Field label="Kurs" error={errors.course}>
          <Input {...register("course")} placeholder="Frontend" />
        </Field>
      </div>

      <Field label="O'qituvchi" error={errors.teacher}>
        <Input {...register("teacher")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Kunlar" error={errors.days}>
          <Controller
            name="days"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="toq">Toq kunlar</SelectItem>
                  <SelectItem value="juft">Juft kunlar</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Vaqt" error={errors.time}>
          <Input type="time" {...register("time")} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Oylik narx (so'm)" error={errors.monthlyPrice}>
          <Input type="number" {...register("monthlyPrice")} />
        </Field>
        <Field label="Boshlanish sanasi" error={errors.startDate}>
          <Input type="date" {...register("startDate")} />
        </Field>
      </div>

      <Field label="Holat" error={errors.status}>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="finished">Tugagan</SelectItem>
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

export default GroupForm;