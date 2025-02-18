"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormLogin } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputCustom } from "@/components/form/input/InputCustome";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoadingFullpage from "../ui/loading/LoadingFullPage";
import { toast } from "react-toastify";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormLogin>>({
      resolver: zodResolver(FormLogin),
      defaultValues: {
        email: "",
        password: "",
      }
  });
  
  const onSubmit = (values: z.infer<typeof FormLogin>) => {
    startTransition( async () => {
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });
      
          if (result?.ok) {
            router.push("/admin"); // Redirect to dashboard after successful login
          } else {
            toast.error(result?.error || "An error occurred");
          }
    });
  };

  return (
    <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
      <LoadingFullpage isShown={isPending} />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <InputCustom
                    type="email"
                    placeholder="info@gmail.com" 
                    {...form.register('email')}/>
                    {form.formState.errors.email && <p className="text-error-500">{form.formState.errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <InputCustom
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...form.register('password')}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                    {form.formState.errors.password && <p className="text-error-500">{form.formState.errors.password.message}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
