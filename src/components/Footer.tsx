import { ArrowUpRight, FileText, FileCode } from "lucide-react";
import { SOURCE_REPO, SOURCE_TALK, PDF_HREF, MD_HREF } from "../config";
import { skills, vocab, books } from "../data";
import { COLOPHON } from "../crab";

export default function Footer() {
  return (
    <footer className="relative z-20 px-6 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="reveal flex items-center gap-4">
          <span className="text-[11px] font-medium tracking-[0.16em] text-white/45">
            SOURCE AND LICENSE
          </span>
          <span className="h-px flex-1 bg-white/12" />
        </div>

        <h2
          className="reveal mt-6 max-w-[18ch] text-white"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: "clamp(30px, 4vw, 48px)",
            lineHeight: 1.08,
          }}
        >
          The ideas here are not mine.
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="reveal">
            <p className="max-w-[58ch] text-[14.5px] leading-relaxed text-white/55">
              The skills, their text, and the argument summarised on this page are the
              work of <span className="text-white">Matt Pocock</span>, published under
              the MIT License, copyright 2026 Matt Pocock. The MIT License permits use,
              copying, modification, and redistribution provided the copyright and
              permission notices are included. The software is provided as is, without
              warranty of any kind.
            </p>
            <p className="mt-4 max-w-[58ch] text-[14.5px] leading-relaxed text-white/40">
              This page reorganises that material into a reference. It is study notes,
              not original work. For the authoritative text of any skill, read its
              SKILL.md in the original repository.
            </p>
          </div>

          <div className="reveal flex flex-col gap-3">
            {[
              { href: SOURCE_REPO, label: "Original repository", icon: ArrowUpRight, ext: true },
              { href: SOURCE_TALK, label: "Watch the talk", icon: ArrowUpRight, ext: true },
              { href: PDF_HREF, label: "Reference as PDF", icon: FileText, ext: false },
              { href: MD_HREF, label: "Reference as Markdown", icon: FileCode, ext: false },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.ext ? "_blank" : undefined}
                rel={l.ext ? "noreferrer" : undefined}
                className="liquid-glass group flex items-center justify-between rounded-full px-6 py-4 text-[14px] text-white/75 no-underline transition-colors duration-200 hover:text-white"
              >
                {l.label}
                <l.icon
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        </div>

        <div className="reveal mt-20 border-t border-white/10 pt-8">
          <p className="text-[11px] font-medium tracking-[0.16em] text-white/30">
            COLOPHON
          </p>
          <p className="mt-3 max-w-[58ch] text-[14.5px] leading-relaxed text-white/45">
            {COLOPHON}{" "}
            <a
              href="#seam"
              className="text-white/70 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              It is standing on a seam.
            </a>
          </p>
        </div>

        <div className="reveal mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="text-[11px] tracking-[0.14em] text-white/30">
            {skills.length} SKILLS. {vocab.length} TERMS. {books.length} BOOKS.
          </p>
          <p className="text-[11px] tracking-[0.14em] text-white/30">
            COMPILED BY SUBHOJIT BHATTACHARYA
          </p>
        </div>
      </div>
    </footer>
  );
}
