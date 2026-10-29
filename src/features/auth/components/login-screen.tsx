"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import loginBackground from "@/assets/banner/loginbg.png";
import { ROUTES, SITE } from "@/config/site";

import { useSession } from "../lib/session";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { Ornament } from "./ornament";
import { SecurityStrip } from "./security-strip";

type Step = { name: "credentials" } | { name: "forgot"; email: string };

export function LoginScreen() {
  const router = useRouter();
  const session = useSession();
  const [step, setStep] = useState<Step>({ name: "credentials" });

  // Already signed in → straight to the dashboard
  useEffect(() => {
    if (session) router.replace(ROUTES.dashboard);
  }, [session, router]);

  return (
    <main className="relative min-h-svh overflow-x-hidden pt-[70px] lg:flex lg:h-svh lg:justify-end lg:overflow-hidden lg:pb-[52px] lg:pt-0">
      <Image
        src={loginBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-[23%_center] lg:object-left"
      />

      <section className="relative z-10 flex min-h-[calc(100svh-70px)] justify-center px-4 lg:h-full lg:min-h-0 lg:w-[48%] lg:ml-auto lg:overflow-y-auto lg:py-4 lg:pl-[1%] lg:pr-[5%] lg:scrollbar-none">
        <div className="mb-auto w-full max-w-[500px] shrink-0 bg-white px-5 pb-[18px] pt-6 shadow-[rgba(0,0,0,0.12)_0px_1px_3px,rgba(0,0,0,0.24)_0px_1px_2px] sm:px-6 lg:my-auto lg:pb-3 lg:pt-[18px]">
          <div className="text-center">
            <Image src={SITE.logoMark} alt={SITE.legalName} width={606} height={412} priority className="mx-auto -my-2 h-[104px] w-auto" />
            <h2 className="text-[25px] font-bold leading-[1.1] text-dh-brand">Welcome Back!</h2>
            <p className="mt-0.5 text-[13px] font-semibold text-dh-orange-dark">{SITE.adminTitle} Portal</p>
            <Ornament className="mb-[7px] mt-1" />
          </div>

          {step.name === "credentials" ? (
            <LoginForm onForgotPassword={email => setStep({ name: "forgot", email })} />
          ) : (
            <ForgotPasswordForm initialEmail={step.email} onBack={() => setStep({ name: "credentials" })} />
          )}
        </div>
      </section>

      <SecurityStrip />
    </main>
  );
}
