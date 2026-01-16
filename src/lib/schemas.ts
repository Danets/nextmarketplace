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
  billboardId: z.string().trim(),
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

export const BillboardFormSchema = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const SizeFormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4),
});

export const ColorFormSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: "Color value must be a valid hex code starting with #",
  }),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1),
  images: z
    .object({
      url: z.string(),
    })
    .array(),
  price: z.coerce.number().min(0),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});
