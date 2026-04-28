import { z } from "zod";

export const patientRegistrationSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  contact_number: z.string().min(10, "Contact number must be at least 10 characters."),
  dob: z.string().min(1, "Date of birth is required."),
  gender: z.string().min(1, "Gender is required."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  symptoms: z.string().min(10, "Please provide more details about the symptoms."),
  allergies: z.string().optional(),
  chronic_conditions: z.string().optional(),
});

export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>;
