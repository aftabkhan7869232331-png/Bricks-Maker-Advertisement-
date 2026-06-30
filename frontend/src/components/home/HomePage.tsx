import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Layers,
  Pause,
  Play,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
  Wand2
} from "lucide-react";
import type { Campaign } from "../../types";
import { useHomePage, type HomeProjectItem, type HomeProjectTab } from "../../hooks/useHomePage";

interface HomePageProps {
  campaigns: Campaign[];
  onSelectCampaign: (camp: Campaign) => void;
  onNavigateToCreate: () => void;
  onToggleStatus: (id: string) => void;
}

const categoryIcons = {
  BarChart3,
  BookOpen,
  Briefcase,
  CreditCard,
  Image: ImageIcon,
  Layers,
  Shield: ShieldCheck,
  Sparkles
};

const tabs: { id: HomeProjectTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "live", label: "Live" },
  { id: "prebuilt", label: "Prebuilt" }
];

function ProjectCard({
  project,
  onSelectCampaign,
  onNavigateToCreate,
  onToggleStatus
}: {
  project: HomeProjectItem;
  onSelectCampaign: (camp: Campaign) => void;
  onNavigateToCreate: () => void;
  onToggleStatus: (id: string) => void;
}) {
  const isActive = project.status.toLowerCase() === "active";

  return (
    <article className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary-color)]/45 hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] text-[var(--primary-color)]">
          {project.isPrebuilt ? <FileText size={20} /> : <ImageIcon size={20} />}
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"}`}>
          {project.isPrebuilt ? "Template" : project.status}
        </span>
      </div>

      <h3 className="line-clamp-1 text-lg font-black text-[var(--text-body)]">{project.title}</h3>
      <p className="mt-2 line-clamp-2 min-h-[44px] text-sm leading-6 text-[var(--text-muted)]">{project.description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--border-soft)] pt-4 text-xs">
        <span className="font-bold uppercase tracking-widest text-[var(--text-subtle)]">{project.impressions} views</span>
        {project.rawCampaign ? (
          <div className="flex items-center gap-3">
            <button onClick={() => onToggleStatus(project.rawCampaign!.id)} className="inline-flex items-center gap-1.5 font-bold text-[var(--primary-color)]">
              {isActive ? <Pause size={13} /> : <Play size={13} />}
              {isActive ? "Pause" : "Activate"}
            </button>
            <button onClick={() => onSelectCampaign(project.rawCampaign!)} className="font-bold text-[var(--text-muted)] hover:text-[var(--primary-color)]">
              Edit
            </button>
          </div>
        ) : (
          <button onClick={onNavigateToCreate} className="inline-flex items-center gap-1.5 font-bold text-[var(--primary-color)]">
            Use <ArrowRight size={13} />
          </button>
        )}
      </div>
    </article>
  );
}

