'use client';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaGoogle } from "react-icons/fa6";
import { Button } from "../ui/button";
import Cookies from 'js-cookie';
import { registerUser } from '@/service/auth';
import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/lib/showToast';

// Zod schema with password confirmation
const signUpSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });
  }
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/my-account';

  const setUser = useAuthStore(s => s.setUser);

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
      };
      const res = await registerUser(payload);
      const token = res.token || res.accessToken;
      if (token) {
        Cookies.set('auth_token', token, { expires: 1 });
      }
      // Prefer backend provided user object if exists
      const userObj = res.user || { fullName: payload.fullName, email: payload.email, phone: payload.phone, roles: [], isActive: true, createdAt: new Date().toISOString() };
      setUser(userObj);
      showToast('Registration Success', '/images/products/placeholder.png', `Welcome ${payload.fullName}`);
      router.replace(redirectUrl);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 p-2">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Create an Account</h2>
        {/* <div>
          <Button type="button" className="w-full p-6 flex items-center justify-center gap-2 text-lg rounded-lg focus:outline-none mt-2">
            <FaGoogle size={25} /> Sign Up With Google
          </Button>
          <p className="text-lg font-bold my-4 text-center">OR</p>
        </div> */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              placeholder="John Doe"
              className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register('fullName')}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</Label>
            <Input
              type="text"
              id="phone"
              placeholder="(+84) 0901234567"
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register('phone')}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</Label>
            <Input
              type="email"
              id="email"
              placeholder="john@example.com"
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="******"
              className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register('password')}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="******"
              className={`w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none`}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 disabled:opacity-50 dark:bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
        <p className="text-center mt-4">Already have an account? <Link className="underline" href="/sign-in">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUpForm;
