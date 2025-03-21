"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define validation schema
const formSchema = z.object({
    firstname: z.string().min(2, "Enter your First Name"), 
    lastname: z.string().min(2, "Enter your Last Name"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });



function JobSeekerSignUp() {
   // 2. Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      password: "",
      email: "",
    },
  });

  // 3. Submit handler
  function onSubmit(values) {
    console.log(values);
  }

  return (
    <div className=' font-montserrat'>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md mx-auto p-6">
          {/* Username Field */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />

            <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
              
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

{/* Password Field */}
<FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input type="password" placeholder="Password" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
  
          <div className=" items-center flex justify-center">

          <Button type="submit" variant="rounded" className=' px-8'> Register </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default JobSeekerSignUp