"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, Mail, MailCheck } from "lucide-react";

import { Button } from "../ui/button";
import { Field, Input } from "../ui/form-controls";

import { AuthError, requestPasswordReset } from "../services/auth-service";
import { AUTH_INPUT, AUTH_LABEL, AUTH_SUBMIT } from "../lib/styles";
import { FormAlert } from "./form-alert";

export function ForgotPasswordForm({ initialEmail, onBack }: { initialEmail: string; onBack: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof AuthError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const backButton = (
    <button type="button" onClick={onBack} className="flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-dh-muted hover:text-dh-ink">
      <ArrowLeft className="h-4 w-4" /> Back to sign in
    </button>
  );

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
          <MailCheck className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-dh-ink">Check your inbox</h3>
          <p className="mt-1 text-[13px] text-dh-muted">
            If an account exists for <span className="font-semibold text-dh-ink">{email}</span>, we&apos;ve sent password reset instructions.
          </p>
        </div>
        {backButton}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-dh-brand-soft text-dh-brand ring-1 ring-dh-brand/15">
          <Mail className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-dh-ink">Reset your password</h3>
        <p className="mt-1 text-[13px] text-dh-muted">Enter your registered email and we&apos;ll send you a reset link.</p>
      </div>
      <Field label="Email Address" htmlFor="forgot-email" required labelClassName={AUTH_LABEL}>
        <Input id="forgot-email" type="email" autoFocus required value={email} onChange={event => setEmail(event.target.value)} className={AUTH_INPUT} />
      </Field>
      {error && <FormAlert message={error} />}
      <Button type="submit" loading={submitting} className={AUTH_SUBMIT}>
        Send Reset Link
      </Button>
      {backButton}
    </form>
  );
}
