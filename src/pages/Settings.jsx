import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { getStoredAdmin, getAdmin, updateAdminPassword } from "../api/auth";
import { passwordSchema } from "../schemas/passwordSchema";
import PageHeader from "../components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Settings() {
  const admin = getStoredAdmin();
  const { dark, setDark } = useOutletContext();
  const [serverError, setServerError] = useState("");

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  async function onSubmit(data) {
    setServerError("");
    try {
      const res = await getAdmin(admin.id);
      if (res.data.password !== data.currentPassword) {
        setServerError("Joriy parol noto'g'ri");
        return;
      }
      await updateAdminPassword(admin.id, data.newPassword);
      toast.success("Parol o'zgartirildi");
      reset();
    } catch {
      setServerError("Serverga ulanib bo'lmadi");
    }
  }

  return (
    <div>
      <PageHeader title="Sozlamalar" />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-4">
            <img src={admin.avatar} alt={admin.fullName} className="h-16 w-16 rounded-full" />
            <div className="text-sm">
              <p className="font-medium">{admin.fullName}</p>
              <p className="text-gray-500">@{admin.username}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ko'rinish</CardTitle></CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm">Tungi rejim (dark mode)</span>
            <Button variant="outline" onClick={() => setDark(!dark)}>
              {dark ? "O'chirish" : "Yoqish"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Parolni o'zgartirish</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid max-w-md gap-4">
              {serverError && (
                <p className="rounded bg-red-50 p-2 text-sm text-red-600">{serverError}</p>
              )}
              {[
                { name: "currentPassword", label: "Joriy parol" },
                { name: "newPassword", label: "Yangi parol" },
                { name: "confirmPassword", label: "Yangi parolni tasdiqlang" },
              ].map(({ name, label }) => (
                <div key={name} className="grid gap-1.5">
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} type="password" {...register(name)} />
                  {errors[name] && (
                    <p className="text-sm text-red-500">{errors[name].message}</p>
                  )}
                </div>
              ))}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saqlanmoqda..." : "Parolni o'zgartirish"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;