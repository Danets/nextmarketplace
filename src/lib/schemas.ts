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
    .min(1, {
      message: "Password is required.",
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
    .min(1, {
      message: "Password is required.",
    })
    .trim(),
});

export const ResetFormSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    })
    .trim(),
});
