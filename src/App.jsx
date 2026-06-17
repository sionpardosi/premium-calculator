import React, { useState, useEffect } from "react";
import { evaluate } from "mathjs";
import {
  X,
  Check,
  ArrowLeft,
  Sparkles,
  History,
  Settings,
  Palette,
  Crown,
  Calculator as CalculatorIcon,
  Lock,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "Rp 19.000",
    period: "/bulan",
    tagline: "Untuk operasi sederhana",
    features: ["Hasil penjumlahan", "Hasil pengurangan", "Riwayat 1 hasil terakhir"],
  },
  {
    id: "advanced",
    name: "Advanced",
    price: "Rp 39.000",
    period: "/bulan",
    tagline: "Paling banyak dipilih",
    features: [
      "Semua di Basic",
      "Hasil perkalian & pembagian",
      "Perhitungan persentase",
    ],
    highlight: true,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: "Rp 79.000",
    period: "/bulan",
    tagline: "Tanpa batas tombol sama-dengan",
    features: [
      "Semua di Advanced",
      "Tombol = tanpa batas",
      "Presisi hingga 4 desimal",
    ],
  },
];

const NAV_ITEMS = [
  { id: "calculator", label: "Calculator", icon: CalculatorIcon, locked: false },
  { id: "history", label: "History", icon: History, locked: true },
  { id: "themes", label: "Themes", icon: Palette, locked: true },
  { id: "settings", label: "Settings", icon: Settings, locked: false },
];

/* ------------------------------------------------------------------ */
/*  SIDEBAR                                                             */
/* ------------------------------------------------------------------ */