export function HomePage({ campaigns, onSelectCampaign, onNavigateToCreate, onToggleStatus }: HomePageProps) {
  const home = useHomePage(campaigns);

  return (
    <div
      className="relative space-y-20 overflow-hidden text-[var(--text-body)]"
      onMouseMove={home.handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(700px circle at ${home.mousePos.x}px ${home.mousePos.y}px, rgba(248, 180, 0, 0.05), transparent 78%)`
        }}
      />

      <section className="relative grid grid-cols-1 items-center gap-10 pt-8 lg:grid-cols-12">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--bg-panel)]/70 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-color)]">
            <Sparkles size={13} />
            Version 4.0 Platform Release
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] text-[var(--text-body)] sm:text-6xl lg:text-7xl">
            Build Your Brand.
            <span className="block text-gradient-shimmer">Create Without Limits.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--text-muted)]">
            Everything you need to create professional marketing materials, promotional videos, business designs, branding assets, and campaign content in one workspace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onNavigateToCreate} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              <Plus size={17} />
              Start Creating
            </button>
            <button
              onClick={() => document.getElementById("home-projects-section")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-ghost inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
            >
              Explore Templates
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Active", home.stats.activeCampaigns],
              ["Impressions", home.stats.impressions],
              ["Clicks", home.stats.clicks],
              ["Tool Kits", home.stats.templateCount]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-4">
                <div className="text-xl font-black text-[var(--text-body)]">{value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[var(--text-subtle)]">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="relative mx-auto flex aspect-square max-w-[430px] flex-col justify-between overflow-hidden rounded-[18px] border border-[var(--border-soft)] bg-[linear-gradient(145deg,var(--bg-panel),var(--bg-surface))] p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--primary-color)]">Design Studio Core</span>
              <Wand2 size={18} className="text-[var(--primary-color)]" />
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full border border-dashed border-[var(--primary-color)]/20 animate-spin" style={{ animationDuration: "14s" }} />
              <div className="absolute h-32 w-32 rounded-full border border-[var(--primary-color)]/15 animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
              <div className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-2xl border border-[var(--primary-color)]/25 bg-[var(--bg-elevated)] shadow-[0_0_35px_var(--accent-glow)]">
                <Layers size={26} className="text-[var(--primary-color)]" />
                <span className="mt-2 text-[9px] font-black uppercase tracking-wider">Brick-Maker</span>
              </div>
              {["Branding", "Marketing", "Growth", "Creative"].map((label, index) => (
                <span
                  key={label}
                  className="absolute rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)]"
                  style={[
                    { top: 22, left: 8 },
                    { top: 76, right: 0 },
                    { bottom: 54, right: 12 },
                    { bottom: 84, left: 0 }
                  ][index]}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Copy", icon: FileText },
                { label: "Visual", icon: ImageIcon },
                { label: "Video", icon: Video }
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-3 text-center">
                  <item.icon className="mx-auto text-[var(--primary-color)]" size={17} />
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative overflow-hidden border-y border-[var(--border-soft)] py-5">
        <div className="marquee-track gap-4">
          {[...home.clientLogos, ...home.clientLogos].map((client, index) => (
            <div key={`${client.name}-${index}`} className="min-w-56 rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] px-5 py-3">
              <div className="text-xs font-black uppercase tracking-widest text-[var(--text-body)]">{client.name}</div>
              <div className="mt-1 text-[10px] text-[var(--text-subtle)]">{client.slogan}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="popular-categories-section" className="relative">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-color)]">Template tools</div>
            <h2 className="mt-2 text-3xl font-black text-[var(--text-body)]">Popular Categories</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {home.popularCategories.map((category) => {
            const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || FileText;
            return (
              <button key={category.name} onClick={onNavigateToCreate} className="card-hover rounded-lg border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-5 text-left">
                <Icon className="text-[var(--primary-color)]" size={22} />
                <div className="mt-5 text-base font-black text-[var(--text-body)]">{category.name}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--text-subtle)]">{category.count}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section id="home-projects-section" className="relative">
        <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-color)]">Project workspace</div>
            <h2 className="mt-2 text-3xl font-black text-[var(--text-body)]">Recent Projects</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" size={15} />
              <input
                value={home.searchQuery}
                onChange={(event) => home.setSearchQuery(event.target.value)}
                placeholder="Search projects"
                className="input-dark w-full min-w-64 pl-9"
              />
            </label>
            <div className="flex rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => home.setActiveTab(tab.id)}
                  className={`rounded-md px-4 py-2 text-xs font-black uppercase tracking-widest transition ${home.activeTab === tab.id ? "bg-[var(--primary-color)] text-[var(--btn-text)]" : "text-[var(--text-muted)] hover:text-[var(--text-body)]"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {home.filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onNavigateToCreate={onNavigateToCreate}
              onSelectCampaign={onSelectCampaign}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      </section>

      <section className="relative grid grid-cols-1 gap-4 lg:grid-cols-4">
        {home.whyChooseItems.map((item) => (
          <div key={item.title} className="rounded-lg border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5">
            <div className="inline-flex rounded-full bg-[var(--primary-color)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--primary-color)]">
              {item.badge}
            </div>
            <h3 className="mt-4 text-lg font-black text-[var(--text-body)]">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="relative rounded-[18px] border border-[var(--border-soft)] bg-[linear-gradient(135deg,var(--navbar-active-bg),var(--bg-panel),var(--accent-glow))] p-8 sm:p-10">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--primary-color)]">
              <CheckCircle2 size={15} />
              Home tool created
            </div>
            <h2 className="mt-3 text-3xl font-black text-[var(--text-body)] sm:text-4xl">Create a campaign without restarting the app.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
              The home page is now isolated as a reusable component with a dedicated hook, so edits stay cleaner and easier to debug.
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <button onClick={onNavigateToCreate} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              Open Studio
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
