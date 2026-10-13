"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Search,
  ShoppingBag,
  Store,
  ChefHat,
  Bike,
  TrendingUp,
  Clock,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Info,
  HelpCircle,
  Sliders,
  RotateCcw,
  X,
  LayoutDashboard,
  CheckSquare,
  Activity,
  Zap,
  ChevronRight
} from "lucide-react";

import {
  MODULES_DATA,
  DocModule,
  SubSection,
  ContainerDetail,
  FieldDetail,
  ModuleKey
} from "./manualData";

// Mapeo dinámico de íconos de módulos
const ICON_MAP: Record<string, React.ElementType> = {
  ShoppingBag,
  Store,
  ChefHat,
  Bike,
  TrendingUp,
  Clock,
  Layers,
};

export default function ManualDeUsoPage() {
  const [activeModule, setActiveModule] = useState<ModuleKey>("todos");
  const [activeSection, setActiveSection] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Módulo actualmente seleccionado (si no es 'todos')
  const activeModObj = useMemo(() => {
    if (activeModule === "todos") return null;
    return MODULES_DATA.find((m) => m.id === activeModule) || null;
  }, [activeModule]);

  // Manejo de cambio de módulo: reinicia sub-sección a 'todas'
  const handleSelectModule = (modId: ModuleKey) => {
    setActiveModule(modId);
    setActiveSection("todas");
  };

  // Filtrado reactivo por texto, módulo y subsección
  const filteredModules = useMemo(() => {
    return MODULES_DATA.filter((mod) => {
      // Filtro por pestaña de sector
      if (activeModule !== "todos" && mod.id !== activeModule) return false;

      // Filtro por sub-sección seleccionada
      if (activeModule !== "todos" && activeSection !== "todas") {
        const hasSection = mod.sections.some((s) => s.title === activeSection);
        if (!hasSection) return false;
      }

      // Filtro por búsqueda de texto
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchTitle =
        mod.title.toLowerCase().includes(q) ||
        mod.shortTitle.toLowerCase().includes(q);
      const matchSummary = mod.summary.toLowerCase().includes(q);
      const matchRole = mod.roleBadge.toLowerCase().includes(q);

      const matchSections = mod.sections.some(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.shortTitle && s.shortTitle.toLowerCase().includes(q)) ||
          (s.badge && s.badge.toLowerCase().includes(q)) ||
          s.description.toLowerCase().includes(q) ||
          s.containers?.some(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.purpose.toLowerCase().includes(q) ||
              c.metricsOrDataShown.some((m) => m.toLowerCase().includes(q)) ||
              c.controlsOrButtons?.some((b) => b.toLowerCase().includes(q)) ||
              (c.interpretationTip &&
                c.interpretationTip.toLowerCase().includes(q))
          ) ||
          s.fieldsAndCheckboxes?.some(
            (f) =>
              f.name.toLowerCase().includes(q) ||
              f.description.toLowerCase().includes(q) ||
              f.effect.toLowerCase().includes(q) ||
              (f.exampleOrOptions &&
                f.exampleOrOptions.toLowerCase().includes(q))
          ) ||
          s.buttonsAndControls?.some(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
          ) ||
          s.steps?.some((st) => st.toLowerCase().includes(q)) ||
          s.tips?.some((t) => t.toLowerCase().includes(q))
      );

      return matchTitle || matchSummary || matchRole || matchSections;
    });
  }, [activeModule, activeSection, searchQuery]);

  const copyManualUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getFieldTypeBadge = (type: FieldDetail["type"]) => {
    switch (type) {
      case "checkbox":
        return {
          label: "Casilla [✓]",
          color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        };
      case "number":
        return {
          label: "Número / Precio",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "select":
        return {
          label: "Selector",
          color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        };
      case "text":
        return {
          label: "Texto",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "button":
        return {
          label: "Botón",
          color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        };
      case "file":
        return {
          label: "Archivo / Imagen",
          color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        };
      case "kpi":
        return {
          label: "Métrica KPI",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        };
      default:
        return {
          label: type,
          color: "bg-zinc-800 text-zinc-400 border-zinc-700",
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* ── Top Bar / Header ── */}
      <header className="sticky top-0 z-50 bg-[#0c0c10]/90 backdrop-blur-xl border-b border-zinc-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="relative w-8 h-8 rounded-xl overflow-hidden border border-zinc-700/60 shadow-md">
              <Image
                src="/logo.jpg"
                alt="Logo Quadra"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-sm tracking-tight text-white group-hover:text-orange-400 transition-colors">
                Quadra <span className="text-orange-500">Pizza</span>
              </span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                ERP Manual Exhaustivo
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-block w-px h-5 bg-zinc-800" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={11} /> Documentación Integral 100%
          </span>
        </div>

        {/* Acciones directas */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyManualUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold rounded-xl border border-zinc-800 transition active:scale-95"
            title="Copiar enlace del manual"
          >
            {copiedLink ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            <span className="hidden md:inline">
              {copiedLink ? "¡Copiado!" : "Compartir Manual"}
            </span>
          </button>

          <Link
            href="/recepcion"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded-xl transition shadow-lg shadow-orange-950/40 active:scale-95"
          >
            <span>Ir al ERP</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-[#070709] px-4 sm:px-8 py-10 sm:py-14">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-orange-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-bold">
            <BookOpen size={14} className="text-orange-400" />
            Manual de Operaciones y Referencia del Sistema al Detalle
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Manual Integral de Uso{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
              Quadra Pizza ERP
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Explicación exhaustiva milímetro a milímetro: cada sector, cada pantalla,
            cada contenedor con sus métricas e interpretación, cada formulario campo
            por campo y cada casilla de verificación [✓] con su impacto exacto en el
            sistema.
          </p>

          {/* Buscador Central */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div className="relative group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-400 transition-colors"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar campo, check, container o función (ej: 'margen bruto', 'recargo 15%', 'bypass cocina', 'punto de equilibrio')..."
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium text-zinc-100 placeholder:text-zinc-500 outline-none focus:border-orange-500/80 focus:ring-4 focus:ring-orange-500/10 shadow-2xl transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Navegación Principal y Sub-Botones de Páginas ── */}
      <div className="sticky top-[57px] z-40 bg-[#070709]/95 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3 space-y-2.5">
        {/* Fila 1: Botones Principales de Sectores */}
        <div className="max-w-6xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleSelectModule("todos")}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              activeModule === "todos"
                ? "bg-zinc-100 text-zinc-950 border-white shadow-sm"
                : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            <Layers size={13} />
            <span>Todos</span>
          </button>

          {MODULES_DATA.map((mod) => {
            const Icon = ICON_MAP[mod.iconName] || Layers;
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(mod.id)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  isActive
                    ? `${mod.roleColor.bg} ${mod.roleColor.text} ${mod.roleColor.border} shadow-md`
                    : "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <Icon size={14} />
                <span>{mod.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Fila 2: Sub-Botones de Páginas Específicas del Sector Activo */}
        {activeModObj && (
          <div className="max-w-6xl mx-auto pt-2 border-t border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 shrink-0 flex items-center gap-1 mr-1">
              <ChevronRight size={12} className="text-orange-500" />
              Páginas de {activeModObj.shortTitle}:
            </span>

            {/* Botón para ver todas las páginas del módulo */}
            <button
              onClick={() => setActiveSection("todas")}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                activeSection === "todas"
                  ? "bg-zinc-100 text-zinc-950 border-white shadow-sm"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
            >
              Todas ({activeModObj.sections.length})
            </button>

            {/* Sub-botones para cada página/sección individual */}
            {activeModObj.sections.map((sec, idx) => {
              const isSecActive = activeSection === sec.title;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSection(sec.title)}
                  className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                    isSecActive
                      ? `${activeModObj.roleColor.bg} ${activeModObj.roleColor.text} ${activeModObj.roleColor.border} shadow-sm ring-1 ring-orange-500/30`
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSecActive ? "bg-orange-400" : "bg-zinc-600"
                    }`}
                  />
                  <span>{sec.shortTitle || sec.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Contenido Principal ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-12">
        {filteredModules.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 space-y-3">
            <HelpCircle size={40} className="mx-auto text-zinc-600" />
            <h3 className="text-lg font-black text-zinc-200">
              No se encontraron coincidencias para &quot;{searchQuery}&quot;
            </h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              Probá con otras palabras clave como &quot;check&quot;, &quot;cocina&quot;,
              &quot;recargo&quot;, &quot;stock&quot;, &quot;finanzas&quot; o restablecé la búsqueda.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveModule("todos");
                setActiveSection("todas");
              }}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-white transition"
            >
              <RotateCcw size={13} />
              Restablecer búsqueda
            </button>
          </div>
        ) : (
          filteredModules.map((mod) => {
            const Icon = ICON_MAP[mod.iconName] || Layers;

            // Filtro de secciones: si se seleccionó una subsección específica, se muestra solo esa
            const sectionsToDisplay =
              activeModule === mod.id && activeSection !== "todas"
                ? mod.sections.filter((s) => s.title === activeSection)
                : mod.sections;

            return (
              <section
                key={mod.id}
                id={mod.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl transition hover:border-zinc-700/80"
              >
                {/* ── Header del Módulo ── */}
                <div
                  className={`p-6 sm:p-8 border-b border-zinc-800/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden`}
                >
                  <div
                    className={`absolute -right-10 -bottom-10 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none`}
                    style={{ backgroundColor: mod.roleColor.accent }}
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${mod.roleColor.bg} ${mod.roleColor.text} border ${mod.roleColor.border} shadow-sm`}
                        >
                          <Icon size={18} />
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${mod.roleColor.bg} ${mod.roleColor.text} ${mod.roleColor.border}`}
                        >
                          {mod.roleBadge}
                        </span>
                        {mod.route !== "#" && (
                          <span className="font-mono text-[11px] text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-800">
                            {mod.displayRoute || mod.route}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {mod.title}
                      </h2>
                      <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
                        {mod.summary}
                      </p>
                    </div>

                    {mod.route !== "#" && (
                      <Link
                        href={mod.route}
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold rounded-xl border border-zinc-700/80 transition active:scale-95 shadow-sm"
                      >
                        <span>Abrir Sector</span>
                        <ExternalLink size={13} />
                      </Link>
                    )}
                  </div>
                </div>

                {/* ── Subsecciones / Pantallas ── */}
                <div className="p-6 sm:p-8 space-y-10">
                  {/* Banner de página activa cuando hay sub-sección seleccionada */}
                  {activeModule === mod.id && activeSection !== "todas" && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-orange-500/10 border border-orange-500/25 rounded-2xl">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
                        <div className="text-xs text-zinc-300">
                          <span className="text-orange-400 font-black uppercase tracking-wider text-[10px] block">
                            Página Seleccionada:
                          </span>
                          <span className="text-white font-bold text-sm">
                            {sectionsToDisplay[0]?.title || activeSection}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveSection("todas")}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-orange-400 hover:text-orange-300 text-xs font-bold rounded-xl border border-orange-500/30 transition shadow-sm active:scale-95 shrink-0"
                      >
                        <RotateCcw size={12} />
                        <span>Ver todas las páginas de {mod.shortTitle}</span>
                      </button>
                    </div>
                  )}

                  {sectionsToDisplay.map((sec, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-zinc-950/70 border border-zinc-800/70 rounded-2xl p-5 sm:p-7 space-y-6"
                    >
                      {/* Título de la subsección */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/70 pb-4">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-lg sm:text-xl font-black text-zinc-100 tracking-tight">
                            {sec.title}
                          </h3>
                          {sec.badge && (
                            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-md">
                              {sec.badge}
                            </span>
                          )}
                        </div>

                        {sec.route && sec.route !== "#" && (
                          <Link
                            href={sec.route}
                            className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold"
                          >
                            <span>Ir a {sec.badge || "la pantalla"}</span>
                            <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>

                      <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        {sec.description}
                      </p>

                      {/* ── CONTAINERS Y COMPONENTES EXPLICADOS UNO POR UNO ── */}
                      {sec.containers && sec.containers.length > 0 && (
                        <div className="space-y-3 pt-2">
                          <p className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                            <LayoutDashboard size={14} className="text-orange-400" />
                            Containers y Paneles de Información (Uno por Uno):
                          </p>

                          <div className="grid grid-cols-1 gap-4">
                            {sec.containers.map((cont, cIdx) => (
                              <div
                                key={cIdx}
                                className="p-4 sm:p-5 bg-zinc-900/90 border border-zinc-800/90 rounded-xl space-y-3 hover:border-zinc-700 transition"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-2.5">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                                    <h4 className="font-black text-sm sm:text-base text-white">
                                      {cont.name}
                                    </h4>
                                  </div>
                                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                    Propósito: {cont.purpose}
                                  </span>
                                </div>

                                {/* Datos y métricas mostradas */}
                                <div className="space-y-1.5">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                    <Activity size={12} className="text-sky-400" />
                                    Datos y Métricas que Muestra:
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {cont.metricsOrDataShown.map((metric, mIdx) => (
                                      <div
                                        key={mIdx}
                                        className="p-2 bg-zinc-950/80 border border-zinc-800/60 rounded-lg text-xs text-zinc-300 flex items-start gap-2"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                                        <span className="leading-snug">{metric}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Botones y controles en este container si existen */}
                                {cont.controlsOrButtons &&
                                  cont.controlsOrButtons.length > 0 && (
                                    <div className="space-y-1.5 pt-1">
                                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                        <Sliders size={12} className="text-amber-400" />
                                        Acciones y Controles Disponibles:
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {cont.controlsOrButtons.map((btn, bIdx) => (
                                          <span
                                            key={bIdx}
                                            className="text-xs bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-1 rounded-md"
                                          >
                                            {btn}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {/* Tip de interpretación */}
                                {cont.interpretationTip && (
                                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                                    <HelpCircle
                                      size={14}
                                      className="text-amber-400 shrink-0 mt-0.5"
                                    />
                                    <span>
                                      <strong>Interpretación Clave:</strong>{" "}
                                      {cont.interpretationTip}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── DETALLE CAMPO POR CAMPO Y CHECK POR CHECK ── */}
                      {sec.fieldsAndCheckboxes &&
                        sec.fieldsAndCheckboxes.length > 0 && (
                          <div className="space-y-3 pt-3">
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                              <CheckSquare size={14} className="text-orange-400" />
                              Guía Campo por Campo y Check por Check [✓]:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {sec.fieldsAndCheckboxes.map((field, fIdx) => {
                                const typeBadge = getFieldTypeBadge(field.type);
                                return (
                                  <div
                                    key={fIdx}
                                    className="p-4 bg-zinc-900/90 border border-zinc-800/80 rounded-xl space-y-2.5 hover:border-zinc-700 transition"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-bold text-xs sm:text-sm text-white">
                                        {field.name}
                                      </span>
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <span
                                          className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${typeBadge.color}`}
                                        >
                                          {typeBadge.label}
                                        </span>
                                        {field.required ? (
                                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                                            Requerido
                                          </span>
                                        ) : (
                                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                            Opcional
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                      {field.description}
                                    </p>

                                    {/* Ejemplo u Opciones */}
                                    {field.exampleOrOptions && (
                                      <div className="p-2 bg-zinc-950/70 border border-zinc-800/60 rounded-md text-[11px] font-mono text-zinc-400">
                                        <strong className="text-zinc-500 font-sans uppercase">
                                          Ejemplo / Opciones:
                                        </strong>{" "}
                                        {field.exampleOrOptions}
                                      </div>
                                    )}

                                    {/* Efecto en el Sistema */}
                                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs text-emerald-300 flex items-start gap-1.5">
                                      <Zap
                                        size={13}
                                        className="text-emerald-400 shrink-0 mt-0.5"
                                      />
                                      <span>
                                        <strong>Efecto en el Sistema:</strong>{" "}
                                        {field.effect}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      {/* ── SECUENCIA OPERATIVA PASO A PASO ── */}
                      {sec.steps && sec.steps.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <p className="text-xs font-black uppercase tracking-wider text-zinc-400">
                            Secuencia Operativa Paso a Paso:
                          </p>
                          <div className="space-y-2">
                            {sec.steps.map((st, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-3 p-3 bg-zinc-900/60 border border-zinc-800/70 rounded-xl text-xs sm:text-sm text-zinc-300"
                              >
                                <span className="w-5 h-5 rounded-full bg-zinc-800 text-orange-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="leading-snug">{st}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ── BOTONES Y CONTROLES CLAVE ── */}
                      {sec.buttonsAndControls &&
                        sec.buttonsAndControls.length > 0 && (
                          <div className="space-y-3 pt-2">
                            <p className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                              <Sliders size={13} className="text-orange-400" />
                              Botones y Controles Principales:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {sec.buttonsAndControls.map((ctrl, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="p-3.5 bg-zinc-900 border border-zinc-800/80 rounded-xl flex flex-col justify-between gap-1.5 hover:border-zinc-700 transition"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                      {ctrl.name}
                                    </span>
                                    {ctrl.type === "alert" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 shrink-0">
                                        Importante
                                      </span>
                                    )}
                                    {ctrl.type === "action" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                                        Acción
                                      </span>
                                    )}
                                    {ctrl.type === "info" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                        Dato
                                      </span>
                                    )}
                                    {ctrl.type === "nav" && (
                                      <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                                        Navegación
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-zinc-400 leading-relaxed">
                                    {ctrl.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* ── TIPS Y ALERTAS ── */}
                      {sec.tips && sec.tips.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-1.5">
                          {sec.tips.map((t, tIdx) => (
                            <div
                              key={tIdx}
                              className="flex items-start gap-2.5 text-xs text-orange-200"
                            >
                              <Info
                                size={15}
                                className="text-orange-400 shrink-0 mt-0.5"
                              />
                              <span className="leading-snug">{t}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2">
        <p className="font-bold text-zinc-400">
          Quadra Pizza ERP — Sistema de Gestión Gastronómica Integral
        </p>
        <p>
          Este manual se actualiza en conjunto con todas las versiones y módulos del
          sistema.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Catálogo Online
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/recepcion"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Recepción
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/cocina"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Cocina
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/delivery"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Delivery
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/gerencia"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Gerencia
          </Link>
          <span className="text-zinc-700">•</span>
          <Link
            href="/estado-pedido"
            className="text-orange-400 hover:text-orange-300 font-bold"
          >
            Tracking en Vivo
          </Link>
        </div>
      </footer>
    </div>
  );
}
