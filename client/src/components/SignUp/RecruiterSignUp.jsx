"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ------------------ ZOD SCHEMAS ------------------
const baseSchema = z.object({
  accountType: z.enum(["jobseeker", "recruiter"], {
    required_error: "Please select account type",
  }),
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const jobseekerSchema = baseSchema.extend({
  location: z.string().min(1, "Location is required"),
  skills: z.string().min(2, "Please enter your skills"),
  resume: z
    .any()
    .refine((f) => f instanceof File, { message: "Resume file is required" }),
});

const recruiterSchema = baseSchema.extend({
  companyName: z.string().min(2, "Company name is required"),
  companyWebsite: z.string().url("Company website must be valid"),
  industry: z.string().min(1, "Industry is required"),
  companyLogo: z.any().optional(),
});

export default function RecruiterSignUp() {
  const [step, setStep] = useState(1);
  const [formType, setFormType] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(baseSchema), // initial schema for step 1+2
    defaultValues: {
      accountType: "",
      fullName: "",
      email: "",
      password: "",
      location: "",
      skills: "",
      resume: null,
      companyName: "",
      companyWebsite: "",
      industry: "",
      companyLogo: null,
    },
  });

  const watchResume = form.watch("resume");
  const watchLogo = form.watch("companyLogo");

  // Helper: validate step before moving
  const validateStep = async (schema) => {
    try {
      const values = form.getValues();
      schema.parse(values);
      return true;
    } catch (e) {
      e.errors.forEach((err) => {
        form.setError(err.path[0], { message: err.message });
      });
      return false;
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const valid = await validateStep(z.object({ accountType: baseSchema.shape.accountType }));
      if (!valid) return;
      setFormType(form.getValues("accountType"));
      setStep(2);
    } else if (step === 2) {
      const valid = await validateStep(baseSchema);
      if (!valid) return;
      setStep(3);
    }
  };

  const prevStep = () => setStep(step - 1);



const onSubmit = ()=>{
console.log("Submit")
}
  return (
    <div className="font-montserrat ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* STEP 1 */}
          {step === 1 && (
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <Label>Account Type</Label>
                  <select
                    {...field}
                    className="border p-2 w-full rounded"
                    onChange={(e) => {
                      field.onChange(e);
                      setFormType(e.target.value);
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="jobseeker">Job Seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Full Name</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* STEP 3 - Job Seeker */}
          {step === 3 && formType === "jobseeker" && (
            <>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <Label>Location</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <Label>Skills</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resume"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <Label>Upload Resume</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => onChange(e.target.files[0])}
                    />
                    {watchResume && (
                      <p className="text-sm mt-1">Selected: {watchResume.name}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* STEP 3 - Recruiter */}
          {step === 3 && formType === "recruiter" && (
            <>
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <Label>Company Name</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <Label>Company Website</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <Label>Industry</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyLogo"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <Label>Upload Company Logo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files[0])}
                    />
                    {watchLogo && (
                      <p className="text-sm mt-1">Selected: {watchLogo.name}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            {step < 3 && (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            )}
            {step === 3 && (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
