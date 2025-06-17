"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { OAuthStrategy } from "@clerk/types";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";
import Image from "next/image";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

export default function Page() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    code?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else if (result.status === "needs_first_factor") {
        setVerifying(true);
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      if (Array.isArray(err?.errors)) {
        const fieldErrors: typeof errors = {};
        err.errors.forEach((e: any) => {
          if (e.meta?.paramName === "email_address")
            fieldErrors.email = e.message;
          else if (e.meta?.paramName === "password")
            fieldErrors.password = e.message;
          else fieldErrors.form = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!isLoaded) return;
    setLoading(true);

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.push("/dashboard");
      } else {
        setErrors({ code: "Verification incomplete. Please check the code." });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrors({ code: "Invalid verification code or other error." });
      setLoading(false);
    }
  };

  const signInWith = (strategy: OAuthStrategy) => {
    if (!signIn) return;
    setLoading(true);
    signIn.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  if (verifying) {
    return (
      <div className="w-full max-w-xs">
        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Check Your Email</h1>
            <p className="text-muted-foreground text-sm">
              Enter the code we sent to {emailAddress}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <InputOTP maxLength={6} value={code} onChange={setCode}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <div className="text-sm">
              Please enter the one-time password sent to your email.
            </div>
          </div>
          {errors.code && (
            <p className="text-red-600 text-sm text-center">{errors.code}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner /> : "Verify"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-x-0 after:top-1/2 after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2">
              Or continue with
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signInWith("oauth_microsoft")}
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft Logo"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                Sign in with Microsoft
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign Up
            </Link>
          </div>
          {errors.form && (
            <p className="text-red-600 text-sm mt-4">{errors.form}</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Sign In to your account</h1>
          <p className="text-muted-foreground text-sm">
            Sign In with your email address
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="border-primary-"
              placeholder="m@example.com"
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="border-primary-"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          {errors.form && (
            <p className="text-red-600 text-sm mt-4">{errors.form}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner /> : "Sign In"}
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-x-0 after:top-1/2 after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2">
              Or continue with
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signInWith("oauth_microsoft")}
            disabled={loading}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                  alt="Microsoft Logo"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
                Sign in with Microsoft
              </>
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
        <div id="clerk-captcha"></div>
      </form>
    </div>
  );
}
