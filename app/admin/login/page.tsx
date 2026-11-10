"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect directly to /admin/
  useEffect(() => {
    let isMounted = true;

    async function checkExistingSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && isMounted) {
          router.replace("/admin/");
          return;
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    }

    checkExistingSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (session && (event === "SIGNED_IN" || event === "TOKEN_REFRESHED")) {
        router.replace("/admin/");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        router.replace("/admin/");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to sign in. Please try again.";
      setErrorMessage(msg);
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
          <p className="text-sm tracking-wide text-slate-400">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#050816] px-4 py-12">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-1/4 -start-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 -end-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to Public Site */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-400 uppercase transition hover:text-sky-300"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Public Site
        </Link>

        {/* Login Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-main.jpeg"
              alt="Garden City Properties"
              className="h-14 w-14 rounded-2xl object-contain shadow-lg"
            />
            <div className="mt-3 flex flex-col items-center">
              <span className="text-xl font-extrabold tracking-wide text-white">
                GARDEN<span className="text-amber-500">CITY</span>
              </span>
              <span className="text-[0.65rem] font-semibold tracking-[0.3em] text-cyan-400 uppercase">
                Properties · Admin Portal
              </span>
            </div>
            <h1 className="mt-6 font-[family-name:var(--font-outfit)] text-2xl font-bold text-white">
              Administrator Login
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign in with your authorized Supabase administrator credentials
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-200">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
              >
                Admin Email
              </label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gardencityproperties.om"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 ps-10 pe-4 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-wider text-slate-300 uppercase"
              >
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 py-3 ps-10 pe-4 text-sm text-white placeholder-slate-500 transition focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-cyan-400 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(56,189,248,0.35)] transition-all hover:shadow-[0_0_36px_rgba(56,189,248,0.55)] hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 border-t border-white/5 pt-4 text-center">
            <p className="text-[0.7rem] text-slate-500">
              Protected administrative environment · Garden City Properties
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
