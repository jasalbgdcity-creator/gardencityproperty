import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Page Not Found | Garden City Properties",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <h1 className="text-5xl font-extrabold text-sky-400">404</h1>
      <h2 className="mt-3 text-xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-sm text-slate-400 max-w-md">
        The page you are looking for does not exist or has been relocated.
      </p>
      <Link
        href="/en/"
        className="mt-6 rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-2.5 text-xs font-semibold text-slate-950 shadow-lg hover:brightness-105 transition"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
