"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Player = {
  id: number;
  x: number;
  y: number;
  label: string;
};

const players: Player[] = [
  // Goalkeeper
  { id: 1, x: 50, y: 88, label: "GK" },

  // Back four
  { id: 2, x: 18, y: 69, label: "LB" },
  { id: 3, x: 39, y: 73, label: "CB" },
  { id: 4, x: 61, y: 73, label: "CB" },
  { id: 5, x: 82, y: 69, label: "RB" },

  // Midfield three
  { id: 6, x: 30, y: 54, label: "CMF" },
  { id: 7, x: 50, y: 61, label: "DMF" },
  { id: 8, x: 70, y: 54, label: "CMF" },

  // Front three
  { id: 9, x: 18, y: 25, label: "LWF" },
  { id: 10, x: 50, y: 18, label: "CF" },
  { id: 11, x: 82, y: 25, label: "RWF" },
];


const features = [
  {
    number: "01",
    title: "Build your shape",
    description:
      "Susun posisi pemain dengan bebas dan bentuk gaya bermain yang sesuai dengan idemu.",
    icon: "⌘",
  },
  {
    number: "02",
    title: "Switch instantly",
    description:
      "Pisahkan formasi attack dan defense lalu lihat perpindahannya secara fluid.",
    icon: "↔",
  },
  {
    number: "03",
    title: "Take it anywhere",
    description:
      "Simpan formasi dan gunakan aplikasi langsung dari browser seperti aplikasi di perangkatmu.",
    icon: "↗",
  },
];