function Sidebar({ onUpgradeClick }) {
  const [active, setActive] = useState("calculator");

  return (
    <aside className="w-64 shrink-0 bg-[#0d0d0d] border-r border-[#1f1f1f] flex flex-col">
      <div className="px-6 py-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#1ED760] flex items-center justify-center">
          <CalculatorIcon className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
        </div>
        <span className="text-white font-bold text-[15px] tracking-tight">
          Calculator Pro
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                if (item.locked) onUpgradeClick();
              }}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#1a1a1a] text-white"
                  : "text-[#a7a7a7] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.locked && <Lock className="w-3.5 h-3.5 text-[#6a6a6a]" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-xl bg-gradient-to-br from-[#1ED760]/15 to-[#1ED760]/5 border border-[#1ED760]/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-[#1ED760]" />
            <span className="text-white text-sm font-semibold">
              Calculator Pro
            </span>
          </div>
          <p className="text-[#a7a7a7] text-xs mb-3 leading-relaxed">
            Buka hasil kalkulasi, riwayat, dan tema eksklusif.
          </p>
          <button
            onClick={onUpgradeClick}
            className="w-full py-2 rounded-lg bg-[#1ED760] text-black text-xs font-bold hover:bg-[#1fdf64] transition-colors"
          >
            Upgrade sekarang
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-[#1f1f1f] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-white text-xs font-semibold">
          U
        </div>
        <div className="leading-tight">
          <p className="text-white text-xs font-medium">User</p>
          <p className="text-[#6a6a6a] text-[11px]">Free plan</p>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  DISPLAY                                                             */
/* ------------------------------------------------------------------ */

function Display({ expression, value }) {
  return (
    <div className="px-8 pt-10 pb-8 bg-[#161616] rounded-2xl border border-[#262626]">
      <div className="text-right text-[#828282] text-sm h-5 truncate font-mono tracking-wide">
        {expression || "\u00A0"}
      </div>
      <div className="text-right text-white text-6xl font-light mt-3 truncate font-mono tracking-tight">
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KEYPAD                                                              */
/* ------------------------------------------------------------------ */

function Keypad({ onKey }) {
  const rows = [
    ["C", "%", "DEL", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "=", null],
  ];

  const keyStyle = (key) => {
    const base =
      "h-16 rounded-xl text-lg font-medium transition-all duration-100 active:scale-95 select-none flex items-center justify-center";
    if (key === "=") {
      return `${base} bg-[#1ED760] text-black hover:bg-[#1fdf64] col-span-2 font-semibold`;
    }
    if (["+", "-", "*", "/", "%"].includes(key)) {
      return `${base} bg-[#1f1f1f] text-[#1ED760] hover:bg-[#272727] border border-[#2a2a2a]`;
    }
    if (["C", "DEL"].includes(key)) {
      return `${base} bg-[#1f1f1f] text-[#a7a7a7] hover:bg-[#272727] border border-[#2a2a2a] text-base`;
    }
    return `${base} bg-[#1f1f1f] text-white hover:bg-[#272727] border border-[#2a2a2a]`;
  };

  return (
    <div className="grid grid-cols-4 gap-3 mt-5">
      {rows.flat().map((key, idx) => {
        if (key === null) return null;
        return (
          <button key={idx} onClick={() => onKey(key)} className={keyStyle(key)}>
            {key === "DEL" ? "⌫" : key}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PLAN CARD                                                           */
/* ------------------------------------------------------------------ */

function PlanCard({ plan, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(plan)}
      className={`w-full text-left rounded-xl border px-4 py-4 transition-colors ${
        selected
          ? "border-[#1ED760] bg-[#1ED760]/[0.06]"
          : "border-[#2a2a2a] bg-[#161616] hover:border-[#3a3a3a]"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{plan.name}</span>
          {plan.highlight && (
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-[#1ED760] text-black px-2 py-0.5 rounded-full">
              Populer
            </span>
          )}
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
            selected ? "border-[#1ED760] bg-[#1ED760]" : "border-[#4a4a4a]"
          }`}
        >
          {selected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
        </div>
      </div>
      <p className="text-xs text-[#828282] mb-2">{plan.tagline}</p>
      <p className="text-white text-sm font-medium mb-3">
        {plan.price}
        <span className="text-[#828282] font-normal">{plan.period}</span>
      </p>
      <ul className="space-y-1.5">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-[#a7a7a7]">
            <Check className="w-3 h-3 text-[#1ED760] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  PREMIUM MODAL (centered overlay, multi-step)                       */
/* ------------------------------------------------------------------ */

function PremiumModal({ level, onAdvance, onClose }) {
  const [visible, setVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [level]);

  useEffect(() => {
    if (level === 3) {
      const t = setTimeout(() => onAdvance(4), 1400);
      return () => clearTimeout(t);
    }
  }, [level]);

  const backdropClass = `fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
    visible ? "opacity-100" : "opacity-0"
  }`;

  const cardBase = `bg-[#121212] border border-[#262626] rounded-2xl w-full transition-all duration-200 ${
    visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
  }`;

  /* ---------------- LEVEL 1: plan picker ---------------- */
  if (level === 1) {
    return (
      <div className={backdropClass}>
        <div className={`${cardBase} max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto`}>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#828282] hover:text-white hover:bg-[#1f1f1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#1ED760] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[#1ED760] text-xs font-semibold uppercase tracking-wide">
                Calculator Pro
              </p>
              <h2 className="text-white text-xl font-bold">
                Lihat hasil kalkulasi
              </h2>
            </div>
          </div>
          <p className="text-sm text-[#a7a7a7] mb-6 max-w-md">
            Hasil dari operasi yang kamu masukkan tidak termasuk dalam paket
            gratis. Pilih paket di bawah untuk melanjutkan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan.id === plan.id}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>

          <button
            onClick={() => onAdvance(2)}
            className="w-full py-3 rounded-xl bg-[#1ED760] text-black font-bold text-sm hover:bg-[#1fdf64] transition-colors flex items-center justify-center gap-2"
          >
            Lanjutkan dengan {selectedPlan.name}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- LEVEL 2: ringkasan tagihan ---------------- */
  if (level === 2) {
    return (
      <div className={backdropClass}>
        <div className={`${cardBase} max-w-md p-8 relative`}>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#828282] hover:text-white hover:bg-[#1f1f1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            onClick={() => onAdvance(1)}
            className="flex items-center gap-1 text-[#828282] text-xs mb-6 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke pilihan paket
          </button>

          <h2 className="text-white text-xl font-bold mb-2">Hampir selesai</h2>
          <p className="text-sm text-[#a7a7a7] mb-6">
            Paket {selectedPlan.name} mencakup operasi dasar. Untuk operasi
            yang kamu masukkan (dua angka), dibutuhkan add-on tambahan.
          </p>

          <div className="rounded-xl bg-[#161616] border border-[#262626] p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-sm font-medium">
                {selectedPlan.name} Plan
              </span>
              <span className="text-white text-sm">{selectedPlan.price}</span>
            </div>
            <div className="h-px bg-[#262626] my-3" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">
                  Multi-Number Add-on
                </p>
                <p className="text-[#828282] text-xs">
                  Wajib untuk operasi dua angka atau lebih
                </p>
              </div>
              <span className="text-white text-sm">Rp 25.000</span>
            </div>
          </div>

          <button
            onClick={() => onAdvance(3)}
            className="w-full py-3 rounded-xl bg-[#1ED760] text-black font-bold text-sm hover:bg-[#1fdf64] transition-colors mb-3"
          >
            Konfirmasi & lanjutkan
          </button>
          <p className="text-center text-[#6a6a6a] text-xs">
            Pembayaran diproses ulang setiap kali kamu menekan tombol
            sama-dengan
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- LEVEL 3: loading / processing ---------------- */
  if (level === 3) {
    return (
      <div className={backdropClass}>
        <div className={`${cardBase} max-w-sm p-10 text-center`}>
          <div className="w-10 h-10 border-2 border-[#262626] border-t-[#1ED760] rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-white text-base font-semibold mb-2">
            Menyiapkan hasil kamu
          </h2>
          <p className="text-[#828282] text-sm">
            Mohon tunggu, sedang memverifikasi langganan...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- LEVEL 4: reveal ---------------- */
  if (level === 4) {
    return (
      <div className={backdropClass}>
        <div className={`${cardBase} max-w-sm p-8 relative text-center`}>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#828282] hover:text-white hover:bg-[#1f1f1f] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-[#1ED760] flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-black" strokeWidth={3} />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Just kidding.</h2>
          <p className="text-[#a7a7a7] text-sm mb-6">
            Hasilnya gratis kok. Ini dia.
          </p>
          <button
            onClick={() => onAdvance(5)}
            className="w-full py-3 rounded-xl bg-[#1ED760] text-black font-bold text-sm hover:bg-[#1fdf64] transition-colors"
          >
            Tampilkan hasil
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                            */
/* ------------------------------------------------------------------ */

export default function PremiumCalculatorPro() {
  const [expression, setExpression] = useState("");
  const [value, setValue] = useState("0");
  const [modalLevel, setModalLevel] = useState(0);
  const [pendingResult, setPendingResult] = useState(null);

  const formatResult = (result) => {
    if (typeof result === "number") {
      if (!isFinite(result)) return "Error";
      const rounded = Math.round(result * 1e8) / 1e8;
      return rounded.toString();
    }
    return String(result);
  };

  const handleKey = (key) => {
    if (modalLevel > 0) return;

    if (key === "C") {
      setExpression("");
      setValue("0");
      setPendingResult(null);
      return;
    }

    if (key === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "=") {
      if (!expression) return;
      try {
        const sanitized = expression.replace(/%/g, "/100");
        const result = evaluate(sanitized);
        setPendingResult(formatResult(result));
        setModalLevel(1);
      } catch {
        setPendingResult("Error");
        setModalLevel(1);
      }
      return;
    }

    const operators = ["+", "-", "*", "/", "%"];
    setExpression((prev) => {
      if (prev === "" && operators.includes(key) && key !== "-") {
        return prev;
      }
      const last = prev[prev.length - 1];
      if (operators.includes(last) && operators.includes(key)) {
        return prev.slice(0, -1) + key;
      }
      return prev + key;
    });
  };

  const handleAdvance = (nextLevel) => {
    if (nextLevel === 5) {
      setValue(pendingResult ?? "0");
      setExpression((prev) => prev + " =");
      setModalLevel(0);
      setPendingResult(null);
      return;
    }
    setModalLevel(nextLevel);
  };

  const handleClose = () => setModalLevel(0);

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0a]">
      <Sidebar onUpgradeClick={() => setModalLevel(1)} />

      <main className="flex-1 flex flex-col">
        {/* topbar */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-[#1f1f1f]">
          <div>
            <h1 className="text-white text-lg font-bold">Calculator</h1>
            <p className="text-[#828282] text-xs mt-0.5">
              Kalkulator standar dengan hasil premium
            </p>
          </div>
          <button
            onClick={() => setModalLevel(1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-[#1ED760] text-black px-4 py-2.5 rounded-full hover:bg-[#1fdf64] transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade to Pro
          </button>
        </header>

        {/* content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Display expression={expression} value={value} />
            <Keypad onKey={handleKey} />

            <div className="mt-6 flex items-center gap-2 text-xs text-[#6a6a6a]">
              <Lock className="w-3.5 h-3.5" />
              Nikmati Layanan Kami. Syarat & ketentuan berlaku.
            </div>
          </div>
        </div>
      </main>

      {modalLevel > 0 && (
        <PremiumModal
          level={modalLevel}
          onAdvance={handleAdvance}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
