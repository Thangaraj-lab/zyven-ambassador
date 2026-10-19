import Link from "next/link";
import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";
import { env } from "@/lib/env";

export default function JoinWhatsAppCommunityPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft-sm sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
          <MessageCircle className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Community network
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text">
          Join the Zyvex student community
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-text-muted">
          Connect with verified students, share campus opportunities, and receive
          important task and cohort announcements in the official Zyvex WhatsApp
          community.
        </p>

        <a
          href={env.NEXT_PUBLIC_WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          Join WhatsApp community
          <ExternalLink className="h-4 w-4" />
        </a>

        <p className="mt-5 text-xs leading-5 text-text-muted">
          Use the same verified account you use in Zyvex. Never share your
          password or private submission proof in the group.
        </p>
      </div>
    </section>
  );
}
