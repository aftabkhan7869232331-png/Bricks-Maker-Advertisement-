import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Folder, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  Plus, 
  Trash2, 
  Star, 
  Clock, 
  FileDown, 
  Share2, 
  RefreshCw, 
  Search, 
  Filter, 
  AlertCircle, 
  ChevronRight, 
  Activity, 
  Bookmark, 
  Briefcase, 
  Layers, 
  HelpCircle,
  FileSpreadsheet,
  Calendar,
  Layers2,
  Zap,
  Check,
  X
} from "lucide-react";
import { ProjectAsset } from "../types";
import { Project } from "../types/Project";
import { getProjectsFromDb, saveProjectToDb, deleteProjectFromDb } from "../firebase";

const THEMES = [
  { name: "Brick Gold", primary: "#F8B400", secondary: "#FF9800", bg: "bg-[#141208]/80", border: "border-[#F8B400]/25", text: "text-[#FDFBF7]" },
  { name: "Midnight Black", primary: "#E4E4E7", secondary: "#A1A1AA", bg: "bg-zinc-900/80", border: "border-zinc-800", text: "text-zinc-100" },
  { name: "Royal Purple", primary: "#A855F7", secondary: "#EC4899", bg: "bg-[#130E1A]/80", border: "border-[#A855F7]/25", text: "text-[#FAF5FF]" },
  { name: "Ocean Blue", primary: "#38BDF8", secondary: "#0369A1", bg: "bg-[#09111F]/80", border: "border-[#38BDF8]/25", text: "text-sky-50" },
  { name: "Emerald Green", primary: "#34D399", secondary: "#059669", bg: "bg-[#091F17]/80", border: "border-[#34D399]/25", text: "text-emerald-50" }
] as const;

const CATEGORIES = [
  "Restaurant",
  "School",
  "Healthcare",
  "Corporate",
  "Real Estate",
  "Retail",
  "Travel",
  "Festival",
  "Events",
  "Education",
  "Startup",
  "Custom"
] as const;

const PROJECT_TYPES = [
  "Pamphlet",
  "Flyer",
  "Brochure",
  "Business Card",
  "Poster",
  "Banner",
  "Social Media",
  "Video",
  "Brand Identity",
  "Marketing Campaign"
] as const;

const OUTPUT_FORMATS = [
  "PDF",
  "PNG",
  "JPG",
  "Print Ready",
  "Web Ready"
] as const;

const BLANK_PROJECT: Omit<Project, "id" | "createdAt"> = {
  name: "",
  description: "",
  category: "Restaurant",
  projectType: "Flyer",
  priority: "Medium",
  language: "English",
  theme: "Brick Gold",
  targetAudience: "",
  deadline: "",
  outputFormat: "Print Ready",
  status: "Not Started",
  isPinned: false,
  assets: [] as ProjectAsset[]
};

