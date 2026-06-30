import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  Sparkles, 
  Video, 
  Music, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Clapperboard, 
  Download, 
  Share2, 
  Sliders, 
  Monitor, 
  Smartphone, 
  Square, 
  Maximize2, 
  SlidersHorizontal, 
  Plus, 
  Check, 
  CheckCircle2, 
  Activity, 
  Grid, 
  FileText, 
  Layers, 
  Languages, 
  Info, 
  Settings, 
  ShieldAlert, 
  Gauge, 
  Film, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  UploadCloud, 
  Trash2, 
  AlertCircle, 
  Cpu, 
  HardDrive, 
  RefreshCcw, 
  Save, 
  ZoomIn, 
  Eye,
  Languages as LangIcon
} from "lucide-react";

// Types
interface Scene {
  id: number;
  title: string;
  prompt: string;
  status: "Draft" | "Queued" | "Rendering" | "Completed";
  progress: number;
  duration: number; // Fixed at 10 seconds per scene
  imageUrl: string;
  hasImageRef: boolean;
  hasVideoRef: boolean;
  imageRefName?: string;
  videoRefName?: string;
}

interface Voice {
  id: string;
  name: string;
  gender: "Male" | "Female" | "Child";
  tag: string;
  avatar: string;
  emotion: string;
  pitch: number;
  speed: number;
  narrationStyle: string;
}

interface BGTrack {
  id: string;
  name: string;
  category: "Corporate" | "Business" | "Luxury" | "Educational" | "Festival" | "Motivational" | "Modern";
  duration: string;
  url?: string;
}

// Caption Languages List with real translated sample strings
const CAPTION_TRANSLATIONS: Record<string, { flag: string; label: string; text: string }> = {
  English: { flag: "🇺🇸", label: "English", text: "Designing the solid future of smart luxury structures." },
  Hindi: { flag: "🇮🇳", label: "Hindi (हिंदी)", text: "आधुनिक स्मार्ट लक्जरी संरचनाओं के ठोस भविष्य का निर्माण।" },
  Marathi: { flag: "🇮🇳", label: "Marathi (मराठी)", text: "आधुनिक स्मार्ट लक्झरी संरचनांच्या ठोस भविष्याची निर्मिती." },
  Gujarati: { flag: "🇮🇳", label: "Gujarati (ગુજરાતી)", text: "આધુનિક સ્માર્ટ લક્ઝરી સ્ટ્રક્ચર્સના નક્કર ભવિષ્યનું નિર્માણ." },
  Punjabi: { flag: "🇮🇳", label: "Punjabi (ਪੰਜਾਬੀ)", text: "ਆਧੁਨಿಕ ਸਮਾਰਟ ਲਗਜ਼ਰੀ ਢਾਂਚੇ ਦੇ ਠੋਸ ਭਵਿੱਖ ਦਾ ਨਿਰਮਾਣ." },
  Bengali: { flag: "🇮🇳", label: "Bengali (বাংলা)", text: "আধুনিক স্মার্ট বিলাসবহুল কাঠামোর সুদৃঢ় ভবিষ্যৎ গঠন।" },
  Tamil: { flag: "🇮🇳", label: "Tamil (தமிழ்)", text: "நவீன ஸ்மார்ட் சொகுசு கட்டமைப்புகளின் உறுதியான எதிர்காலத்தை உருவாக்குதல்." },
  Telugu: { flag: "🇮🇳", label: "Telugu (తెలుగు)", text: "ఆధునిక స్మార్ట్ లగ్జరీ నిర్మాణాల యొక్క పటిష్టమైన ભવિష్యత్తును సృష్టించడం." },
  Kannada: { flag: "🇮🇳", label: "Kannada (ಕನ್ನಡ)", text: "ಆಧುನಿಕ ಸ್ಮಾರ್ಟ್ ಐಷಾರಾಮಿ ರಚನೆಗಳ ಭವಿಷ್ಯದ ನಿರ್ಮಾಣ." },
  Malayalam: { flag: "🇮🇳", label: "Malayalam (മലയാളം)", text: "ಆಧುನಿಕ സ്മാർട്ട് ലക്ഷ്വറി ഘടനകളുടെ സുസ്ഥിര ഭാവി നിർമ്മിതി." },
  Urdu: { flag: "🇮🇳", label: "Urdu (اردو)", text: "جدید اسمارٹ لگژری ڈھانچوں کے مضبوط مستقبل کی تعمیر۔" },
  Odia: { flag: "🇮🇳", label: "Odia (ଓଡ଼ିଆ)", text: "ଆଧୁନಿಕ ସ୍ମାର୍ଟ ବିଳାସପୂର୍ଣ୍ଣ ସଂରଚନାର ସୁଦୃଢ ଭବିଷ୍ୟତ ଗଠନ।" },
  Assamese: { flag: "🇮🇳", label: "Assamese (অসমীয়া)", text: "আধুনিক স্মাৰ্ট বিলাসী গাঁথনিৰ সুদৃঢ় ভৱিষ্যত নিৰ্মাণ।" },
  Sanskrit: { flag: "🇮🇳", label: "Sanskrit (संस्कृतम्)", text: "आधुनिक सुसज्ज विलासिता संरचनानां सुदृढ भविष्य निर्माणम्।" },
  Spanish: { flag: "🇪🇸", label: "Spanish (Español)", text: "Creando el futuro sólido de las estructuras inteligentes de lujo." },
  French: { flag: "🇫🇷", label: "French (Français)", text: "Créer l'avenir solide des structures intelligentes de luxe." },
  German: { flag: "🇩🇪", label: "German (Deutsch)", text: "Die solide Zukunft moderner smarter Luxusstrukturen schaffen." },
  Italian: { flag: "🇮🇹", label: "Italian (Italiano)", text: "Creare il futuro solido di strutture intelligenti di lusso." },
  Portuguese: { flag: "🇵🇹", label: "Portuguese (Português)", text: "Criando o futuro sólido de estruturas inteligentes de luxo." },
  Japanese: { flag: "🇯🇵", label: "Japanese (日本語)", text: "モダンでスマートな高級構造物の確かな未来を創造する。" }
};

const INITIAL_SCENES: Scene[] = [
  {
    id: 1,
    title: "The Grand Reveal",
    prompt: "A low-altitude cinematic glide over interlocking grooves of premium terracotta modular blocks, sunrise light highlighting metallic gold specs.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    hasImageRef: true,
    imageRefName: "terracotta_detail_01.png",
    hasVideoRef: false
  },
  {
    id: 2,
    title: "Luxury Facade rising",
    prompt: "Sleek time-lapse of a modular luxury villa rising in a forest backdrop, large high-contrast glass panels slotting into gold-anodized brick frames.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: true,
    videoRefName: "rising_drone_raw.mp4"
  },
  {
    id: 3,
    title: "Precision Joint Lock",
    prompt: "Extreme macro high-speed render showing mechanical block joints locking flawlessly with visual magnetic grid lines highlighting tight tolerances.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80",
    hasImageRef: true,
    imageRefName: "precision_joint.jpg",
    hasVideoRef: false
  },
  {
    id: 4,
    title: "Drafting Room Elegance",
    prompt: "Elite designer hand sketching modular masonry blueprints on a black glass drafting table with illuminated digital golden vector overlays.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: false
  },
  {
    id: 5,
    title: "Solar Grid Assembly",
    prompt: "Macro close-up on photovoltaic solar tiles integrated perfectly on the modular brick surface, shimmering with violet and deep blue light.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
    hasImageRef: true,
    imageRefName: "solar_brick_specs.png",
    hasVideoRef: false
  },
  {
    id: 6,
    title: "Insulation Cross-Section",
    prompt: "Sleek 3D cutaway visualization of brick air chambers trapping warmth, displaying modern temperature gauges fluctuating from cold blue to warm amber.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: false
  },
  {
    id: 7,
    title: "The Pavilion",
    prompt: "Atmospheric panoramic sunset rotation of a completed corporate pavilion with gold architectural grids standing strong in urban square.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: false
  },
  {
    id: 8,
    title: "Sustainable Townhouses",
    prompt: "Drone descent over premium modular townhouse complex built entirely with green blocks, children playing in landscaped courtyards.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: false
  },
  {
    id: 9,
    title: "Luxury Interior Accent",
    prompt: "Slow luxurious dolly-in of a minimalist living space with a floor-to-ceiling brick hearth accent wall, gold light flickering from custom gas fire.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: false
  },
  {
    id: 10,
    title: "Brand Logo Outro",
    prompt: "Elegant gold metallic outro with dynamic particle dispersion, centering the high-end text logo 'Brick-Maker Studio: Solid Future'.",
    status: "Completed",
    progress: 100,
    duration: 10,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    hasImageRef: false,
    hasVideoRef: false
  }
];