export default function Home() {
  const [activePlayer, setActivePlayer] = useState(10);
  const [isInstallHintVisible, setIsInstallHintVisible] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActivePlayer((current) => {
        const currentIndex = players.findIndex(
          (player) => player.id === current,
        );

        return players[(currentIndex + 1) % players.length].id;
      });
    }, 1600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute bottom-[-300px] right-[-200px] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* ========================================================= */}
      {/* NAVBAR */}
      {/* ========================================================= */}

      <header className="relative z-50 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/30 bg-emerald-400/10 text-lg transition group-hover:border-emerald-400/60 group-hover:bg-emerald-400/20">
              ⚽
            </div>

            <div>
              <p className="text-sm font-black tracking-tight">TACTICAL</p>

              <p className="-mt-1 text-[9px] font-bold tracking-[0.3em] text-zinc-500">
                BOARD
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-zinc-500 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-zinc-500 transition hover:text-white"
            >
              How it works
            </a>

            <Link
              href="/formation"
              className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              Open Board
            </Link>
          </nav>

          <Link
            href="/formation"
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white md:hidden"
          >
            Open Board
          </Link>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative">
        <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
          {/* HERO COPY */}

          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Your tactics. Your game.
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Turn your
              <br />
              <span className="text-zinc-500">ideas</span> into
              <br />
              <span className="text-emerald-400">formation.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Sebuah tactical board sederhana untuk merancang formasi sepak
              bola, mencoba berbagai shape, dan melihat bagaimana tim bergerak
              dari attack ke defense.
            </p>

            {/* CTA */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/formation"
                className="group inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-black shadow-[0_0_40px_rgba(52,211,153,0.15)] transition hover:bg-emerald-300 hover:shadow-[0_0_50px_rgba(52,211,153,0.25)]"
              >
                Start Building
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setIsInstallHintVisible(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <span>＋</span>
                Install App
              </button>
            </div>

            {/* MICRO STATS */}

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.07] pt-7">
              <div>
                <p className="text-lg font-black text-white">11</p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Players
                </p>
              </div>

              <div>
                <p className="text-lg font-black text-white">7+</p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Formations
                </p>
              </div>

              <div>
                <p className="text-lg font-black text-white">∞</p>

                <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Possibilities
                </p>
              </div>
            </div>
          </div>

          {/* HERO PITCH */}

          <div className="relative mx-auto w-full max-w-[520px]">
            {/* Glow */}

            <div className="absolute inset-[-30px] rounded-full bg-emerald-400/10 blur-[80px]" />

            {/* Pitch container */}

            <div className="relative aspect-[3/4] rotate-[1deg] overflow-hidden rounded-2xl border border-white/10 bg-[#13783b] shadow-2xl shadow-black/80">
              {/* Pitch texture */}

              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0, transparent 12%, rgba(255,255,255,.8) 12%, rgba(255,255,255,.8) 24%)",
                }}
              />

              {/* Outer lines */}

              <div className="absolute inset-[5%] border-2 border-white/70" />

              {/* Center line */}

              <div className="absolute left-[5%] right-[5%] top-1/2 h-[2px] bg-white/70" />

              {/* Center circle */}

              <div className="absolute left-1/2 top-1/2 aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />

              {/* Center dot */}

              <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

              {/* Penalty areas */}

              <div className="absolute left-[27%] right-[27%] top-[5%] h-[17%] border-2 border-white/70" />

              <div className="absolute left-[38%] right-[38%] top-[5%] h-[7%] border-2 border-white/70" />

              <div className="absolute bottom-[5%] left-[27%] right-[27%] h-[17%] border-2 border-white/70" />

              <div className="absolute bottom-[5%] left-[38%] right-[38%] h-[7%] border-2 border-white/70" />

              {/* Goal */}

              <div className="absolute left-[42%] right-[42%] top-[2%] h-[4%] border-2 border-white/60" />

              <div className="absolute bottom-[2%] left-[42%] right-[42%] h-[4%] border-2 border-white/60" />

              {/* Players */}

              {players.map((player) => {
                const active = player.id === activePlayer;

                return (
                  <div
                    key={player.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                    style={{
                      left: `${player.x}%`,
                      top: `${player.y}%`,
                    }}
                  >
                    {active && (
                      <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-emerald-300/30" />
                    )}

                    <div
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white shadow-lg transition-all duration-500 sm:h-11 sm:w-11 ${
                        active
                          ? "scale-125 border-emerald-300 shadow-emerald-400/50"
                          : "border-emerald-500"
                      }`}
                    >
                      <span className="text-[7px] font-black text-emerald-600 sm:text-[8px]">
                        {player.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Floating label */}

              <div className="absolute bottom-5 left-5 rounded-lg border border-white/10 bg-black/70 px-3 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                  <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                    4 - 3 - 3
                  </span>
                </div>

                <p className="mt-0.5 text-[8px] text-zinc-500">
                  Attacking shape
                </p>
              </div>

              {/* Formation badge */}

              <div className="absolute right-5 top-5 rounded-lg border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md">
                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">
                  Tactical
                </p>

                <p className="text-sm font-black text-white">BOARD</p>
              </div>
            </div>

            {/* Decorative numbers */}

            <div className="absolute -bottom-8 -left-8 hidden text-[100px] font-black leading-none text-white/[0.025] sm:block">
              11
            </div>

            <div className="absolute -right-5 top-1/3 hidden text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-700 [writing-mode:vertical-rl] sm:block">
              CREATE YOUR GAME
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TICKER */}
      {/* ========================================================= */}

      <div className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto flex max-w-7xl items-center overflow-hidden px-6 py-4">
          <div className="flex min-w-max animate-[marquee_20s_linear_infinite] items-center gap-8">
            {[
              "FORMATION",
              "TACTICS",
              "ATTACK",
              "DEFENSE",
              "POSITION",
              "FLUID TRANSITION",
              "FORMATION",
              "TACTICS",
              "ATTACK",
              "DEFENSE",
            ].map((item, index) => (
              <div key={`${item}-${index + 1}`} className="flex items-center gap-8">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                  {item}
                </span>

                <span className="text-emerald-500/50">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FEATURES */}
      {/* ========================================================= */}

      <section id="features" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
            Everything you need
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Simple tools.
            <br />
            <span className="text-zinc-600">Serious tactics.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="group relative bg-[#080808] p-7 transition hover:bg-[#0c0c0c] sm:p-9"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-black text-zinc-700">
                  {feature.number}
                </span>

                <span className="text-2xl text-zinc-700 transition group-hover:text-emerald-400">
                  {feature.icon}
                </span>
              </div>

              <h3 className="mt-14 text-xl font-black">{feature.title}</h3>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {feature.description}
              </p>

              <div className="mt-8 h-px w-8 bg-zinc-800 transition-all group-hover:w-16 group-hover:bg-emerald-400" />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* LIGHTWEIGHT SECTION */}
      {/* ========================================================= */}

      <section className="border-y border-white/[0.06] bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-xl">
              ⚡
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">
              Built for the web
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
              Open it.
              <br />
              <span className="text-emerald-400">Build it.</span>
              <br />
              Get back to the game.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-zinc-500">
              Tidak perlu aplikasi besar yang memenuhi penyimpanan perangkat.
              Buka tactical board, susun strategi, simpan, dan lanjutkan kapan
              saja.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                title: "Lightweight",
                text: "Ringan digunakan",
              },
              {
                title: "Fast",
                text: "Responsif saat digunakan",
              },
              {
                title: "Offline-ready",
                text: "Tetap terasa seperti app",
              },
              {
                title: "Installable",
                text: "Bisa dipasang di device",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 ${
                  index === 0 ? "hover:border-emerald-400/20" : ""
                } transition`}
              >
                <div className="mb-8 text-xs font-black text-zinc-700">
                  0{index + 1}
                </div>

                <p className="text-sm font-black text-white">{item.title}</p>

                <p className="mt-1 text-xs leading-5 text-zinc-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* HOW IT WORKS */}
      {/* ========================================================= */}

      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">
            Three simple steps
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            From idea to formation.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3">
          {/* Connecting line */}

          <div className="absolute left-[16%] right-[16%] top-5 hidden h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent md:block" />

          {[
            {
              number: "01",
              title: "Choose a shape",
              text: "Mulai dari formation preset yang sudah tersedia.",
            },
            {
              number: "02",
              title: "Move your players",
              text: "Atur setiap pemain sampai posisi terasa tepat.",
            },
            {
              number: "03",
              title: "Save your tactics",
              text: "Simpan layout dan gunakan kembali kapan pun.",
            },
          ].map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="relative mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-black text-xs font-black text-emerald-400">
                {step.number}
              </div>

              <h3 className="mt-6 text-lg font-black">{step.title}</h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-emerald-400/20 bg-[#07120d] px-6 py-16 text-center sm:px-12">
          {/* Background pitch lines */}

          <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
            <div className="absolute inset-[10%] rounded-2xl border-2 border-emerald-400" />

            <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-400" />

            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-400" />
          </div>

          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-400">
              Ready when you are
            </p>

            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Your next formation
              <br />
              starts here.
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-zinc-500">
              Tidak perlu setup panjang. Masuk ke board, pilih formasi, dan
              mulai menyusun permainanmu.
            </p>

            <Link
              href="/formation"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-7 py-4 text-sm font-black text-black transition hover:bg-emerald-300"
            >
              Build My Formation
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER */}
      {/* ========================================================= */}

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚽</span>

            <span className="text-xs font-black tracking-wider">
              TACTICAL BOARD
            </span>
          </div>

          <p className="text-[10px] text-zinc-700">
            Build your game. One position at a time.
          </p>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* INSTALL MODAL */}
      {/* ========================================================= */}

      {isInstallHintVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close install dialog"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsInstallHintVisible(false)}
          />

          {/* Modal */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-dialog-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0b0b] p-7 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
                  Install Tactical Board
                </p>

                <h3
                  id="install-dialog-title"
                  className="mt-2 text-2xl font-black"
                >
                  Make it feel like an app.
                </h3>
              </div>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => setIsInstallHintVisible(false)}
                className="text-zinc-600 transition hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Jika browser mendukung instalasi web app, gunakan opsi{" "}
              <span className="font-bold text-zinc-300">Install</span> atau{" "}
              <span className="font-bold text-zinc-300">
                Add to Home Screen
              </span>
              .
            </p>

            <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400 text-lg">
                  ⚽
                </div>

                <div>
                  <p className="text-sm font-bold">Tactical Board</p>

                  <p className="text-xs text-zinc-600">
                    Your personal tactical board
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/formation"
              onClick={() => setIsInstallHintVisible(false)}
              className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-3 text-sm font-black text-black transition hover:bg-emerald-400"
            >
              Open Tactical Board
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MARQUEE ANIMATION */}
      {/* ========================================================= */}

      <style jsx global>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </main>
  );
}