const SAMPLE_BRIEF_EXAMPLE = `Business Name:
Royal Spice Restaurant

Project Goal:
Create a premium promotional campaign for our restaurant.

Required Designs:
• Pamphlet
• Flyer
• Social Media Posts
• Restaurant Menu
• Business Banner

Target Audience:
Families and Young Professionals

Theme:
Luxury Black & Gold

Special Offer:
Flat 25% Discount

Deadline:
15 July

Additional Notes:
Use elegant typography, premium food photography, and modern business branding.`;

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Workspace Form States
  const [form, setForm] = useState(BLANK_PROJECT);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>("All");
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>("All");
  
  // Activities log
  const [activities, setActivities] = useState<Array<{ id: string; text: string; time: string; type: string }>>([
    { id: "act-1", text: "Platform initialized securely", time: "Just now", type: "system" },
    { id: "act-2", text: "Enterprise Workspace rules verified", time: "5 mins ago", type: "security" }
  ]);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load projects from database
  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjectsFromDb();
      setProjects(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load projects from cloud database", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Handle character counter and text area auto-expand
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  }, [form.description]);

  // Add activities helper
  const addActivity = (text: string, type: string = "info") => {
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    const newActivity = {
      id: `act-${Date.now()}`,
      text,
      time: timeFormatter.format(new Date()),
      type
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 14)]);
  };

  // Create or Update Project
  const handleSave = async (statusOverride?: "Not Started" | "In Progress" | "Completed" | "On Hold") => {
    if (!form.name.trim()) {
      showToast("Please provide a Project Name.", "error");
      return;
    }

    const projectId = editingId || `proj-${Date.now()}`;
    const projectStatus = statusOverride || form.status;

    const projectData: Project = {
      ...form,
      id: projectId,
      priority: form.priority,
      createdAt: editingId 
        ? (projects.find(p => p.id === editingId)?.createdAt || new Date().toISOString())
        : new Date().toISOString()
    };

    try {
      await saveProjectToDb(projectData);
      
      setProjects(prev => {
        const exists = prev.some(p => p.id === projectId);
        if (exists) {
          return prev.map(p => p.id === projectId ? projectData : p);
        }
        return [projectData, ...prev];
      });

      if (editingId) {
        addActivity(`Updated Project: ${form.name}`, "update");
        showToast("Project updated successfully in the cloud!", "success");
      } else {
        addActivity(`Created Project: ${form.name}`, "create");
        showToast("Project created successfully in the cloud!", "success");
      }

      // Reset form
      handleClearForm();
    } catch (err) {
      console.error(err);
      showToast("Failed to save project data to Firestore", "error");
    }
  };

  // Save Draft
  const handleSaveDraft = () => {
    handleSave("Not Started");
  };

  // Clear Form
  const handleClearForm = () => {
    setForm(BLANK_PROJECT);
    setEditingId(null);
  };

  // Delete Project
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteProjectFromDb(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      addActivity(`Deleted Project: ${name}`, "delete");
      showToast(`Project "${name}" deleted from cloud storage.`, "info");
      
      if (editingId === id) {
        handleClearForm();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete project", "error");
    }
  };

  // Toggle Favorite/Pinned state
  const handleTogglePin = async (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    const updatedProject = { ...project, isPinned: !project.isPinned };
    try {
      await saveProjectToDb(updatedProject);
      setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
      addActivity(`${updatedProject.isPinned ? "Pinned" : "Unpinned"} Project: ${project.name}`, "pin");
      showToast(`Project ${updatedProject.isPinned ? "pinned to favorites" : "removed from favorites"}`);
    } catch (err) {
      console.error(err);
      showToast("Failed to update favorite status", "error");
    }
  };

  // Load project into form for editing
  const handleSelectProject = (project: Project) => {
    setForm({
      name: project.name,
      description: project.description,
      category: project.category,
      projectType: project.projectType,
      priority: project.priority,
      language: project.language,
      theme: project.theme,
      targetAudience: project.targetAudience,
      deadline: project.deadline,
      outputFormat: project.outputFormat,
      status: project.status,
      isPinned: project.isPinned,
      assets: project.assets || []
    });
    setEditingId(project.id);
    addActivity(`Loaded brief workspace for: ${project.name}`, "load");
    showToast(`Loaded "${project.name}" details.`, "info");
  };

  // File drag & drop simulated uploading
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadedFiles(e.target.files);
    }
  };

  const handleUploadedFiles = (fileList: FileList) => {
    const newAssets: ProjectAsset[] = [];
    const today = new Date().toISOString().split("T")[0];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Format file size
      let sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      if (file.size < 1024 * 1024) {
        sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
      }

      newAssets.push({
        name: file.name,
        size: sizeStr,
        type: file.type || "application/octet-stream",
        uploadedAt: today
      });
    }

    setForm(prev => ({
      ...prev,
      assets: [...prev.assets, ...newAssets]
    }));

    addActivity(`Simulated files upload: ${newAssets.map(a => a.name).join(", ")}`, "upload");
    showToast(`Successfully uploaded ${newAssets.length} brand assets!`);
  };

  const handleRemoveAsset = (idx: number) => {
    const removedName = form.assets[idx].name;
    setForm(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== idx)
    }));
    addActivity(`Removed asset: ${removedName}`, "remove");
    showToast("Brand asset removed.");
  };

  // Auto-fill prompt example
  const handleAutoFillExample = () => {
    setForm({
      name: "Royal Spice Restaurant Launch",
      description: SAMPLE_BRIEF_EXAMPLE,
      category: "Restaurant",
      projectType: "Marketing Campaign",
      priority: "High",
      language: "English",
      theme: "Brick Gold",
      targetAudience: "Families and Young Professionals",
      deadline: "2026-07-15",
      outputFormat: "Print Ready",
      status: "In Progress",
      isPinned: true,
      assets: [
        { name: "royal_spice_logo.png", size: "1.2 MB", type: "image/png", uploadedAt: "2026-06-25" },
        { name: "menu_draft.docx", size: "410 KB", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", uploadedAt: "2026-06-25" }
      ]
    });
    addActivity("Applied prebuilt brief example", "system");
    showToast("Filled form with premium Restaurant Brief template!");
  };

  // Quick templates pre-filler
  const handleQuickTemplateSelect = (type: typeof PROJECT_TYPES[number]) => {
    setForm(prev => ({
      ...prev,
      name: `${prev.name || "Untitled"} (${type})`,
      projectType: type,
      description: `Business Name:\n[Enter Business Name]\n\nProject Goal:\nCreate a stunning ${type.toLowerCase()} for our upcoming launch.\n\nRequired Designs:\n• ${type}\n• Supporting media assets\n\nTarget Audience:\n[Define Audience]\n\nTheme / Vibe:\nElegant & Premium`,
      status: "Not Started"
    }));
    addActivity(`Applied Quick Template: ${type}`, "system");
    showToast(`Form updated with standard ${type} layout.`);
  };

  // Filtering list
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.projectType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedFilterCategory === "All" || p.category === selectedFilterCategory;
    const matchesStatus = selectedFilterStatus === "All" || p.status === selectedFilterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Count helper for progress metrics
  const countByStatus = (status: Project["status"]) => {
    return projects.filter(p => p.status === status).length;
  };

  const getPriorityBadgeColor = (priority: Project["priority"]) => {
    switch (priority) {
      case "High": return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Low": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  const getStatusBadgeColor = (status: Project["status"]) => {
    switch (status) {
      case "Not Started": return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/25";
      case "In Progress": return "bg-amber-500/10 text-[#F8B400] border border-[#F8B400]/25 animate-pulse";
      case "Completed": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
      case "On Hold": return "bg-red-500/10 text-red-400 border border-red-500/25";
    }
  };

  return (
    <div className="space-y-12 py-4">
      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none"
          >
            <div className="px-5 py-3.5 rounded-2xl bg-[#0E0E0E] border border-[var(--primary-color)]/40 text-xs font-bold text-gray-200 shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex items-center gap-3 max-w-sm backdrop-blur-xl">
              <div className={`w-2 h-2 rounded-full animate-ping ${
                toast.type === "error" ? "bg-red-500" : toast.type === "info" ? "bg-blue-400" : "bg-[#F8B400]"
              }`} />
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-gradient-to-r from-zinc-950/80 to-zinc-900/60 p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#F8B400]/5 via-transparent to-transparent opacity-60" />
        
        {/* Shimmer Glass Reflection Lines */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 bottom-0 w-[200px] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent transform -skew-x-12 translate-x-[-150%] animate-[lineLightSlide_6s_linear_infinite]" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-[#F8B400]/10 border border-[#F8B400]/20 text-[#F8B400] shadow-[0_0_15px_rgba(248,180,0,0.1)]">
                <Folder size={20} className="animate-pulse" />
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#F8B400]">
                Projects
              </h1>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Turn your business ideas into professional creative projects. Describe your campaign, upload your brand assets, organize project details, and start building from one premium workspace.
            </p>
          </div>
          
          <button
            onClick={handleAutoFillExample}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-[12px] border border-[#F8B400]/30 bg-[#F8B400]/5 text-[#F8B400] text-xs font-bold tracking-wide uppercase hover:bg-[#F8B400] hover:text-black hover:shadow-[0_0_20px_rgba(248,180,0,0.25)] transition-all duration-300 cursor-pointer"
          >
            <Sparkles size={14} />
            Quick Demo Brief
          </button>
        </div>
      </div>

      {/* ─── MAIN TWO COLUMN WORKSPACE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* ─── LEFT PANEL (65% -> 6 Columns) ─── */}
        <div className="lg:col-span-6 space-y-6">
          <div className="group relative rounded-[18px] border border-white/5 bg-zinc-950/70 p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-[#F8B400]/15 hover:shadow-[0_0_25px_rgba(248,180,0,0.03)]">
            
            {/* Corner visual tech aesthetic lines */}
            <div className="absolute top-0 left-0 w-8 h-[1px] bg-[#F8B400]/40" />
            <div className="absolute top-0 left-0 w-[1px] h-8 bg-[#F8B400]/40" />

            <div className="mb-6">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Layers size={18} className="text-[#F8B400]" />
                Describe Your Project
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Tell us about your business, campaign, promotion, or creative idea. Add all the important details to organize your project before starting the design process.
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              
              {/* Project Name */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Spice Restaurant Grand Opening"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/50 text-sm font-semibold text-white placeholder-gray-600 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(248,180,0,0.06)]"
                />
              </div>

              {/* Project Description (Large Auto-Expanding) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400">Project Description & Prompt Brief</label>
                  <span className="text-[10px] font-mono text-gray-600">{form.description.length} / 2000 chars</span>
                </div>
                <textarea
                  ref={textareaRef}
                  rows={6}
                  maxLength={2000}
                  placeholder={`Provide detailed business goals, offers, text copy requirements, style notes...`}
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/50 text-xs leading-relaxed font-mono text-gray-300 placeholder-gray-600 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(248,180,0,0.06)] resize-none"
                />
              </div>

              {/* ─── UPLOAD SECTION ─── */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2.5">Upload Brand Assets</label>
                
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative p-8 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center gap-3 group/upload ${
                    dragActive 
                      ? "border-[#F8B400] bg-[#F8B400]/5 shadow-[0_0_20px_rgba(248,180,0,0.1)]" 
                      : "border-white/5 bg-[#090909] hover:border-white/15 hover:bg-[#111111]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  
                  <div className="p-3 rounded-full bg-white/[0.02] border border-white/5 text-gray-500 group-hover/upload:text-[#F8B400] group-hover/upload:border-[#F8B400]/30 transition-all duration-300">
                    <UploadCloud size={22} className="group-hover/upload:scale-110 transition-transform" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-300">
                      Drag & drop brand assets or <span className="text-[#F8B400] hover:underline">browse files</span>
                    </p>
                    <p className="text-[10px] text-gray-600 font-medium">
                      Supported Formats: PNG, JPG, SVG, PDF, PSD, AI, DOCX (Max 25MB per file)
                    </p>
                  </div>
                </div>

                {/* Uploaded Files list */}
                {form.assets.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {form.assets.map((asset, index) => (
                      <div 
                        key={index}
                        className="p-2.5 rounded-lg border border-white/5 bg-[#090909] flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded bg-[#F8B400]/10 border border-[#F8B400]/25 text-[#F8B400]">
                            <FileSpreadsheet size={12} />
                          </span>
                          <span className="text-gray-300 font-bold truncate max-w-[200px] sm:max-w-[320px]">{asset.name}</span>
                          <span className="text-gray-600 font-mono">({asset.size})</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveAsset(index)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid Details Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Business Category */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Business Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-gray-200 focus:outline-none transition-all cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-zinc-950 text-gray-300">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Project Type</label>
                  <select
                    value={form.projectType}
                    onChange={e => setForm(prev => ({ ...prev, projectType: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-gray-200 focus:outline-none transition-all cursor-pointer"
                  >
                    {PROJECT_TYPES.map(type => (
                      <option key={type} value={type} className="bg-zinc-950 text-gray-300">{type}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Low", "Medium", "High"] as const).map(prio => (
                      <button
                        key={prio}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, priority: prio }))}
                        className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                          form.priority === prio 
                            ? prio === "High" ? "bg-red-500/10 border-red-500/40 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                              : prio === "Medium" ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                              : "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                            : "bg-[#090909] border-white/5 text-gray-500 hover:text-gray-300 hover:bg-[#111]"
                        }`}
                      >
                        {prio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Options */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Workspace Theme</label>
                  <select
                    value={form.theme}
                    onChange={e => setForm(prev => ({ ...prev, theme: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-gray-200 focus:outline-none transition-all cursor-pointer"
                  >
                    {THEMES.map(t => (
                      <option key={t.name} value={t.name} className="bg-zinc-950 text-gray-300">{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Project Language</label>
                  <input
                    type="text"
                    placeholder="e.g. English, Bilingual"
                    value={form.language}
                    onChange={e => setForm(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-white placeholder-gray-700 focus:outline-none"
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Local Foodies, Tech Execs"
                    value={form.targetAudience}
                    onChange={e => setForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-white placeholder-gray-700 focus:outline-none"
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Deadline Date</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-white focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Output Format */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Output Format</label>
                  <select
                    value={form.outputFormat}
                    onChange={e => setForm(prev => ({ ...prev, outputFormat: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-gray-200 focus:outline-none transition-all cursor-pointer"
                  >
                    {OUTPUT_FORMATS.map(f => (
                      <option key={f} value={f} className="bg-zinc-950 text-gray-300">{f}</option>
                    ))}
                  </select>
                </div>

                {/* Project Status */}
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">Project Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090909] border border-white/5 focus:border-[#F8B400]/40 text-xs font-semibold text-gray-200 focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="Not Started" className="bg-zinc-950">Not Started</option>
                    <option value="In Progress" className="bg-zinc-950">In Progress</option>
                    <option value="Completed" className="bg-zinc-950">Completed</option>
                    <option value="On Hold" className="bg-zinc-950">On Hold</option>
                  </select>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="flex-1 min-w-[140px] px-6 py-3.5 rounded-[12px] bg-[#F8B400] text-black text-xs font-extrabold tracking-widest uppercase hover:bg-[#FF9800] hover:shadow-[0_0_20px_rgba(248,180,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle size={14} />
                  {editingId ? "Save Changes" : "Create Project"}
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3.5 rounded-[12px] bg-white/5 border border-white/5 text-gray-300 text-xs font-black tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={handleClearForm}
                  className="px-6 py-3.5 rounded-[12px] bg-transparent border border-white/5 text-gray-500 text-xs font-black tracking-widest uppercase hover:border-red-500/30 hover:text-red-400 transition-all cursor-pointer"
                >
                  Clear Form
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL (35% -> 4 Columns) ─── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* CARD 1: RECENT PROJECTS (With searching and list triggers) */}
          <div className="rounded-[18px] border border-white/5 bg-zinc-950/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col max-h-[580px]">
            
            <div className="mb-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bookmark size={15} className="text-[#F8B400]" />
                  Recent Projects
                </span>
                <span className="text-[10px] font-mono text-gray-500 font-bold bg-white/5 px-2 py-0.5 rounded-full">{filteredProjects.length} found</span>
              </h3>
              
              {/* Search bar inside Card */}
              <div className="relative mt-3">
                <Search size={12} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects by name, category..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#090909] border border-white/5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#F8B400]/40 transition-all"
                />
              </div>

              {/* Categorized filter tags */}
              <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-white/5">
                {["All", "Restaurant", "School", "Corporate", "Festival", "Startup"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      selectedFilterCategory === cat 
                        ? "bg-[#F8B400] text-black font-extrabold" 
                        : "bg-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project List Scroll Container */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[350px]">
              {isLoading ? (
                // Skeletons
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-2 animate-pulse">
                    <div className="h-3 w-2/3 bg-white/10 rounded" />
                    <div className="h-2.5 w-1/2 bg-white/5 rounded" />
                  </div>
                ))
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs text-gray-600 font-bold">No matching projects found.</p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedFilterCategory("All"); setSelectedFilterStatus("All"); }}
                    className="text-[10px] text-[#F8B400] font-black uppercase tracking-wider mt-2 hover:underline cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredProjects.map(project => {
                  const isCurrent = editingId === project.id;
                  return (
                    <div
                      key={project.id}
                      onClick={() => handleSelectProject(project)}
                      className={`group/item p-3.5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 relative ${
                        isCurrent 
                          ? "border-[#F8B400] bg-[#F8B400]/[0.03] shadow-[0_0_15px_rgba(248,180,0,0.06)]" 
                          : "border-white/5 bg-white/[0.01] hover:border-[#F8B400]/20 hover:bg-[#111]"
                      }`}
                    >
                      {/* Glass Shimmer on hover */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <div className="absolute top-0 bottom-0 w-[60px] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent transform -skew-x-12 translate-x-[-150%] group-hover/item:animate-[lineLightSlide_3s_linear_infinite]" />
                      </div>

                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#F8B400]/10 text-[#F8B400]">
                              {project.category}
                            </span>
                            <span className="text-[8px] font-mono text-gray-600">
                              {project.projectType}
                            </span>
                          </div>
                          <h4 className="text-xs font-extrabold text-gray-100 group-hover/item:text-white transition-colors line-clamp-1">
                            {project.name}
                          </h4>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => handleTogglePin(e, project)}
                            className={`p-1.5 rounded hover:bg-white/5 transition-colors ${
                              project.isPinned ? "text-[#F8B400]" : "text-gray-600 hover:text-gray-400"
                            }`}
                          >
                            <Star size={11} fill={project.isPinned ? "#F8B400" : "none"} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(project.id, project.name);
                            }}
                            className="p-1.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] text-gray-500 font-medium">
                        <span className={`px-1.5 py-0.5 rounded-md ${getStatusBadgeColor(project.status)}`}>
                          {project.status}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-gray-600">
                          <Calendar size={10} />
                          <span>{project.deadline || "No date"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CARD 2: QUICK TEMPLATES */}
          <div className="rounded-[18px] border border-white/5 bg-zinc-950/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap size={15} className="text-[#F8B400]" />
              Quick Templates
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {PROJECT_TYPES.slice(0, 6).map(type => (
                <button
                  key={type}
                  onClick={() => handleQuickTemplateSelect(type)}
                  className="p-3 rounded-xl border border-white/5 bg-white/[0.01] text-left hover:border-[#F8B400]/40 hover:bg-[#F8B400]/5 transition-all duration-300 group cursor-pointer"
                >
                  <p className="text-[10px] font-black text-gray-400 group-hover:text-white transition-colors">{type}</p>
                  <span className="text-[8px] font-mono text-gray-600 group-hover:text-[#F8B400] transition-colors flex items-center gap-0.5 mt-1">
                    Apply brief
                    <ChevronRight size={8} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CARD 3: PROJECT PROGRESS METRICS */}
          <div className="rounded-[18px] border border-white/5 bg-zinc-950/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers2 size={15} className="text-[#F8B400]" />
              Project Progress
            </h3>

            <div className="space-y-3.5">
              {/* Progress Rows */}
              {(["Not Started", "In Progress", "Completed", "On Hold"] as const).map(status => {
                const count = countByStatus(status);
                const total = projects.length || 1;
                const percentage = Math.round((count / total) * 100);

                return (
                  <div key={status} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          status === "Completed" ? "bg-emerald-400" : status === "In Progress" ? "bg-[#F8B400]" : status === "On Hold" ? "bg-red-400" : "bg-gray-400"
                        }`} />
                        {status}
                      </span>
                      <span className="font-mono text-gray-300">{count} projects ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#090909] border border-white/5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === "Completed" ? "bg-emerald-500" : status === "In Progress" ? "bg-[#F8B400]" : status === "On Hold" ? "bg-red-500" : "bg-gray-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 4: RECENT ACTIVITY */}
          <div className="rounded-[18px] border border-white/5 bg-zinc-950/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={15} className="text-[#F8B400]" />
              Recent Activity Feed
            </h3>

            <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {activities.map(act => (
                <div key={act.id} className="flex gap-2.5 text-[10px] items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F8B400]/40 mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-gray-300 font-semibold leading-normal">{act.text}</p>
                    <span className="text-[8px] font-mono text-gray-600 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 5: FAVORITE PROJECTS */}
          <div className="rounded-[18px] border border-white/5 bg-zinc-950/70 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Star size={14} className="text-[#F8B400]" />
              Favorite Projects Pinned
            </h3>
            
            <div className="space-y-2">
              {projects.filter(p => p.isPinned).length === 0 ? (
                <p className="text-[10px] text-gray-600 font-semibold py-1">No projects pinned to favorites. Click the star icon on any project list item to pin.</p>
              ) : (
                projects.filter(p => p.isPinned).slice(0, 4).map(p => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectProject(p)}
                    className="p-2 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-colors cursor-pointer flex justify-between items-center text-[11px]"
                  >
                    <span className="text-gray-300 font-bold truncate max-w-[200px]">{p.name}</span>
                    <ChevronRight size={12} className="text-[#F8B400]" />
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ─── EMPTY STATE (Double Safe Guard) ─── */}
      {projects.length === 0 && !isLoading && (
        <div className="rounded-[18px] border border-white/5 bg-zinc-950/80 p-12 text-center max-w-2xl mx-auto space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-[#F8B400]/10 border border-[#F8B400]/25 flex items-center justify-center mx-auto text-[#F8B400] text-xl">
            <Folder size={28} />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-black text-white uppercase tracking-wider">No projects available</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Describe your project idea, select its properties, upload brand assets, and generate your first professional creative workspace.
            </p>
          </div>
          <button
            onClick={handleAutoFillExample}
            className="px-6 py-2.5 rounded-xl bg-[#F8B400] hover:bg-[#FF9800] text-black text-xs font-black tracking-widest uppercase hover:shadow-[0_0_15px_rgba(248,180,0,0.3)] transition-all cursor-pointer"
          >
            Create Project Demo
          </button>
        </div>
      )}
    </div>
  );
}
