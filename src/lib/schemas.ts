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

export const SettingsFormSchema = z.object({
  name: z.optional(z.string()),
  email: z.optional(z.string()),
});