export function VideoView() {
  // Navigation between Creation Studio and Admin Dashboard
  const [activeTab, setActiveTab] = useState<"studio" | "admin">("studio");

  // Core Project Settings
  const [videoTitle, setVideoTitle] = useState("Brick-Maker Golden Estate Launch");
  const [category, setCategory] = useState("Showcase");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "4:5">("16:9");
  const [quality, setQuality] = useState<"720P" | "1080P" | "2K" | "4K">("1080P");
  const [frameRate, setFrameRate] = useState<"24" | "30" | "60">("30");
  const [visualStyle, setVisualStyle] = useState<"Cinematic" | "Luxury" | "Corporate" | "Creative" | "Modern">("Luxury");

  // Scenes state (10 Scene prompt boxes)
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

  // Active rendering statuses
  const [isRenderingAll, setIsRenderingAll] = useState(false);
  const [renderingProgress, setRenderingProgress] = useState(100);
  const [renderingMessage, setRenderingMessage] = useState("");
  const [renderTimeRemaining, setRenderTimeRemaining] = useState("");

  // Video playback controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadTime, setPlayheadTime] = useState(0); // 0 to 100 seconds
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timelineZoom, setTimelineZoom] = useState(1);

  // Voice Lab Settings
  const [selectedVoiceId, setSelectedVoiceId] = useState("male-1");
  const [voiceVolume, setVoiceVolume] = useState(0.9);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceEmotion, setVoiceEmotion] = useState("Proud");
  const [narrationStyle, setNarrationStyle] = useState("Luxury");
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Caption Settings
  const [enableCaptions, setEnableCaptions] = useState(true);
  const [captionLanguage, setCaptionLanguage] = useState("English");
  const [captionStyle, setCaptionStyle] = useState<"Classic" | "Modern" | "Luxury" | "Bold" | "Minimal">("Luxury");
  const [captionPosition, setCaptionPosition] = useState<"Top" | "Center" | "Bottom">("Bottom");
  const [captionFont, setCaptionFont] = useState("Outfit");
  const [captionColor, setCaptionColor] = useState("#F8B400");
  const [captionBg, setCaptionBg] = useState("semi");

  // Background Music Settings
  const [selectedMusicCategory, setSelectedMusicCategory] = useState<BGTrack["category"]>("Luxury");
  const [bgMusicVolume, setBgMusicVolume] = useState(0.4);
  const [bgMusicFadeIn, setBgMusicFadeIn] = useState(2); // seconds
  const [bgMusicFadeOut, setBgMusicFadeOut] = useState(2); // seconds
  const [bgMusicLoop, setBgMusicLoop] = useState(true);
  const [playingMusicId, setPlayingMusicId] = useState<string | null>(null);

  // Transitions Settings between scenes (9 transition points)
  const [transitions, setTransitions] = useState<string[]>(Array(9).fill("Fade"));

  // Watermark and Brand overlay settings (influenced by Admin Dashboard)
  const [watermarkText, setWatermarkText] = useState("© Brick-Maker Studio");
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");

  // Recent sidebars
  const [recentVideos, setRecentVideos] = useState([
    { id: "v-1", title: "EcoBrick Smart Pavilion Promo", aspect: "16:9", quality: "4K", date: "Yesterday" },
    { id: "v-2", title: "Luxury Terracotta Showcase - Portrait", aspect: "9:16", quality: "1080P", date: "3 days ago" },
    { id: "v-3", title: "Corporate Foundation Presentation", aspect: "16:9", quality: "2K", date: "1 week ago" }
  ]);
  const [savedProjects, setSavedProjects] = useState([
    { id: "p-1", title: "Modular Architecture Masters", scenes: 10, edited: "2 hours ago" },
    { id: "p-2", title: "Interlocking Solar Demonstration", scenes: 10, edited: "5 days ago" }
  ]);

  // Toast notifications
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" | "warning" } | null>(null);

  // Admin Controls & Statistics (System connection)
  const [adminSpeedMultiplier, setAdminSpeedMultiplier] = useState(1);
  const [adminCredits, setAdminCredits] = useState(380);
  const [adminCreditsMax, setAdminCreditsMax] = useState(500);
  const [adminDailyUsageCount, setAdminDailyUsageCount] = useState(2);
  const [adminDailyUsageLimit, setAdminDailyUsageLimit] = useState(5);
  const [adminEngineActive, setAdminEngineActive] = useState(true);
  const [gpuLoad, setGpuLoad] = useState(28);
  const [cpuLoad, setCpuLoad] = useState(34);
  const [queueList, setQueueList] = useState<Array<{ id: string; name: string; progress: number; owner: string }>>([]);

  const audioCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brief alert toasts
  const triggerToast = (msg: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Predefined lists
  const voicesList: Voice[] = [
    { id: "male-1", name: "Professional Male", gender: "Male", tag: "Corporate Deep", avatar: "👨‍💼", emotion: "Confident", pitch: 1.0, speed: 1.0, narrationStyle: "Corporate" },
    { id: "male-2", name: "Warm Male", gender: "Male", tag: "Storyteller Cozy", avatar: "🧔", emotion: "Warm", pitch: 0.9, speed: 0.95, narrationStyle: "Storytelling" },
    { id: "male-3", name: "Deep Narrator", gender: "Male", tag: "Cinematic Gravity", avatar: "👴", emotion: "Dramatic", pitch: 0.75, speed: 0.9, narrationStyle: "Promotional" },
    { id: "female-1", name: "Professional Female", gender: "Female", tag: "Articulate Executive", avatar: "👩‍💼", emotion: "Elegant", pitch: 1.1, speed: 1.0, narrationStyle: "Corporate" },
    { id: "female-2", name: "Soft Female", gender: "Female", tag: "Docu Narrator Warm", avatar: "👩", emotion: "Inspirational", pitch: 1.05, speed: 0.9, narrationStyle: "Educational" },
    { id: "female-3", name: "Energetic Female", gender: "Female", tag: "High Impact Ad", avatar: "👱‍♀️", emotion: "Excited", pitch: 1.2, speed: 1.1, narrationStyle: "Advertisement" },
    { id: "female-4", name: "Elegant Female", gender: "Female", tag: "Luxury Brand Voice", avatar: "👸", emotion: "Prestigious", pitch: 1.0, speed: 0.95, narrationStyle: "Promotional" },
    { id: "child-1", name: "Young Boy", gender: "Child", tag: "Playful Explainer", avatar: "👦", emotion: "Curious", pitch: 1.4, speed: 1.05, narrationStyle: "Educational" },
    { id: "child-2", name: "Young Girl", gender: "Child", tag: "Bright Spark", avatar: "👧", emotion: "Happy", pitch: 1.45, speed: 1.0, narrationStyle: "Storytelling" },
    { id: "child-3", name: "School Child", gender: "Child", tag: "Narrative Duo", avatar: "🎒", emotion: "Expressive", pitch: 1.35, speed: 1.0, narrationStyle: "Educational" }
  ];

  const musicTracks: BGTrack[] = [
    { id: "m-corp", name: "Silicon Skyline Elite", category: "Corporate", duration: "2:40" },
    { id: "m-biz", name: "Sovereign Blueprints", category: "Business", duration: "3:15" },
    { id: "m-lux", name: "Aurelian Terrace", category: "Luxury", duration: "3:45" },
    { id: "m-edu", name: "Vapor-Masons Explainer", category: "Educational", duration: "1:55" },
    { id: "m-fest", name: "Solar Zenith Celebration", category: "Festival", duration: "4:10" },
    { id: "m-mot", name: "Compressive Strength Peak", category: "Motivational", duration: "2:50" },
    { id: "m-mod", name: "Monolith Ambient Grooves", category: "Modern", duration: "3:22" }
  ];

  // Map playhead position to current scene index
  const activeSceneIndex = Math.min(Math.floor(playheadTime / 10), 9);

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      playerTimerRef.current = setInterval(() => {
        setPlayheadTime((prev) => {
          if (prev >= 99.8) {
            setIsPlaying(false);
            return 0;
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    } else {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    }
    return () => {
      if (playerTimerRef.current) clearInterval(playerTimerRef.current);
    };
  }, [isPlaying]);

  // Waveform visualization simulation
  useEffect(() => {
    let animationFrameId: number;
    const canvas = audioCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#F8B400";
      
      const barCount = 45;
      const spacing = 3;
      const barWidth = (canvas.width - (spacing * (barCount - 1))) / barCount;
      
      for (let i = 0; i < barCount; i++) {
        let height = 4;
        if (isPlaying) {
          // Dynamic heights depending on volume and noise
          height = Math.abs(Math.sin((i + playheadTime * 5) * 0.3)) * (canvas.height - 10) * volume;
          // Add some randomness
          height += Math.random() * 8;
        } else if (previewingVoiceId) {
          height = Math.abs(Math.sin((i + Date.now() * 0.05) * 0.4)) * (canvas.height - 8) * 0.8;
        }
        height = Math.max(height, 4);

        const x = i * (barWidth + spacing);
        const y = (canvas.height - height) / 2;
        
        // Gradient color for bars
        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, "#F8B400");
        grad.addColorStop(1, "#FF9800");
        ctx.fillStyle = grad;

        // Draw pill shaped columns
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, height, 4);
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, volume, playheadTime, previewingVoiceId]);

  // System usage simulation logs / charts update
  useEffect(() => {
    const sysInterval = setInterval(() => {
      setGpuLoad((prev) => {
        const delta = Math.floor(Math.random() * 9) - 4;
        const currentBase = isPlaying || isRenderingAll ? 68 : 22;
        return Math.max(10, Math.min(95, currentBase + delta));
      });
      setCpuLoad((prev) => {
        const delta = Math.floor(Math.random() * 7) - 3;
        const currentBase = isPlaying || isRenderingAll ? 72 : 28;
        return Math.max(15, Math.min(92, currentBase + delta));
      });
    }, 3000);
    return () => clearInterval(sysInterval);
  }, [isPlaying, isRenderingAll]);

  // Single Scene Render Simulation
  const renderSingleScene = (id: number) => {
    if (!adminEngineActive) {
      triggerToast("Render failed: Video Generation Engine is currently offline in the Admin panel.", "warning");
      return;
    }
    if (adminCredits < 5) {
      triggerToast("Insufficient system credits! Please recharge inside the Admin settings panel.", "warning");
      return;
    }

    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Queued", progress: 0 } : s))
    );
    
    // Add to simulation render queue
    const taskName = `Render Scene ${id < 10 ? "0" + id : id} - ${scenes[id - 1].title}`;
    setQueueList(prev => [...prev, { id: `q-${Date.now()}`, name: taskName, progress: 0, owner: "aftabkhan" }]);

    triggerToast(`Scene ${id < 10 ? "0" + id : id} queued for rendering...`, "info");

    let prog = 0;
    const interval = setInterval(() => {
      prog += 10 * adminSpeedMultiplier;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setScenes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "Completed", progress: 100 } : s))
        );
        setAdminCredits(c => Math.max(0, c - 5));
        setAdminDailyUsageCount(d => d + 1);
        setQueueList(prev => prev.filter(q => q.name !== taskName));
        triggerToast(`Scene ${id < 10 ? "0" + id : id} fully rendered successfully!`, "success");
      } else {
        setScenes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "Rendering", progress: prog } : s))
        );
        setQueueList(prev => prev.map(q => q.name === taskName ? { ...q, progress: prog } : q));
      }
    }, 150);
  };

  // Render All Scenes (Automatically merge into 100 second master track)
  const renderAllScenes = () => {
    if (!adminEngineActive) {
      triggerToast("Mass rendering failed: Video Generation Engine is paused by corporate admin.", "warning");
      return;
    }
    if (adminCredits < 40) {
      triggerToast("Insufficient credits (40 required for full master render).", "warning");
      return;
    }
    if (adminDailyUsageCount >= adminDailyUsageLimit) {
      triggerToast(`Daily video creation limit of ${adminDailyUsageLimit} reached.`, "warning");
      return;
    }

    setIsRenderingAll(true);
    setRenderingProgress(0);
    setRenderingMessage("Initializing 10-Scene Synthesis pipeline...");
    setRenderTimeRemaining("Estimating...");

    let overallProg = 0;
    const totalSteps = 100;
    const interval = setInterval(() => {
      overallProg += 4 * adminSpeedMultiplier;
      if (overallProg >= totalSteps) {
        overallProg = 100;
        clearInterval(interval);
        setIsRenderingAll(false);
        setRenderingProgress(100);
        setScenes((prev) => prev.map((s) => ({ ...s, status: "Completed", progress: 100 })));
        setAdminCredits(c => Math.max(0, c - 45));
        setAdminDailyUsageCount(d => d + 1);
        triggerToast("Corporate 100-Second Master Video rendered & compiled!", "success");
      } else {
        setRenderingProgress(overallProg);
        // Stage messaging
        if (overallProg < 20) {
          setRenderingMessage("Syncing high-fidelity reference visual uploads...");
          setRenderTimeRemaining("1m 12s");
        } else if (overallProg < 50) {
          setRenderingMessage("Synthesizing custom Voice Lab narratives...");
          setRenderTimeRemaining("45s");
        } else if (overallProg < 75) {
          setRenderingMessage("Injecting transitions and luxury ambient backing soundtracks...");
          setRenderTimeRemaining("22s");
        } else {
          setRenderingMessage("Finalizing 4K UHD Master merge & rendering watermark...");
          setRenderTimeRemaining("8s");
        }
      }
    }, 150);
  };

  // Play audio sample for voice selection
  const playVoicePreview = (voice: Voice) => {
    if (previewingVoiceId === voice.id) {
      setPreviewingVoiceId(null);
    } else {
      setPreviewingVoiceId(voice.id);
      triggerToast(`Auditioning "${voice.name}" with a ${voice.emotion} emotion preset...`, "info");
      setTimeout(() => {
        setPreviewingVoiceId(null);
      }, 2500);
    }
  };

  // Drag and drop reference image files helper
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropReferenceImage = (e: React.DragEvent, sceneId: number) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setScenes((prev) =>
        prev.map((s) =>
          s.id === sceneId
            ? { ...s, hasImageRef: true, imageRefName: file.name, status: "Draft" }
            : s
        )
      );
      triggerToast(`Reference uploaded: ${file.name} attached to Scene ${sceneId}`, "success");
    }
  };

  // Save the full video composition structure
  const handleSaveProject = () => {
    triggerToast(`Project "${videoTitle}" saved perfectly in SaaS workspace Cloud repository.`, "success");
  };

  // Export finished video
  const handleExportFinishedVideo = (format: string) => {
    triggerToast(`Initiated direct high-speed packaging for ${videoTitle}.${format.toLowerCase()}`, "success");
  };

  return (
    <div className="space-y-8 bg-[var(--bg-body)] text-gray-200 rounded-[28px] border border-white/5 p-6 md:p-8 min-h-screen relative overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.9)]">
      
      {/* Absolute top luxury background lighting flares */}
      <div className="absolute top-[-20%] left-1/3 w-[500px] h-[350px] bg-gradient-to-r from-[#F8B400]/10 to-[#FF9800]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-r from-zinc-900 to-black rounded-full blur-[90px] pointer-events-none" />

      {/* ─── TOASTS ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none"
          >
            <div className="px-5 py-3.5 rounded-2xl bg-[#090909] border border-[#F8B400]/30 text-xs font-bold text-gray-200 shadow-[0_15px_50px_rgba(0,0,0,0.9)] flex items-center gap-3 max-w-sm backdrop-blur-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F8B400] animate-ping" />
              <span>{toast.msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PAGE HEADER WITH PREMIUM TABS ─── */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 gap-6 z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 text-[#F8B400] shadow-[0_0_20px_rgba(248,180,0,0.1)]">
              <Clapperboard size={22} className="animate-pulse" />
            </span>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#F8B400]">
                Video Production Studio
              </h1>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                Brick-Maker Studio Master Suite
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed max-w-xl">
            Create professional promotional videos from one complete production workspace. Automatically merge individual scenes into 4K luxury showcases.
          </p>
        </div>

        {/* Tab switcher & Status indicator */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#121212] border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("studio")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "studio"
                  ? "bg-[#F8B400]/10 border border-[#F8B400]/20 text-[#F8B400]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film size={14} />
              Production Room
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "admin"
                  ? "bg-[#F8B400]/10 border border-[#F8B400]/20 text-[#F8B400]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Settings size={14} />
              Engine Admin
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0F0F0F] border border-white/5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-gray-400">
              CREDITS: {adminCredits}/{adminCreditsMax}
            </span>
          </div>
        </div>
      </div>

      {/* ─── MAIN TAB CONTENT ─── */}
      {activeTab === "studio" ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start z-10 relative">
          
          {/* LEFT 8 COLUMNS: TIMELINE, VIDEO PLAYER & DETAILED CONTROLS */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* ─── PREMIUM PLAYER & TIMELINE STAGE ─── */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#121212]/90 backdrop-blur-md space-y-5">
              
              {/* VIDEO CONTAINER STAGE */}
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group/stage">
                
                {/* Visual rendering placeholder background */}
                <div className="absolute inset-0 select-none">
                  <img 
                    src={scenes[activeSceneIndex]?.imageUrl} 
                    alt="Active Video Frame preview" 
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isPlaying ? "scale-105 saturate-110" : "scale-100 saturate-100"
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
                </div>

                {/* Simulated playback visual overlay elements */}
                <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                  {/* Top line specs */}
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 rounded bg-[#F8B400] text-black font-mono font-black text-[9px] uppercase tracking-wider shadow-[0_4px_12px_rgba(248,180,0,0.3)]">
                      Scene {activeSceneIndex < 9 ? "0" + (activeSceneIndex + 1) : activeSceneIndex + 1}
                    </span>

                    <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-gray-300">
                      Format: {aspectRatio} • {quality}
                    </span>
                  </div>

                  {/* Dynamic watermark text from admin controls */}
                  {enableWatermark && (
                    <div className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider text-white/30 font-mono">
                      {watermarkText}
                    </div>
                  )}

                  {/* Central dramatic visual overlays representing "Visual Style" */}
                  {isPlaying && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {visualStyle === "Cinematic" && <div className="w-full h-full border-t-[40px] border-b-[40px] border-black/80 transition-all" />}
                      {visualStyle === "Luxury" && <div className="w-[94%] h-[92%] border border-[#F8B400]/25 transition-all animate-pulse" />}
                      {visualStyle === "Corporate" && <div className="absolute top-4 left-4 text-[9px] font-mono text-emerald-400 bg-black/40 px-2 py-0.5 rounded">STREAM_LIVE_4K</div>}
                    </div>
                  )}

                  {/* Playback overlay controls HUD */}
                  <div className="text-center bg-black/40 p-4 rounded-xl backdrop-blur-md max-w-xl mx-auto w-full transition-opacity group-hover/stage:opacity-100 opacity-90 border border-white/5 space-y-3">
                    
                    {/* Live Captions Area - mapped to Caption language */}
                    {enableCaptions && (
                      <div className={`text-center space-y-1 ${
                        captionPosition === "Top" ? "order-first mb-4" : captionPosition === "Center" ? "my-auto" : ""
                      }`}>
                        <span 
                          className="px-2 py-0.5 rounded bg-[#F8B400]/10 border border-[#F8B400]/30 text-[9px] font-black tracking-wider text-[#F8B400] uppercase block w-max mx-auto"
                          style={{ fontFamily: captionFont }}
                        >
                          CAPTIONS style: {captionStyle} ({captionLanguage})
                        </span>
                        <p 
                          className={`text-sm font-extrabold leading-relaxed text-center font-sans tracking-wide transition-all ${
                            captionStyle === "Bold" ? "text-lg uppercase text-white" : 
                            captionStyle === "Luxury" ? "text-[#F8B400] italic" : "text-white"
                          }`}
                        >
                          "{CAPTION_TRANSLATIONS[captionLanguage]?.text}"
                        </p>
                      </div>
                    )}

                    {/* Scene prompt summary script */}
                    <div className="text-[10px] font-medium text-gray-400 border-t border-white/10 pt-2 flex items-center justify-between gap-4">
                      <span className="truncate flex-1 text-left font-mono">
                        🎬 Script: "{scenes[activeSceneIndex]?.prompt}"
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#F8B400]">
                        Active Emotion: {voiceEmotion}
                      </span>
                    </div>

                  </div>

                </div>

                {/* Progress rendering overlay */}
                {isRenderingAll && (
                  <div className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-6 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-[#F8B400]/20 border-t-[#F8B400] animate-spin" />
                      <Clapperboard size={24} className="absolute inset-0 m-auto text-[#F8B400] animate-pulse" />
                    </div>
                    
                    <div className="text-center space-y-2 max-w-sm">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        {renderingMessage}
                      </h3>
                      <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-[#F8B400] to-[#FF9800] transition-all duration-300" 
                          style={{ width: `${renderingProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                        <span>Progress: {renderingProgress}%</span>
                        <span>Est: {renderTimeRemaining} remaining</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* MEDIA TIMELINE PLAYBACK ROW */}
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-white/5 gap-4">
                
                {/* Transport Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2.5 rounded-lg bg-[#F8B400] hover:bg-[#FF9800] text-black font-black transition-all cursor-pointer shadow-[0_4px_12px_rgba(248,180,0,0.2)]"
                    title={isPlaying ? "Pause Timeline" : "Play Timeline"}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>

                  <button
                    onClick={() => setPlayheadTime(0)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                    title="Rewind to Start"
                  >
                    <RefreshCcw size={12} />
                  </button>

                  <div className="text-xs font-mono font-bold text-white pl-1 flex items-center gap-1.5">
                    <span>
                      {Math.floor(playheadTime / 60) < 10 ? "0" + Math.floor(playheadTime / 60) : Math.floor(playheadTime / 60)}:
                      {(playheadTime % 60) < 10 ? "0" + Math.floor(playheadTime % 60) : Math.floor(playheadTime % 60)}:
                      {Math.floor((playheadTime * 10) % 10)}0
                    </span>
                    <span className="text-gray-600">/</span>
                    <span className="text-gray-500">01:40:00</span>
                  </div>
                </div>

                {/* Interactive seek timeline slider */}
                <div className="flex-1 relative mx-2">
                  <input
                    type="range"
                    min="0"
                    max="99"
                    step="0.5"
                    value={playheadTime}
                    onChange={(e) => setPlayheadTime(Number(e.target.value))}
                    className="w-full accent-[#F8B400] h-1.5 bg-zinc-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Audio controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    {isMuted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                    className="w-16 accent-[#F8B400] cursor-pointer"
                  />
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>

              </div>

              {/* TIMELINE TRACKS (CAPCUT / RESOLVE STYLE) */}
              <div className="space-y-2 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
                  <span className="font-mono">MULTITRACK TIMELINE WORKSPACE</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Zoom</span>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.5"
                      value={timelineZoom}
                      onChange={(e) => setTimelineZoom(Number(e.target.value))}
                      className="w-16 accent-[#F8B400] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Row 1: Video Scene Track */}
                <div className="relative h-12 bg-zinc-950 rounded-lg border border-white/5 overflow-hidden flex items-stretch">
                  <div className="w-20 bg-[#151515] text-[9px] font-bold text-gray-400 border-r border-white/5 flex items-center justify-center flex-shrink-0">
                    🎬 Video Scene
                  </div>
                  
                  {/* Scene timeline blocks */}
                  <div className="flex-1 flex overflow-x-auto select-none no-scrollbar">
                    {scenes.map((s, idx) => {
                      const isActive = idx === activeSceneIndex;
                      return (
                        <div
                          key={s.id}
                          onClick={() => setPlayheadTime(idx * 10)}
                          className={`relative flex-1 min-w-[50px] border-r border-white/10 flex flex-col justify-between p-1.5 cursor-pointer transition-all ${
                            isActive 
                              ? "bg-[#F8B400]/20 border-2 border-[#F8B400] z-10" 
                              : "bg-[#0E0E0E]/80 hover:bg-zinc-900"
                          }`}
                        >
                          <span className={`text-[8px] font-mono ${isActive ? "text-[#F8B400] font-black" : "text-gray-600"}`}>
                            SCENE {s.id < 10 ? "0" + s.id : s.id}
                          </span>
                          
                          {/* Mini visual indicator block */}
                          <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden mt-1">
                            <div className="h-full bg-[#F8B400]" style={{ width: `${s.progress}%` }} />
                          </div>

                          <span className="text-[7px] font-bold text-gray-500 block truncate leading-none">
                            {s.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Row 2: Voice Track with Waveform */}
                <div className="relative h-12 bg-zinc-950 rounded-lg border border-white/5 overflow-hidden flex items-stretch">
                  <div className="w-20 bg-[#151515] text-[9px] font-bold text-gray-400 border-r border-white/5 flex items-center justify-center flex-shrink-0">
                    🎙 Voice Lab V.O.
                  </div>
                  
                  <div className="flex-1 flex items-center px-4">
                    <canvas ref={audioCanvasRef} className="w-full h-8" width={400} height={32} />
                  </div>
                </div>

                {/* Row 3: Music Soundtrack Track */}
                <div className="relative h-10 bg-zinc-950 rounded-lg border border-white/5 overflow-hidden flex items-stretch">
                  <div className="w-20 bg-[#151515] text-[9px] font-bold text-gray-400 border-r border-white/5 flex items-center justify-center flex-shrink-0">
                    🎵 Music Track
                  </div>
                  
                  <div className="flex-1 flex items-center px-4 justify-between bg-[#15120a]/30">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-[#F8B400] animate-ping" />
                      <span className="font-black text-gray-300 font-mono text-[9px]">
                        CATEGORY: {selectedMusicCategory} SOUNDTRACK (VOLUME {Math.floor(bgMusicVolume * 100)}%)
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-gray-600">Active Looping</span>
                  </div>
                </div>

                {/* Row 4: Caption Track Word Blocks */}
                <div className="relative h-10 bg-zinc-950 rounded-lg border border-white/5 overflow-hidden flex items-stretch">
                  <div className="w-20 bg-[#151515] text-[9px] font-bold text-gray-400 border-r border-white/5 flex items-center justify-center flex-shrink-0">
                    💬 Subtitles
                  </div>
                  
                  <div className="flex-1 flex items-center px-4">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[9px] font-bold text-gray-300 truncate font-mono">
                      {enableCaptions ? `"${CAPTION_TRANSLATIONS[captionLanguage]?.text}"` : "Captions Disabled"}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* ─── DYNAMIC CREATION PARAMS INTERACTION SUBTABS ─── */}
            <div className="p-6 rounded-2xl border border-white/5 bg-[#121212]/90 backdrop-blur-md space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-[#F8B400]" />
                  Production Workspace Parameters
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* LEFT: VOICE LAB PRESETS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-[#F8B400] tracking-wider flex items-center gap-1.5">
                      🎙 Voice Lab
                    </h4>
                    <span className="text-[9px] font-mono text-gray-500">10 premium custom voices</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {voicesList.map((voice) => {
                      const isSelected = selectedVoiceId === voice.id;
                      const isAuditioning = previewingVoiceId === voice.id;
                      return (
                        <div
                          key={voice.id}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#F8B400]/10 border-[#F8B400]/30 shadow-[0_0_10px_rgba(248,180,0,0.05)]"
                              : "bg-[#090909] border-white/5 hover:border-white/10"
                          }`}
                          onClick={() => setSelectedVoiceId(voice.id)}
                        >
                          <div className="flex items-center gap-2 justify-between">
                            <span className="text-sm">{voice.avatar}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playVoicePreview(voice);
                              }}
                              className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black cursor-pointer ${
                                isAuditioning
                                  ? "bg-[#F8B400] text-black animate-pulse"
                                  : "bg-white/5 text-gray-400 hover:text-white"
                              }`}
                            >
                              {isAuditioning ? "Auditioning" : "Listen"}
                            </button>
                          </div>
                          <p className="text-[10px] font-black text-gray-200 mt-1">{voice.name}</p>
                          <span className="text-[8px] font-mono text-gray-600 block mt-0.5">{voice.tag}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Voice adjustments sliders */}
                  <div className="p-3 bg-[#090909] rounded-xl border border-white/5 space-y-3 text-[10px]">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-500 block mb-1">Narration Speed: {voiceSpeed}x</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={voiceSpeed}
                          onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                          className="w-full accent-[#F8B400] cursor-pointer"
                        />
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Vocal Pitch: {voicePitch}x</span>
                        <input
                          type="range"
                          min="0.5"
                          max="1.5"
                          step="0.05"
                          value={voicePitch}
                          onChange={(e) => setVoicePitch(Number(e.target.value))}
                          className="w-full accent-[#F8B400] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                      <div>
                        <span className="text-gray-500 block mb-1">Active Emotion</span>
                        <select
                          value={voiceEmotion}
                          onChange={(e) => setVoiceEmotion(e.target.value)}
                          className="w-full bg-black border border-white/5 p-1 rounded text-[10px] text-gray-300 outline-none cursor-pointer"
                        >
                          <option value="Proud">Proud & Corporate</option>
                          <option value="Warm">Warm Storytelling</option>
                          <option value="Excited">High Energy Sale</option>
                          <option value="Dramatic">Dramatic Gravity</option>
                          <option value="Inspirational">Inspirational Docu</option>
                        </select>
                      </div>
                      <div>
                        <span className="text-gray-500 block mb-1">Narration Style</span>
                        <select
                          value={narrationStyle}
                          onChange={(e) => setNarrationStyle(e.target.value)}
                          className="w-full bg-black border border-white/5 p-1 rounded text-[10px] text-gray-300 outline-none cursor-pointer"
                        >
                          <option value="Luxury">Luxury Brand Specs</option>
                          <option value="Advertisement">Advertisement Promo</option>
                          <option value="Educational">Educational Explainer</option>
                          <option value="Corporate">Corporate Presentation</option>
                          <option value="Storytelling">Storytelling Chronicle</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT: CAPTION STUDIO & BACKGROUND MUSIC */}
                <div className="space-y-6">
                  
                  {/* CAPTION STUDIO */}
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase text-[#F8B400] tracking-wider flex items-center gap-1.5">
                        💬 Caption Studio
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={enableCaptions}
                          onChange={(e) => setEnableCaptions(e.target.checked)}
                          className="rounded accent-[#F8B400] cursor-pointer"
                          id="enable_cap"
                        />
                        <label htmlFor="enable_cap" className="text-[10px] font-bold text-gray-500 cursor-pointer uppercase">Enable Captions</label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div>
                        <span className="text-gray-500 block mb-1">Caption Language (20 Specs)</span>
                        <select
                          value={captionLanguage}
                          onChange={(e) => {
                            setCaptionLanguage(e.target.value);
                            triggerToast(`Captions converted successfully to ${e.target.value}!`, "success");
                          }}
                          className="w-full bg-[#090909] border border-white/5 p-2 rounded-xl text-[10px] text-gray-200 outline-none cursor-pointer"
                        >
                          {Object.keys(CAPTION_TRANSLATIONS).map((lang) => (
                            <option key={lang} value={lang}>
                              {CAPTION_TRANSLATIONS[lang].flag} {CAPTION_TRANSLATIONS[lang].label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-gray-500 block mb-1">Styles</span>
                        <select
                          value={captionStyle}
                          onChange={(e) => setCaptionStyle(e.target.value as any)}
                          className="w-full bg-[#090909] border border-white/5 p-2 rounded-xl text-[10px] text-gray-200 outline-none cursor-pointer"
                        >
                          <option value="Classic">Classic White</option>
                          <option value="Modern">Modern Pop</option>
                          <option value="Luxury">Luxury Gold Highlight</option>
                          <option value="Bold">Bold Upper Glow</option>
                          <option value="Minimal">Minimal Overlay</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[9px] pt-1">
                      <div>
                        <span className="text-gray-600 block mb-1">Position</span>
                        <div className="flex bg-black p-0.5 rounded-lg border border-white/5">
                          {["Top", "Center", "Bottom"].map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setCaptionPosition(pos as any)}
                              className={`flex-1 py-1 rounded text-[8px] font-black uppercase cursor-pointer ${
                                captionPosition === pos ? "bg-[#F8B400] text-black" : "text-gray-400 hover:text-white"
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-600 block mb-1">Color</span>
                        <input
                          type="color"
                          value={captionColor}
                          onChange={(e) => setCaptionColor(e.target.value)}
                          className="w-full bg-black h-6 p-0.5 rounded border border-white/5 cursor-pointer"
                        />
                      </div>

                      <div>
                        <span className="text-gray-600 block mb-1">Font</span>
                        <select
                          value={captionFont}
                          onChange={(e) => setCaptionFont(e.target.value)}
                          className="w-full bg-black p-1 rounded text-[8px] text-gray-400 cursor-pointer"
                        >
                          <option value="Outfit">Outfit Sans</option>
                          <option value="Inter">Inter Clean</option>
                          <option value="Playfair Display">Playfair Serif</option>
                          <option value="JetBrains Mono">JetBrains Mono</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* BACKGROUND MUSIC */}
                  <div className="space-y-3.5 border-t border-white/5 pt-4">
                    <h4 className="text-xs font-black uppercase text-[#F8B400] tracking-wider flex items-center gap-1.5">
                      🎵 Background Soundtrack
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-[10px]">
                      <div>
                        <span className="text-gray-500 block mb-1">Sound Style Category</span>
                        <select
                          value={selectedMusicCategory}
                          onChange={(e) => {
                            setSelectedMusicCategory(e.target.value as any);
                            triggerToast(`Soundtrack style synced to ${e.target.value}!`, "info");
                          }}
                          className="w-full bg-[#090909] border border-white/5 p-2 rounded-xl text-[10px] text-gray-200 outline-none cursor-pointer"
                        >
                          <option value="Luxury">Luxury Elegant Theme</option>
                          <option value="Corporate">Corporate High Tech</option>
                          <option value="Business">Business Blueprints</option>
                          <option value="Educational">Educational Monolith</option>
                          <option value="Festival">Festival Celebration</option>
                          <option value="Motivational">Motivational Peak</option>
                          <option value="Modern">Modern Chill</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-gray-500 block mb-1">Volume ({Math.floor(bgMusicVolume * 100)}%)</span>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={bgMusicVolume}
                          onChange={(e) => setBgMusicVolume(Number(e.target.value))}
                          className="w-full accent-[#F8B400] mt-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[8px]">
                      <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-black/40 border border-white/5">
                        <input
                          type="checkbox"
                          checked={bgMusicLoop}
                          onChange={(e) => setBgMusicLoop(e.target.checked)}
                          id="loop_m"
                          className="accent-[#F8B400]"
                        />
                        <label htmlFor="loop_m" className="text-gray-400 font-bold uppercase">Loop track</label>
                      </div>

                      <div className="flex flex-col justify-center">
                        <span className="text-gray-600 block">Fade In ({bgMusicFadeIn}s)</span>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={bgMusicFadeIn}
                          onChange={(e) => setBgMusicFadeIn(Number(e.target.value))}
                          className="w-full accent-[#F8B400] cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-col justify-center">
                        <span className="text-gray-600 block">Fade Out ({bgMusicFadeOut}s)</span>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          value={bgMusicFadeOut}
                          onChange={(e) => setBgMusicFadeOut(Number(e.target.value))}
                          className="w-full accent-[#F8B400] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT 4 COLUMNS: 10 SCENE CARDS LIST */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* PROJECT PARAMETERS */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#121212]/90 backdrop-blur-md space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark size={14} className="text-[#F8B400]" />
                  Project Setup Specs
                </h3>
              </div>

              <div className="space-y-3.5 text-[10px]">
                <div>
                  <label className="block text-gray-500 font-bold uppercase mb-1">Master Video Title</label>
                  <input
                    type="text"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="w-full bg-black border border-white/5 p-2 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#F8B400]/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 font-bold uppercase mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black border border-white/5 p-2 rounded-xl text-[10px] text-gray-300 outline-none cursor-pointer"
                    >
                      <option value="Promo">Promo Reel</option>
                      <option value="Ad">Product Advertisement</option>
                      <option value="Presentation">Business Pitch</option>
                      <option value="Educational">Educational Video</option>
                      <option value="Showcase">Luxury Showcase</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold uppercase mb-1">Visual Style</label>
                    <select
                      value={visualStyle}
                      onChange={(e) => setVisualStyle(e.target.value as any)}
                      className="w-full bg-black border border-white/5 p-2 rounded-xl text-[10px] text-gray-300 outline-none cursor-pointer"
                    >
                      <option value="Cinematic">Cinematic 3D</option>
                      <option value="Luxury">Luxury Enterprise</option>
                      <option value="Corporate">Corporate Minimal</option>
                      <option value="Creative">Creative Bold</option>
                      <option value="Modern">Modern Clean</option>
                    </select>
                  </div>
                </div>

                {/* Aspect ratio selector */}
                <div>
                  <label className="block text-gray-500 font-bold uppercase mb-1.5">Aspect Ratio Ratio</label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "16:9", label: "16:9 Landscape", icon: <Monitor size={11} /> },
                      { id: "9:16", label: "9:16 Portrait", icon: <Smartphone size={11} /> },
                      { id: "1:1", label: "1:1 Square", icon: <Square size={11} /> },
                      { id: "4:5", label: "4:5 Portrait", icon: <Square size={11} /> }
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        onClick={() => {
                          setAspectRatio(fmt.id as any);
                          triggerToast(`Aspect ratio synced to ${fmt.id}`, "info");
                        }}
                        className={`py-1.5 rounded-lg border text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                          aspectRatio === fmt.id
                            ? "border-[#F8B400] bg-[#F8B400]/5 text-[#F8B400]"
                            : "border-white/5 bg-[#090909] text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {fmt.icon}
                        <span className="text-[8px] font-black">{fmt.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Render Quality & Frame Rate toggles */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 font-bold uppercase mb-1.5">Render Resolution</label>
                    <div className="flex bg-black p-0.5 rounded-xl border border-white/5">
                      {["720P", "1080P", "2K", "4K"].map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuality(q as any)}
                          className={`flex-1 py-1 rounded text-[8px] font-black uppercase cursor-pointer ${
                            quality === q ? "bg-[#F8B400] text-black" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold uppercase mb-1.5">Frame rate (FPS)</label>
                    <div className="flex bg-black p-0.5 rounded-xl border border-white/5">
                      {["24", "30", "60"].map((fps) => (
                        <button
                          key={fps}
                          onClick={() => setFrameRate(fps as any)}
                          className={`flex-1 py-1 rounded text-[8px] font-black uppercase cursor-pointer ${
                            frameRate === fps ? "bg-[#F8B400] text-black" : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {fps} FPS
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main merge and render buttons */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <button
                    onClick={renderAllScenes}
                    disabled={isRenderingAll}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F8B400] to-[#FF9800] hover:from-[#FF9800] hover:to-[#FF5722] text-black font-extrabold text-[10px] tracking-wider uppercase transition-all shadow-[0_5px_15px_rgba(248,180,0,0.15)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRenderingAll ? (
                      <>
                        <RefreshCw size={12} className="animate-spin text-black" />
                        <span>Merging 10 Scenes... ({renderingProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        <span>Generate & Compile All Scenes</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-3 gap-1 text-[8px] font-bold uppercase">
                    <button
                      onClick={() => { setIsPlaying(false); triggerToast("Master Render Paused", "info"); }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-center cursor-pointer"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => { setIsPlaying(true); triggerToast("Master Render Resumed", "success"); }}
                      className="p-1.5 rounded-lg bg-[#F8B400]/10 hover:bg-[#F8B400]/25 text-[#F8B400] text-center cursor-pointer"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => { setIsPlaying(false); setPlayheadTime(0); triggerToast("Render pipeline cancelled", "warning"); }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-center cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* 10 SCENE PROMPT CARDS WORKSPACE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers size={14} className="text-[#F8B400]" />
                  10 Scene Workspace Deck
                </h3>
                <span className="text-[10px] font-mono text-gray-500">Fixed: 10s per Scene</span>
              </div>

              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                {scenes.map((scene, index) => {
                  const isSelected = selectedSceneIndex === index;
                  const isActive = index === activeSceneIndex;
                  return (
                    <div
                      key={scene.id}
                      className={`p-4 rounded-xl border transition-all space-y-3.5 relative overflow-hidden group ${
                        isSelected
                          ? "bg-gradient-to-br from-[#121212] to-[#1a160d] border-[#F8B400]/40 shadow-[0_4px_25px_rgba(248,180,0,0.06)]"
                          : "bg-[#121212]/50 border-white/5 hover:border-white/15"
                      } ${isActive ? "border-l-4 border-l-[#F8B400]" : ""}`}
                      onClick={() => setSelectedSceneIndex(index)}
                    >
                      
                      {/* Top status bar inside card */}
                      <div className="flex justify-between items-center text-[9px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-zinc-900 border border-white/10 flex items-center justify-center font-mono font-black text-white">
                            {scene.id < 10 ? "0" + scene.id : scene.id}
                          </span>
                          <span className="font-extrabold text-gray-200 uppercase tracking-wider">{scene.title}</span>
                        </div>

                        {/* Status Indicator badge */}
                        <div className="flex items-center gap-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            scene.status === "Completed" ? "bg-emerald-400" :
                            scene.status === "Rendering" ? "bg-amber-400 animate-pulse" : "bg-gray-600"
                          }`} />
                          <span className="font-mono text-[8px] text-gray-400 uppercase">{scene.status}</span>
                        </div>
                      </div>

                      {/* Prompt input field */}
                      <div>
                        <textarea
                          value={scene.prompt}
                          onChange={(e) => {
                            const val = e.target.value;
                            setScenes((prev) =>
                              prev.map((s) => (s.id === scene.id ? { ...s, prompt: val, status: "Draft" } : s))
                            );
                          }}
                          placeholder="Type scene prompt descriptions..."
                          rows={2}
                          className="w-full bg-black/60 border border-white/5 p-2 rounded-lg text-[10px] text-gray-300 outline-none resize-none leading-relaxed focus:border-[#F8B400]/30"
                        />
                        <div className="flex justify-between items-center text-[8px] text-gray-600 font-mono mt-1">
                          <span>Chars: {scene.prompt.length}/350</span>
                          <span>Est Duration: 10.0s</span>
                        </div>
                      </div>

                      {/* Reference Drag & Drop visual uploads */}
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
                        
                        {/* Reference Image slot */}
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropReferenceImage(e, scene.id)}
                          onClick={() => {
                            const mockFileName = `brand_reference_${scene.id}.png`;
                            setScenes((prev) =>
                              prev.map((s) =>
                                s.id === scene.id
                                  ? { ...s, hasImageRef: true, imageRefName: mockFileName, status: "Draft" }
                                  : s
                              )
                            );
                            triggerToast(`Simulated browse select: Attached ${mockFileName} to Scene ${scene.id}`, "success");
                          }}
                          className={`p-2 rounded-lg border-2 border-dashed text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            scene.hasImageRef
                              ? "border-[#F8B400]/40 bg-[#F8B400]/5 text-[#F8B400]"
                              : "border-white/5 bg-[#090909] hover:border-white/10 text-gray-500 hover:text-gray-400"
                          }`}
                          title="Click to select image or drag and drop here"
                        >
                          <UploadCloud size={11} />
                          <span className="truncate w-full text-center block max-w-[120px]">
                            {scene.hasImageRef ? scene.imageRefName : "Drop Image Ref"}
                          </span>
                        </div>

                        {/* Reference Video slot */}
                        <div
                          onClick={() => {
                            const mockVideoName = `cinematic_asset_${scene.id}.mp4`;
                            setScenes((prev) =>
                              prev.map((s) =>
                                s.id === scene.id
                                  ? { ...s, hasVideoRef: true, videoRefName: mockVideoName, status: "Draft" }
                                  : s
                              )
                            );
                            triggerToast(`Simulated video select: Attached ${mockVideoName} to Scene ${scene.id}`, "success");
                          }}
                          className={`p-2 rounded-lg border-2 border-dashed text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            scene.hasVideoRef
                              ? "border-[#F8B400]/40 bg-[#F8B400]/5 text-[#F8B400]"
                              : "border-white/5 bg-[#090909] hover:border-white/10 text-gray-500 hover:text-gray-400"
                          }`}
                        >
                          <Video size={11} />
                          <span className="truncate w-full text-center block max-w-[120px]">
                            {scene.hasVideoRef ? scene.videoRefName : "Attach Raw Video"}
                          </span>
                        </div>

                      </div>

                      {/* Scene quick preview & generate controls */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                        <button
                          onClick={() => {
                            setPlayheadTime((scene.id - 1) * 10);
                            setIsPlaying(false);
                            triggerToast(`Playhead jumped to Scene ${scene.id}`, "info");
                          }}
                          className="px-2 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white flex items-center gap-1 transition-all text-[8px] uppercase font-black cursor-pointer"
                        >
                          <Eye size={10} />
                          Preview scene
                        </button>

                        <button
                          onClick={() => renderSingleScene(scene.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#F8B400]/10 hover:bg-[#F8B400] text-[#F8B400] hover:text-black border border-[#F8B400]/20 font-extrabold text-[8px] uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw size={9} />
                          Generate Scene
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* DIRECT EXPORT & PACKAGING BOX */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#121212]/90 backdrop-blur-md space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Download size={14} className="text-[#F8B400]" />
                  Direct Studio Export Control
                </h3>
              </div>

              <div className="space-y-3 text-[10px]">
                <div className="grid grid-cols-3 gap-2">
                  {["MP4", "MOV", "AVI"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExportFinishedVideo(fmt)}
                      className="p-2 rounded-xl bg-zinc-950 border border-white/5 hover:border-[#F8B400]/30 hover:bg-[#15120a] text-gray-300 hover:text-[#F8B400] text-[10px] font-mono font-extrabold tracking-wider transition-all cursor-pointer"
                    >
                      Export {fmt}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProject}
                    className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-extrabold uppercase text-[9px] tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save size={12} />
                    Save Project Structure
                  </button>
                  <button
                    onClick={() => triggerToast("Project share link copied to clipboard!", "success")}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white cursor-pointer"
                    title="Share project"
                  >
                    <Share2 size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* SIDEBAR DRAFTS & EXPORTS */}
            <div className="p-5 rounded-2xl border border-white/5 bg-[#121212]/90 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Saved Content Archives</h3>
              
              <div className="space-y-3.5">
                {/* Recent Exports */}
                <div>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Recent Exports</span>
                  <div className="space-y-2">
                    {recentVideos.map((vid) => (
                      <div key={vid.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-200 truncate">{vid.title}</p>
                          <span className="text-[8px] font-mono text-gray-600">{vid.aspect} • {vid.quality} • {vid.date}</span>
                        </div>
                        <button
                          onClick={() => triggerToast(`Downloading compressed ${vid.title}...`, "info")}
                          className="p-1.5 rounded-lg bg-zinc-900 text-gray-400 hover:text-[#F8B400] transition-colors cursor-pointer"
                        >
                          <Download size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saved Projects */}
                <div>
                  <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Saved Projects</span>
                  <div className="space-y-2">
                    {savedProjects.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-200 truncate">{p.title}</p>
                          <span className="text-[8px] font-mono text-gray-600">{p.scenes} Scene prompt deck • Edited {p.edited}</span>
                        </div>
                        <button
                          onClick={() => {
                            setVideoTitle(p.title);
                            triggerToast(`Loaded project structure: ${p.title}`, "success");
                          }}
                          className="p-1.5 rounded-lg bg-[#F8B400]/5 text-[#F8B400] text-[8px] font-extrabold uppercase hover:bg-[#F8B400] hover:text-black transition-all cursor-pointer"
                        >
                          Load
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ─── ADMIN DASHBOARD TAB ─── */
        <div className="p-6 rounded-2xl border border-white/5 bg-[#121212]/90 backdrop-blur-md space-y-8 z-10 relative animate-fade-in">
          
          <div className="border-b border-white/5 pb-4 flex justify-between items-start gap-4">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Settings size={18} className="text-[#F8B400]" />
                Video Engine Admin Control Room
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Oversee production queues, configure watermark, allocate user credits, analyze load, and test visual settings.
              </p>
            </div>

            <span className="px-2.5 py-1 rounded bg-[#F8B400]/10 border border-[#F8B400]/30 text-[#F8B400] font-mono font-black text-[9px] uppercase">
              Admin Mode Enabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* COLUMN 1: QUEUE MANAGER & ENGINE TOGGLE */}
            <div className="space-y-6">
              
              {/* Generation Engine Toggle */}
              <div className="p-5 rounded-xl border border-white/5 bg-[#090909] space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-300 flex items-center gap-1.5">
                  <Activity size={13} className="text-[#F8B400]" />
                  Engine State
                </h4>

                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-gray-400">Rendering Service</span>
                  <button
                    onClick={() => {
                      setAdminEngineActive(!adminEngineActive);
                      triggerToast(adminEngineActive ? "Rendering Engine Stopped" : "Rendering Engine Online", "info");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-extrabold uppercase tracking-widest cursor-pointer ${
                      adminEngineActive
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {adminEngineActive ? "● System Active" : "■ Paused"}
                  </button>
                </div>

                <div className="space-y-2 text-[10px]">
                  <span className="text-gray-500 block">Render Speed Multiplier ({adminSpeedMultiplier}x)</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={adminSpeedMultiplier}
                      onChange={(e) => setAdminSpeedMultiplier(Number(e.target.value))}
                      className="w-full accent-[#F8B400] cursor-pointer"
                    />
                    <span className="font-mono font-bold text-white">{adminSpeedMultiplier}x</span>
                  </div>
                </div>
              </div>

              {/* Rendering queue manager */}
              <div className="p-5 rounded-xl border border-white/5 bg-[#090909] space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-300 flex items-center justify-between">
                  <span>Rendering Queue</span>
                  <span className="font-mono text-[9px] text-[#F8B400]">{queueList.length} Tasks active</span>
                </h4>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {queueList.map((q) => (
                    <div key={q.id} className="p-2.5 rounded bg-black/40 border border-white/5 text-[10px] space-y-1.5">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-200 truncate max-w-[120px]">{q.name}</span>
                        <span className="text-[#F8B400] font-mono">{q.progress}%</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded overflow-hidden">
                        <div className="h-full bg-[#F8B400]" style={{ width: `${q.progress}%` }} />
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 block">Task Owner: {q.owner}</span>
                    </div>
                  ))}

                  {queueList.length === 0 && (
                    <div className="text-center py-6 text-[10px] text-gray-600">
                      Queue list clean. Launch scenes to trigger.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* COLUMN 2: CREDITS ALLOCATOR & SYSTEM LIMITS */}
            <div className="space-y-6">
              
              {/* Credit allocators */}
              <div className="p-5 rounded-xl border border-white/5 bg-[#090909] space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-300 flex items-center gap-1.5">
                  <Bookmark size={13} className="text-[#F8B400]" />
                  User Credits Allocation
                </h4>

                <div className="space-y-3 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Active User:</span>
                    <strong className="text-gray-200">aftabkhan9826649794</strong>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-2">
                    <span className="text-gray-500">Credits Balance:</span>
                    <strong className="text-[#F8B400] font-mono">{adminCredits} / {adminCreditsMax}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[9px] font-black uppercase">
                    <button
                      onClick={() => {
                        setAdminCredits(500);
                        triggerToast("Credits fully recharged successfully!", "success");
                      }}
                      className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center cursor-pointer"
                    >
                      Recharge credits
                    </button>
                    <button
                      onClick={() => {
                        setAdminCredits(10);
                        triggerToast("Credits drained for testing.", "warning");
                      }}
                      className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-center cursor-pointer"
                    >
                      Drain credits
                    </button>
                  </div>
                </div>
              </div>

              {/* System resource monitors */}
              <div className="p-5 rounded-xl border border-white/5 bg-[#090909] space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-300 flex items-center gap-1.5">
                  <Gauge size={13} className="text-[#F8B400]" />
                  Render Farm Resources (Live GPU/CPU)
                </h4>

                <div className="space-y-4 text-[10px]">
                  {/* GPU Load */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">GPU Core Farm Cluster</span>
                      <span className={`${gpuLoad > 80 ? "text-red-400" : "text-[#F8B400]"}`}>{gpuLoad}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${gpuLoad > 80 ? "bg-red-500" : "bg-[#F8B400]"}`} 
                        style={{ width: `${gpuLoad}%` }}
                      />
                    </div>
                  </div>

                  {/* CPU Load */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">Xeon Processing Grid</span>
                      <span className={`${cpuLoad > 80 ? "text-red-400" : "text-emerald-400"}`}>{cpuLoad}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${cpuLoad > 80 ? "bg-red-500" : "bg-emerald-400"}`} 
                        style={{ width: `${cpuLoad}%` }}
                      />
                    </div>
                  </div>

                  {/* Daily creator usage limits */}
                  <div className="space-y-2 border-t border-white/5 pt-3">
                    <span className="text-gray-500 block mb-1">Daily Creative Creator Usage Limit</span>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Limit Cap:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={adminDailyUsageLimit}
                          onChange={(e) => setAdminDailyUsageLimit(Number(e.target.value))}
                          className="w-12 bg-black border border-white/10 text-center p-1 rounded font-mono text-[#F8B400]"
                        />
                        <span>Videos/Day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* COLUMN 3: WATERMARK & BRAND SYNCHRONIZER */}
            <div className="space-y-6">
              
              {/* Watermark controls */}
              <div className="p-5 rounded-xl border border-white/5 bg-[#090909] space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-300 flex items-center gap-1.5">
                  <ShieldAlert size={13} className="text-[#F8B400]" />
                  Corporate Security Watermark
                </h4>

                <div className="space-y-3.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <label htmlFor="w_active" className="text-gray-500 font-bold uppercase cursor-pointer">Inject Watermark</label>
                    <input
                      type="checkbox"
                      checked={enableWatermark}
                      onChange={(e) => setEnableWatermark(e.target.checked)}
                      id="w_active"
                      className="accent-[#F8B400] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold uppercase mb-1">Corporate Text String</label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-black border border-white/5 p-2 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-500 font-bold uppercase mb-1">Anchor Position</label>
                    <select
                      value={watermarkPosition}
                      onChange={(e) => setWatermarkPosition(e.target.value)}
                      className="w-full bg-black border border-white/5 p-2 rounded-lg text-gray-300 cursor-pointer"
                    >
                      <option value="top-left">Top Left Corner</option>
                      <option value="top-right">Top Right Corner</option>
                      <option value="bottom-left">Bottom Left Corner</option>
                      <option value="bottom-right">Bottom Right Corner</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Brand Settings Alignment status */}
              <div className="p-5 rounded-xl border border-[#F8B400]/20 bg-gradient-to-br from-[#090909] to-[#121008] space-y-4">
                <h4 className="text-xs font-black uppercase text-[#F8B400] flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Brand Identity Connection
                </h4>

                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Video Production Studio is actively aligned with the parent Brick-Maker Brand Preset Kit. Colors, logos, and typography scale perfectly inside overlays.
                </p>

                <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-2 text-[9px] font-mono">
                  <div className="flex justify-between text-gray-400">
                    <span>Accent Primary:</span>
                    <span className="text-[#F8B400]">#F8B400</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Font Preference:</span>
                    <span>Outfit Sans</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Sync complete alert */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#F8B400]/5 border border-[#F8B400]/20 text-xs">
            <Info size={16} className="text-[#F8B400] flex-shrink-0" />
            <p className="text-gray-400">
              <strong className="text-white uppercase font-black">Corporate Sync Active:</strong> All changes made here immediately affect rendering behaviors on the Production room dashboard layout.
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
