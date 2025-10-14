import { Role } from "@prisma/client";
import z from "zod";

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Username is required.",
    })
    .trim(),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .trim(),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long.",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .trim(),
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long.",
    })
    .trim(),
  code: z.optional(z.string().trim()),
});

export const ResetFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .trim(),
});

export const NewPasswordFormSchema = z.object({
  password: z
    .string()
    .min(4, {
      message: "Password must be at least 4 characters long.",
    })
    .trim(),
});

export const CategoryFormSchema = z.object({
  name: z.string().trim(),
});

export const SettingsFormSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(4)),
    newPassword: z.optional(z.string().min(4)),
    role: z.enum([Role.USER, Role.ADMIN]).optional(),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required when changing password.",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required when changing password.",
      path: ["password"],
    }
  );

export const DashboardSettingsFormSchema = z.object({
  name: z.string().min(1),
});
