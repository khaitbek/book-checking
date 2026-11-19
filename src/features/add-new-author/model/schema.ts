import z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address").nullable(),
  bio: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  image: z.instanceof(File),
});

export type FormFields = z.infer<typeof formSchema>;
