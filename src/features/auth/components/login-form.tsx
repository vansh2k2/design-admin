"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "@/lib/swal";

import { Button } from "../ui/button";
import { Field, Input } from "../ui/form-controls";
import { ROUTES } from "@/config/site";

import { saveSession } from "../lib/session";
import { AuthError, login } from "../services/auth-service";
import { FormAlert } from "./form-alert";
import { AUTH_INPUT, AUTH_LABEL, AUTH_SUBMIT } from "../lib/styles";
import { PasswordInput } from "./password-input";

export function LoginForm({ onForgotPassword }: { onForgotPassword: (email: string) => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const admin = await login(email.trim(), password);
      saveSession(admin, remember);
      toast.success(`Welcome back, ${admin.name.split(" ")[0]}!`);
      // The route guard sends signed-out visitors here with ?from=<page>; return them to it
      const from = new URLSearchParams(window.location.search).get("from");
      router.replace(from?.startsWith("/") && !from.startsWith("//") ? from : ROUTES.dashboard);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Field label="Email Address or Username" htmlFor="login-email" required labelClassName={AUTH_LABEL}>
        <Input
          id="login-email"
          type="text"
          autoComplete="username"
          autoFocus
          required
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="email@example.com or username"
          className={AUTH_INPUT}
        />
      </Field>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className={AUTH_LABEL}>
            Password<span className="ml-0.5 text-red-500">*</span>
          </label>
          <button type="button" onClick={() => onForgotPassword(email)} className="text-[11px] font-semibold text-dh-brand hover:underline">
            Forgot password?
          </button>
        </div>
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          required
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="••••••••"
          className={AUTH_INPUT}
        />
      </div>

      <label className="flex w-max cursor-pointer items-center gap-2 text-[13px] font-semibold text-dh-brand">
        <input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} className="h-[17px] w-[17px] accent-dh-brand" />
        Keep me signed in
      </label>

      {error && <FormAlert message={error} />}

      <Button type="submit" loading={submitting} className={AUTH_SUBMIT}>
        {submitting ? "Signing in…" : "Login Securely"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-[13px] font-semibold text-dh-orange-dark">
        <ShieldCheck className="h-4 w-4" />
        Protected admin area
      </p>

      <div className="flex items-start gap-2 border border-[#90caf9] bg-[#e3f2fd] p-2 text-[#0d47a1]">
        <Lock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#1565c0]" />
        <p className="text-[13px] leading-[1.45]">
          <strong className="font-semibold">Authorised Access Only.</strong> For authorised staff only. All activities are monitored.
        </p>
      </div>
    </form>
  );
}
