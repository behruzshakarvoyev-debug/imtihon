import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../schemas/loginSchema";
import { loginRequest, saveAdmin } from "../api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setServerError("");
    try {
      const res = await loginRequest(data.username, data.password);

      if (res.data.length === 0) {
        setServerError("Login yoki parol noto'g'ri");
        return;
      }

      saveAdmin(res.data[0]);
      navigate("/dashboard", { replace: true });
    } catch {
      setServerError("Serverga ulanib bo'lmadi");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardHeader>
            <CardTitle>EduPanel</CardTitle>
            <CardDescription>Hisobingizga kiring</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            {serverError && (
              <p className="rounded bg-red-50 p-2 text-sm text-red-600">
                {serverError}
              </p>
            )}

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Parol</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Tekshirilmoqda..." : "Kirish"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;