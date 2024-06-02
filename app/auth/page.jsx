"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Link from "next/link";
import React from "react";

export default function AuthPage() {
  const supabase = createClientComponentClient();
  return (
    <>
      <div id="AuthPage" className="w-full min-h-screen bg-white">
        <div className="flex items-center justify-center w-full p-5 border-b-gray-300">
          <Link href={"/"} className="min-w-[170px]">
            <img src="/images/logo.svg" width={"170"} alt="" />
          </Link>
        </div>

        <div className="flex items-center justify-center w-full p-5 border-b-gray-300">
          Login / Register
        </div>

        <div className="max-w-[400px] mx-auto px-2">
          <Auth
            onlyThirdPartyProviders
            providers={["google"]}
            redirectTo={`${window.location.origin}/auth/callback`}
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
          />
        </div>
      </div>
    </>
  );
}
