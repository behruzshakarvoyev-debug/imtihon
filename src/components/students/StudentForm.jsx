import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "../../schemas/studentSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const emptyValues = {
  firstName: "",
  lastName: "",
  phone: "+998",
  birthDate: "",
  groupId: "",
  status: "active",
  note: "",
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

function StudentForm({ defaultValues, groups, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultValues || emptyValues,
  });

  useEffect(() => {
    reset(defaultValues || emptyValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ism" error={errors.firstName}>
          <Input {...register("firstName")} />
        </Field>
        <Field label="Familiya" error={errors.lastName}>
          <Input {...register("lastName")} />
        </Field>
      </div>

      <Field label="Telefon" error={errors.phone}>
        <Input {...register("phone")} placeholder="+998901234567" />
      </Field>

      <Field label="Tug'ilgan sana" error={errors.birthDate}>
        <Input type="date" {...register("birthDate")} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Guruh" error={errors.groupId}>
          <Controller
            name="groupId"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Holat" error={errors.status}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="frozen">Muzlatilgan</SelectItem>
                  <SelectItem value="left">Ketgan</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field label="Izoh" error={errors.note}>
        <Input {...register("note")} />
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
      </Button>
    </form>
  );
}

export default StudentForm;