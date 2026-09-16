"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Edit,
  ExternalLink,
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  FileUp,
  Filter,
  GraduationCap,
  Headphones,
  Layers,
  Link as LinkIcon,
  Loader2,
  Phone,
  Play,
  Plus,
  Presentation,
  Printer,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Upload,
  User,
  UserCheck,
  Users,
  Video,
  Volume2,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  StoredTrainingCourse,
  StoredTrainer,
  StoredTrainingMaterial
} from "@/lib/db-store";
import { exportTrainings, exportTrainers, exportToCsv, printSection } from "@/lib/export-utils";

export function TrainingManagementStudio({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"courses" | "trainers" | "materials">("courses");

  // State
  const [trainings, setTrainings] = useState<StoredTrainingCourse[]>([]);
  const [trainers, setTrainers] = useState<StoredTrainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Course Modal (Create / Edit)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<StoredTrainingCourse | null>(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseLevel, setCourseLevel] = useState<"BASIC" | "ADVANCED" | "SYSTEM" | "LEADERSHIP">("BASIC");
  const [courseCategory, setCourseCategory] = useState("Prospecting & Launch");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseDuration, setCourseDuration] = useState<number>(25);
  const [courseFormat, setCourseFormat] = useState<"VIDEO" | "AUDIO" | "PPT" | "HYBRID">("VIDEO");
  const [courseMediaUrl, setCourseMediaUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [courseTrainerId, setCourseTrainerId] = useState("");
  const [courseCohortTime, setCourseCohortTime] = useState("Tonight at 8:00 PM (Equal Time)");

  // Trainer Modal (Create / Edit)
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<StoredTrainer | null>(null);
  const [trainerName, setTrainerName] = useState("");
  const [trainerEmail, setTrainerEmail] = useState("");
  const [trainerPhone, setTrainerPhone] = useState("+251 911 ");
  const [trainerSpecialization, setTrainerSpecialization] = useState("");
  const [trainerBio, setTrainerBio] = useState("");

  // Assign Trainer Quick Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetCourseId, setAssignTargetCourseId] = useState("");
  const [assignSelectedTrainerId, setAssignSelectedTrainerId] = useState("");

  // Materials Upload Modal
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [materialTargetCourseId, setMaterialTargetCourseId] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialType, setMaterialType] = useState<"PPT" | "PDF" | "AUDIO" | "VIDEO" | "DOC">("PPT");
  const [materialUrl, setMaterialUrl] = useState("");
  const [materialSize, setMaterialSize] = useState("4.2 MB");
  const [materialDesc, setMaterialDesc] = useState("");
  const [materialUploadMode, setMaterialUploadMode] = useState<"file" | "url">("file");
  const [selectedMaterialFile, setSelectedMaterialFile] = useState<File | null>(null);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  // Load Data
  async function loadData() {
    try {
      setIsLoading(true);
      const [trRes, tnrRes] = await Promise.all([
        fetch("/api/trainings"),
        fetch("/api/trainers")
      ]);
      const trData = await trRes.json();
      const tnrData = await tnrRes.json();

      if (trData?.data?.trainings) setTrainings(trData.data.trainings);
      if (tnrData?.data?.trainers) setTrainers(tnrData.data.trainers);
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ----------------------------------------------------
  // TRAINING CRUD HANDLERS
  // ----------------------------------------------------
  function openAddCourseModal() {
    setEditingCourse(null);
    setCourseTitle("");
    setCourseLevel("BASIC");
    setCourseCategory("Prospecting & Invitation");
    setCourseDescription("");
    setCourseDuration(25);
    setCourseFormat("VIDEO");
    setCourseMediaUrl("https://www.youtube.com/embed/dQw4w9WgXcQ");
    setCourseTrainerId(trainers[0]?.id || "");
    setCourseCohortTime("Tonight at 8:00 PM (Equal Time)");
    setIsCourseModalOpen(true);
  }

  function openEditCourseModal(c: StoredTrainingCourse) {
    setEditingCourse(c);
    setCourseTitle(c.title);
    setCourseLevel(c.level);
    setCourseCategory(c.category);
    setCourseDescription(c.description);
    setCourseDuration(c.durationMinutes);
    setCourseFormat(c.format);
    setCourseMediaUrl(c.mediaUrl || "");
    setCourseTrainerId(c.trainerId || "");
    setCourseCohortTime(c.cohortStartTime || "");
    setIsCourseModalOpen(true);
  }

  async function handleSaveCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    try {
      if (editingCourse) {
        const res = await fetch("/api/trainings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCourse.id,
            title: courseTitle.trim(),
            level: courseLevel,
            category: courseCategory.trim(),
            description: courseDescription.trim(),
            durationMinutes: Number(courseDuration),
            format: courseFormat,
            mediaUrl: courseMediaUrl.trim(),
            trainerId: courseTrainerId || undefined,
            cohortStartTime: courseCohortTime.trim()
          })
        });
        if (res.ok) {
          showToast("✅ Training course updated successfully!");
          setIsCourseModalOpen(false);
          loadData();
        }
      } else {
        const res = await fetch("/api/trainings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: courseTitle.trim(),
            level: courseLevel,
            category: courseCategory.trim(),
            description: courseDescription.trim(),
            durationMinutes: Number(courseDuration),
            format: courseFormat,
            mediaUrl: courseMediaUrl.trim(),
            trainerId: courseTrainerId || undefined,
            cohortStartTime: courseCohortTime.trim()
          })
        });
        if (res.ok) {
          showToast("✅ New training course published!");
          setIsCourseModalOpen(false);
          loadData();
        }
      }
    } catch {
      showToast("❌ Failed to save training course.");
    }
  }

  async function handleDeleteCourse(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete training course: ${title}?`)) return;
    try {
      const res = await fetch(`/api/trainings?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ Training course removed.");
        loadData();
      }
    } catch {
      showToast("❌ Failed to delete course.");
    }
  }

  // ----------------------------------------------------
  // TRAINERS MANAGEMENT HANDLERS
  // ----------------------------------------------------
  function openAddTrainerModal() {
    setEditingTrainer(null);
    setTrainerName("");
    setTrainerEmail("");
    setTrainerPhone("+251 911 ");
    setTrainerSpecialization("Eric Worre Duplication & Closing");
    setTrainerBio("");
    setIsTrainerModalOpen(true);
  }

  function openEditTrainerModal(t: StoredTrainer) {
    setEditingTrainer(t);
    setTrainerName(t.name);
    setTrainerEmail(t.email);
    setTrainerPhone(t.phone);
    setTrainerSpecialization(t.specialization);
    setTrainerBio(t.bio);
    setIsTrainerModalOpen(true);
  }

  async function handleSaveTrainer(e: React.FormEvent) {
    e.preventDefault();
    if (!trainerName.trim() || !trainerEmail.trim()) return;

    try {
      if (editingTrainer) {
        const res = await fetch("/api/trainers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingTrainer.id,
            name: trainerName.trim(),
            email: trainerEmail.trim(),
            phone: trainerPhone.trim(),
            specialization: trainerSpecialization.trim(),
            bio: trainerBio.trim()
          })
        });
        if (res.ok) {
          showToast("✅ Trainer profile updated!");
          setIsTrainerModalOpen(false);
          loadData();
        }
      } else {
        const res = await fetch("/api/trainers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: trainerName.trim(),
            email: trainerEmail.trim(),
            phone: trainerPhone.trim(),
            specialization: trainerSpecialization.trim(),
            bio: trainerBio.trim()
          })
        });
        if (res.ok) {
          showToast("✅ New Master Trainer added to faculty!");
          setIsTrainerModalOpen(false);
          loadData();
        }
      }
    } catch {
      showToast("❌ Failed to save trainer.");
    }
  }

  async function handleAssignTrainer(e: React.FormEvent) {
    e.preventDefault();
    if (!assignTargetCourseId || !assignSelectedTrainerId) return;

    try {
      const res = await fetch("/api/trainers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainingId: assignTargetCourseId,
          trainerId: assignSelectedTrainerId
        })
      });
      if (res.ok) {
        showToast("🎯 Trainer successfully assigned to course!");
        setIsAssignModalOpen(false);
        loadData();
      }
    } catch {
      showToast("❌ Failed to assign trainer.");
    }
  }

  // ----------------------------------------------------
  // MATERIALS UPLOAD HANDLERS
  // ----------------------------------------------------
  function openMaterialUploadModal(courseId?: string) {
    setMaterialTargetCourseId(courseId || trainings[0]?.id || "");
    setMaterialName("");
    setMaterialType("PPT");
    setMaterialUrl("");
    setMaterialSize("");
    setMaterialDesc("");
    setMaterialUploadMode("file");
    setSelectedMaterialFile(null);
    setIsFileUploading(false);
    setIsMaterialModalOpen(true);
  }

  function handleMaterialFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedMaterialFile(file);
    if (!materialName.trim()) {
      setMaterialName(file.name);
    }

    // Auto-calculate size
    if (file.size < 1024 * 1024) {
      setMaterialSize(`${(file.size / 1024).toFixed(1)} KB`);
    } else {
      setMaterialSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }

    // Auto-detect format type
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (["ppt", "pptx"].includes(ext)) {
      setMaterialType("PPT");
    } else if (["pdf"].includes(ext)) {
      setMaterialType("PDF");
    } else if (["mp3", "wav", "aac", "m4a", "ogg"].includes(ext)) {
      setMaterialType("AUDIO");
    } else if (["mp4", "mov", "webm", "avi", "mkv"].includes(ext)) {
      setMaterialType("VIDEO");
    } else if (["doc", "docx", "txt", "rtf"].includes(ext)) {
      setMaterialType("DOC");
    }

    // Read file content as Data URL
    setIsFileUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setMaterialUrl(dataUrl);
      setIsFileUploading(false);
      showToast(`📎 File loaded: ${file.name}`);
    };
    reader.onerror = () => {
      setIsFileUploading(false);
      showToast("❌ Failed to read file.");
    };
    reader.readAsDataURL(file);
  }

  async function handleUploadMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!materialTargetCourseId || !materialName.trim()) return;

    if (materialUploadMode === "file" && !materialUrl && !selectedMaterialFile) {
      showToast("⚠️ Please select a file from your device first.");
      return;
    }

    if (isFileUploading) {
      showToast("⏳ Please wait for the file to finish loading...");
      return;
    }

    const finalUrl = materialUrl.trim() || `/materials/${materialName.trim().replace(/\s+/g, "_")}`;

    try {
      const res = await fetch("/api/trainings/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainingId: materialTargetCourseId,
          name: materialName.trim(),
          type: materialType,
          fileUrl: finalUrl,
          fileSize: materialSize.trim() || "3.5 MB",
          description: materialDesc.trim() || "Course learning material."
        })
      });
      if (res.ok) {
        showToast("📎 Material attached to training course successfully!");
        setIsMaterialModalOpen(false);
        loadData();
      } else {
        const errData = await res.json();
        showToast(`❌ ${errData?.message || "Failed to upload material"}`);
      }
    } catch {
      showToast("❌ Failed to upload material.");
    }
  }

  async function handleDeleteMaterial(courseId: string, materialId: string, name: string) {
    if (!confirm(`Delete material: ${name}?`)) return;
    try {
      const res = await fetch(`/api/trainings/materials?trainingId=${courseId}&materialId=${materialId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        showToast("🗑️ Material removed.");
        loadData();
      }
    } catch {
      showToast("❌ Failed to remove material.");
    }
  }

  // Filtered trainings
  const filteredTrainings = trainings.filter((t) => {
    const matchLevel = levelFilter === "ALL" || t.level === levelFilter;
    const matchQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.trainerName && t.trainerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchLevel && matchQuery;
  });

  // Flat materials list for Materials Tab
  const allMaterials = trainings.flatMap((t) =>
    (t.materials || []).map((m) => ({
      ...m,
      courseId: t.id,
      courseTitle: t.title,
      courseLevel: t.level
    }))
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 rounded-2xl bg-brand-navy border border-cyan-400 p-4 text-sm font-bold text-white shadow-2xl animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-deep to-[#0c316d] p-6 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-xs font-black tracking-wide text-cyan-300 uppercase backdrop-blur">
            <GraduationCap className="h-3.5 w-3.5" />
            Academy & Faculty Command Center
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
            Trainings, Trainers & Materials Management
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Full Super Admin control to <strong>CRUD Training Modules</strong>, <strong>Assign Faculty Trainers</strong>, and <strong>Upload Learning Materials</strong> (PPT Slides, Audio MP3, Video, PDFs).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              onOpenAi?.(
                `Analyze our training curriculum balance. We currently have ${trainings.length} modules, ${trainers.length} active master trainers, and ${allMaterials.length} course material assets. How can we optimize equal start time cohort completion and duplication retention?`
              )
            }
            className="brand-gradient font-black text-brand-navy shadow-lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Academy Architect
          </Button>

          {/* Export CSV based on active tab */}
          <Button
            onClick={() => {
              if (activeTab === "courses") {
                exportTrainings(trainings as any);
              } else if (activeTab === "trainers") {
                exportTrainers(trainers as any);
              } else {
                const rows = allMaterials.map((m) => ({
                  "Material Name": m.name,
                  "Format": m.type,
                  "Course": m.courseTitle,
                  "Level": m.courseLevel,
                  "File Size": m.fileSize,
                  "URL": m.fileUrl,
                  "Description": m.description,
                  "Added Date": m.uploadedAt
                }));
                exportToCsv(`MyUpline_CourseMaterials_${new Date().toISOString().slice(0, 10)}`, rows);
              }
            }}
            variant="ghost"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Export CSV
          </Button>

          {/* Print Tab */}
          <Button
            onClick={() => {
              const targetId =
                activeTab === "courses"
                  ? "training-courses-printable"
                  : activeTab === "trainers"
                  ? "training-trainers-printable"
                  : "training-materials-printable";
              const title =
                activeTab === "courses"
                  ? "Training Curriculum & Modules Directory"
                  : activeTab === "trainers"
                  ? "Faculty & Master Trainers Roster"
                  : "Curriculum Assets & Course Materials";
              printSection(targetId, title);
            }}
            variant="ghost"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <Printer className="h-4 w-4" />
          </Button>

          <Button
            onClick={loadData}
            variant="ghost"
            className="border border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("courses")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "courses"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Training Modules (CRUD)
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-black text-slate-700">
              {trainings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("trainers")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "trainers"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Users className="h-4 w-4" />
            Trainers & Faculty ({trainers.length})
          </button>

          <button
            onClick={() => setActiveTab("materials")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "materials"
                ? "brand-gradient text-brand-navy shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <Upload className="h-4 w-4" />
            Course Materials ({allMaterials.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "courses" && (
            <Button
              onClick={openAddCourseModal}
              className="brand-gradient font-black text-brand-navy text-xs"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Create Training Module
            </Button>
          )}

          {activeTab === "trainers" && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setAssignTargetCourseId(trainings[0]?.id || "");
                  setAssignSelectedTrainerId(trainers[0]?.id || "");
                  setIsAssignModalOpen(true);
                }}
                variant="ghost"
                className="border border-slate-300 text-xs font-bold text-slate-700"
              >
                <UserCheck className="mr-1.5 h-4 w-4 text-emerald-600" /> Assign to Course
              </Button>
              <Button
                onClick={openAddTrainerModal}
                className="brand-gradient font-black text-brand-navy text-xs"
              >
                <Plus className="mr-1.5 h-4 w-4" /> Add Master Trainer
              </Button>
            </div>
          )}

          {activeTab === "materials" && (
            <Button
              onClick={() => openMaterialUploadModal()}
              className="brand-gradient font-black text-brand-navy text-xs"
            >
              <Upload className="mr-1.5 h-4 w-4" /> Upload Material
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* TAB 1: TRAINING MODULES CRUD                               */}
      {/* ========================================================== */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search training title, category, or trainer..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
              {["ALL", "BASIC", "ADVANCED", "SYSTEM", "LEADERSHIP"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 transition",
                    levelFilter === lvl
                      ? "brand-gradient text-brand-navy font-black shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {lvl === "ALL" ? "All Levels" : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Training Cards Grid */}
          <div id="training-courses-printable" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTrainings.map((course) => {
              const isVideo = course.format === "VIDEO";
              const isAudio = course.format === "AUDIO";
              const isPpt = course.format === "PPT";

              return (
                <Card
                  key={course.id}
                  className="relative flex flex-col justify-between p-5 border-slate-200 bg-white shadow-sm hover:shadow-md transition"
                >
                  <div>
                    {/* Header level badge & duration */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
                          course.level === "BASIC" && "bg-cyan-100 text-cyan-900 border border-cyan-300",
                          course.level === "ADVANCED" && "bg-amber-100 text-amber-900 border border-amber-300",
                          course.level === "SYSTEM" && "bg-indigo-100 text-indigo-900 border border-indigo-300",
                          course.level === "LEADERSHIP" && "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        )}
                      >
                        {course.level}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{course.durationMinutes} min</span>
                      </div>
                    </div>

                    {/* Title & Category */}
                    <h3 className="mt-3 font-black text-brand-navy text-base leading-tight">
                      {course.title}
                    </h3>
                    <p className="text-[11px] font-bold text-cyan-700 mt-0.5">
                      {course.category}
                    </p>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Assigned Trainer & Format */}
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Assigned Trainer:</span>
                        <span className="font-bold text-brand-navy flex items-center gap-1">
                          <User className="h-3 w-3 text-cyan-600" />
                          {course.trainerName || "Unassigned"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Format / Media:</span>
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          {isVideo && <Video className="h-3 w-3 text-rose-500" />}
                          {isAudio && <Volume2 className="h-3 w-3 text-indigo-500" />}
                          {isPpt && <Presentation className="h-3 w-3 text-amber-500" />}
                          {course.format}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-200/60 pt-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Materials:</span>
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {course.materials?.length || 0} Attached Assets
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openMaterialUploadModal(course.id)}
                      className="h-8 text-[11px] font-bold text-cyan-700 hover:text-cyan-800 hover:bg-cyan-50"
                    >
                      <Upload className="mr-1 h-3.5 w-3.5" /> + Material
                    </Button>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditCourseModal(course)}
                        className="h-8 border border-slate-200 text-xs font-bold"
                      >
                        <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="h-8 border border-red-200 text-rose-600 hover:bg-red-50 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 2: ASSIGN TRAINERS & FACULTY                           */}
      {/* ========================================================== */}
      {activeTab === "trainers" && (
        <div className="space-y-4" id="training-trainers-printable">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((t) => (
              <Card
                key={t.id}
                className="p-5 border-slate-200 bg-white relative flex flex-col justify-between shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-100 text-brand-navy font-black text-lg">
                      {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-black text-amber-700">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {t.rating.toFixed(1)}
                    </div>
                  </div>

                  <h3 className="mt-3 font-black text-brand-navy text-base leading-snug">
                    {t.name}
                  </h3>
                  <p className="text-xs font-bold text-cyan-700 leading-tight mt-0.5">
                    {t.specialization}
                  </p>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {t.bio}
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-50 p-2.5 text-xs space-y-1 text-slate-600">
                    <p className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-mono">{t.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-cyan-600" />
                      <span className="font-bold text-brand-navy">
                        {trainings.filter((tr) => tr.trainerId === t.id).length} Active Courses
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAssignSelectedTrainerId(t.id);
                      setAssignTargetCourseId(trainings[0]?.id || "");
                      setIsAssignModalOpen(true);
                    }}
                    className="h-8 bg-cyan-50 text-brand-navy font-bold text-xs hover:bg-cyan-100"
                  >
                    Assign Course
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditTrainerModal(t)}
                    className="h-8 border border-slate-200 text-xs font-bold"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TAB 3: COURSE MATERIALS & UPLOADS                          */}
      {/* ========================================================== */}
      {activeTab === "materials" && (
        <div className="space-y-4">
          <Card id="training-materials-printable" className="overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">Material Name & Format</th>
                    <th className="px-4 py-3.5">Attached Training Course</th>
                    <th className="px-4 py-3.5">File Size</th>
                    <th className="px-4 py-3.5">Description</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allMaterials.map((mat) => {
                    const isPpt = mat.type === "PPT";
                    const isPdf = mat.type === "PDF";
                    const isAudio = mat.type === "AUDIO";

                    return (
                      <tr key={mat.id} className="hover:bg-slate-50/80 transition">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-xl",
                                isPpt && "bg-amber-100 text-amber-700",
                                isPdf && "bg-rose-100 text-rose-700",
                                isAudio && "bg-indigo-100 text-indigo-700"
                              )}
                            >
                              {isPpt && <Presentation className="h-4 w-4" />}
                              {isPdf && <FileText className="h-4 w-4" />}
                              {isAudio && <Volume2 className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-brand-navy">{mat.name}</p>
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-600">
                                {mat.type} File
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-800">{mat.courseTitle}</p>
                          <span className="text-[10px] font-bold text-cyan-600">{mat.courseLevel}</span>
                        </td>

                        <td className="px-4 py-4 font-mono font-bold text-slate-600">
                          {mat.fileSize}
                        </td>

                        <td className="px-4 py-4 text-slate-500 max-w-xs truncate">
                          {mat.description || "Course asset"}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={mat.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-brand-navy hover:bg-slate-100"
                            >
                              <Download className="h-3.5 w-3.5" /> Download
                            </a>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteMaterial(mat.courseId, mat.id, mat.name)}
                              className="h-8 border border-red-200 text-rose-600 hover:bg-red-50 text-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {allMaterials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        No learning materials uploaded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 1: ADD / EDIT TRAINING COURSE                        */}
      {/* ========================================================== */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-lg bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">
                {editingCourse ? "Edit Training Module" : "Create New Training Module"}
              </h3>
              <button
                onClick={() => setIsCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Course Title
                </label>
                <input
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Basic Training: 8-Step Invitation Protocol"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Level Tier
                  </label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="BASIC">Basic</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="SYSTEM">System</option>
                    <option value="LEADERSHIP">Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    required
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(Number(e.target.value))}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Format
                  </label>
                  <select
                    value={courseFormat}
                    onChange={(e) => setCourseFormat(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="VIDEO">Video Broadcast</option>
                    <option value="AUDIO">Audio Track</option>
                    <option value="PPT">PowerPoint Slides</option>
                    <option value="HYBRID">Hybrid Multi-Format</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Assign Faculty Trainer
                  </label>
                  <select
                    value={courseTrainerId}
                    onChange={(e) => setCourseTrainerId(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="">-- Select Master Trainer --</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Category / Competency
                </label>
                <input
                  required
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  placeholder="e.g. Closing, Mindset, Invitation, Compensation"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Video Embed / Stream URL
                </label>
                <input
                  value={courseMediaUrl}
                  onChange={(e) => setCourseMediaUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Cohort Equal Start Time
                </label>
                <input
                  value={courseCohortTime}
                  onChange={(e) => setCourseCohortTime(e.target.value)}
                  placeholder="e.g. Tonight at 8:00 PM (Equal Time)"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Description & Syllabus
                </label>
                <textarea
                  rows={3}
                  required
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Summary of skills taught in this training module..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCourseModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                  {editingCourse ? "Update Training" : "Publish Training"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 2: ADD / EDIT TRAINER PROFILE                        */}
      {/* ========================================================== */}
      {isTrainerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">
                {editingTrainer ? "Edit Master Trainer" : "Add Master Trainer to Faculty"}
              </h3>
              <button
                onClick={() => setIsTrainerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrainer} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Trainer Full Name
                </label>
                <input
                  required
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  placeholder="e.g. Coach Dawit Mengistu"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={trainerEmail}
                    onChange={(e) => setTrainerEmail(e.target.value)}
                    placeholder="coach@myupline.org"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Phone
                  </label>
                  <input
                    required
                    value={trainerPhone}
                    onChange={(e) => setTrainerPhone(e.target.value)}
                    placeholder="+251 911 ..."
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs font-mono outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Core Specialization
                </label>
                <input
                  required
                  value={trainerSpecialization}
                  onChange={(e) => setTrainerSpecialization(e.target.value)}
                  placeholder="e.g. Eric Worre Invitation & Closing Mastery"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Trainer Bio / Credentials
                </label>
                <textarea
                  rows={3}
                  required
                  value={trainerBio}
                  onChange={(e) => setTrainerBio(e.target.value)}
                  placeholder="Master trainer background, team rank, and experience..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTrainerModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                  {editingTrainer ? "Update Trainer" : "Register Trainer"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 3: QUICK ASSIGN TRAINER TO COURSE                    */}
      {/* ========================================================== */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-md bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-brand-navy">
                Assign Faculty Trainer
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTrainer} className="mt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Select Training Course
                </label>
                <select
                  value={assignTargetCourseId}
                  onChange={(e) => setAssignTargetCourseId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                >
                  {trainings.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.level}] {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Select Master Trainer
                </label>
                <select
                  value={assignSelectedTrainerId}
                  onChange={(e) => setAssignSelectedTrainerId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="brand-gradient font-bold text-brand-navy">
                  Confirm Assignment
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ========================================================== */}
      {/* MODAL 4: UPLOAD / ATTACH MATERIAL MODAL                    */}
      {/* ========================================================== */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm animate-in fade-in">
          <Card className="w-full max-w-lg bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-brand-navy">
                  Upload & Attach Learning Material
                </h3>
                <p className="text-xs text-slate-500">
                  Upload slides, audio recordings, video lectures, or reference PDFs
                </p>
              </div>
              <button
                onClick={() => setIsMaterialModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Source Mode Switcher: Device File vs Cloud URL */}
            <div className="mt-4 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setMaterialUploadMode("file")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition",
                  materialUploadMode === "file"
                    ? "brand-gradient text-brand-navy shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                Upload File from Device
              </button>
              <button
                type="button"
                onClick={() => setMaterialUploadMode("url")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition",
                  materialUploadMode === "url"
                    ? "brand-gradient text-brand-navy shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <LinkIcon className="h-3.5 w-3.5" />
                External URL / Web Link
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="mt-4 space-y-3.5">
              {/* File Upload Drag & Drop Zone */}
              {materialUploadMode === "file" ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1.5">
                    Select File to Upload
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleMaterialFileSelect}
                    accept=".ppt,.pptx,.pdf,.doc,.docx,.mp3,.wav,.aac,.m4a,.mp4,.mov,.webm,.zip"
                    className="hidden"
                  />

                  {selectedMaterialFile ? (
                    <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50/50 p-4 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white font-black">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-brand-navy line-clamp-1">
                              {selectedMaterialFile.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                              <span className="font-mono font-bold text-emerald-700">{materialSize}</span>
                              <span>•</span>
                              <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.2 text-[10px] font-bold">
                                {materialType}
                              </span>
                              {isFileUploading && (
                                <span className="flex items-center gap-1 text-brand-blue font-semibold">
                                  <Loader2 className="h-3 w-3 animate-spin" /> Loading file...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                        >
                          Change
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer rounded-xl border-2 border-dashed border-cyan-400/60 bg-gradient-to-b from-cyan-50/40 to-white p-6 text-center transition hover:border-cyan-500 hover:bg-cyan-50/70"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-brand-blue">
                        <Upload className="h-6 w-6 text-brand-blue" />
                      </div>
                      <p className="mt-3 text-xs font-black text-brand-navy">
                        Click to browse or drop file here
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Supports PowerPoint (.pptx), PDF, Audio (.mp3), Video (.mp4), Word (.docx)
                      </p>
                      <div className="mt-3 flex flex-wrap justify-center gap-1.5 text-[10px] font-bold">
                        <span className="rounded-md bg-amber-100 text-amber-900 px-2 py-0.5">PPT / Slides</span>
                        <span className="rounded-md bg-rose-100 text-rose-900 px-2 py-0.5">PDF</span>
                        <span className="rounded-md bg-indigo-100 text-indigo-900 px-2 py-0.5">Audio MP3</span>
                        <span className="rounded-md bg-emerald-100 text-emerald-900 px-2 py-0.5">Video MP4</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Download / File URL
                  </label>
                  <div className="relative">
                    <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      value={materialUrl}
                      onChange={(e) => setMaterialUrl(e.target.value)}
                      placeholder="https://example.com/materials/presentation.pdf"
                      className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* Target Course Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Target Course
                </label>
                <select
                  value={materialTargetCourseId}
                  onChange={(e) => setMaterialTargetCourseId(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                >
                  {trainings.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.level}] {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Material Title / Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Material Title / File Display Name
                </label>
                <input
                  required
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  placeholder="e.g. 8Step_Invitation_Master_Slides.pptx"
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              {/* Format & Size Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Material Format
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value as any)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-cyan-400"
                  >
                    <option value="PPT">PowerPoint (.pptx)</option>
                    <option value="PDF">PDF Document (.pdf)</option>
                    <option value="AUDIO">Audio MP3 (.mp3)</option>
                    <option value="VIDEO">Video MP4 (.mp4)</option>
                    <option value="DOC">Word / Doc (.docx)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    File Size
                  </label>
                  <input
                    value={materialSize}
                    onChange={(e) => setMaterialSize(e.target.value)}
                    placeholder="e.g. 4.5 MB"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Instructions / Description
                </label>
                <textarea
                  rows={2}
                  value={materialDesc}
                  onChange={(e) => setMaterialDesc(e.target.value)}
                  placeholder="How IBOs should use this presentation deck or audio recording..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-cyan-400"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMaterialModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isFileUploading}
                  className="brand-gradient font-bold text-brand-navy shadow-sm"
                >
                  {isFileUploading ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-1.5 h-3.5 w-3.5" /> Attach to Course
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
