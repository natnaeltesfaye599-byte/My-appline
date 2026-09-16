"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  Key,
  Eye,
  EyeOff,
  Shield,
  BookOpen,
  Search,
  Filter,
  Download,
  Printer,
  Sparkles,
  Phone,
  Mail,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  Share2,
  Lock,
  RefreshCw,
  Building2,
  Crown,
  MapPin,
  Palette,
  ChevronRight,
  UserMinus,
  UserPlus,
  Globe
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportToCsv, printSection } from "@/lib/export-utils";

export interface TrainerEntity {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  bio: string;
  rating: number;
  assignedCoursesCount: number;
  isActive: boolean;
  teamAssigned?: string;
  assignedTrainings?: string[];
  rawPassword?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberEntity {
  user: {
    id: string;
    email: string;
    phone: string | null;
    fullName: string | null;
    role: string;
    createdAt: string;
  };
  profile: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    status: string;
    rank: string | null;
    referralCode: string;
    packageType?: string | null;
    teamName?: string | null;
    assignedTrainings?: string[];
    rawPassword?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CourseOption {
  id: string;
  title: string;
  level: string;
  durationMinutes: number;
}

const DEFAULT_TEAMS = [
  "Diamond Leadership Council",
  "Addis Pioneers Squad",
  "Hawassa Eagle Squad",
  "Bahir Dar Champions",
  "Trainers Faculty",
  "Fast-Track 48h Launch Cohort",
  "Mekelle Alpha Builders"
];

const PACKAGES_LIST = [
  "Diamond Leader",
  "Gold Executive",
  "Silver Associate",
  "Bronze Starter"
];

export function TeamFacultyStudio({
  onOpenAi
}: {
  onOpenAi?: (prompt: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"TRAINERS" | "MEMBERS" | "TEAMS">("TRAINERS");
  const [trainers, setTrainers] = useState<TrainerEntity[]>([]);
  const [members, setMembers] = useState<MemberEntity[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Teams
  const [teams, setTeams] = useState<{
    id: string; name: string; description?: string;
    leaderId?: string; leaderName?: string; leaderEmail?: string;
    color?: string; memberIds: string[]; memberCount: number;
    region?: string; isActive: boolean; createdAt: string;
  }[]>([]);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<typeof teams[0] | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<MemberEntity[]>([]);
  const [teamMemberLoading, setTeamMemberLoading] = useState(false);
  const [addMemberQuery, setAddMemberQuery] = useState("");
  // Team form state
  const [tmName, setTmName] = useState("");
  const [tmDescription, setTmDescription] = useState("");
  const [tmLeaderName, setTmLeaderName] = useState("");
  const [tmLeaderEmail, setTmLeaderEmail] = useState("");
  const [tmColor, setTmColor] = useState("#6366f1");
  const [tmRegion, setTmRegion] = useState("");

  // Filters
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberTeamFilter, setMemberTeamFilter] = useState("ALL");
  const [memberRankFilter, setMemberRankFilter] = useState("ALL");
  const [trainerSearchQuery, setTrainerSearchQuery] = useState("");

  // Credentials visibility toggle map
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [trainerModalOpen, setTrainerModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<TrainerEntity | null>(null);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberEntity | null>(null);

  const [credentialsModalData, setCredentialsModalData] = useState<{
    name: string;
    email: string;
    password?: string;
    role: string;
    team?: string;
    assignedTrainings?: string[];
  } | null>(null);

  // Trainer Form State
  const [tName, setTName] = useState("");
  const [tEmail, setTEmail] = useState("");
  const [tPhone, setTPhone] = useState("");
  const [tSpecialization, setTSpecialization] = useState("");
  const [tBio, setTBio] = useState("");
  const [tTeam, setTTeam] = useState(DEFAULT_TEAMS[4]); // Trainers Faculty
  const [tAssignedCourses, setTAssignedCourses] = useState<string[]>([]);
  const [tPassword, setTPassword] = useState("Trainer@2026");

  // Member Form State
  const [mFullName, setMFullName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mRole, setMRole] = useState<string>("MEMBER");
  const [mRank, setMRank] = useState("Starter IBO");
  const [mPackage, setMPackage] = useState("Bronze Starter");
  const [mTeam, setMTeam] = useState(DEFAULT_TEAMS[1]); // Addis Pioneers
  const [mAssignedCourses, setMAssignedCourses] = useState<string[]>([]);
  const [mPassword, setMPassword] = useState("Member@2026");
  const [mStatus, setMStatus] = useState("ACTIVE");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [trainersRes, membersRes, trainingsRes, teamsRes] = await Promise.all([
        fetch("/api/trainers"),
        fetch("/api/members"),
        fetch("/api/trainings"),
        fetch("/api/teams")
      ]);

      if (trainersRes.ok) {
        const tJson = await trainersRes.json();
        setTrainers(tJson.data?.trainers || []);
      }
      if (membersRes.ok) {
        const mJson = await membersRes.json();
        setMembers(mJson.data?.members || []);
      }
      if (trainingsRes.ok) {
        const trJson = await trainingsRes.json();
        setCourses(trJson.data?.trainings || []);
      }
      if (teamsRes.ok) {
        const tmJson = await teamsRes.json();
        setTeams(tmJson.data?.teams || []);
      }
    } catch (err) {
      console.error("Failed to load team and trainers data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Password Generator
  const generateRandomPassword = (prefix = "Pass") => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let rand = "";
    for (let i = 0; i < 4; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}@${rand}!`;
  };

  // Copy Credentials
  const copyCredentials = (name: string, email: string, pass?: string, role = "MEMBER", team = "MyUpline") => {
    const formatted = `🌟 MyUpline Official Credentials 🌟\n` +
      `-----------------------------------------\n` +
      `👤 Member / Trainer: ${name}\n` +
      `🔑 Role: ${role}\n` +
      `👥 Assigned Team: ${team}\n` +
      `📧 Login Email: ${email}\n` +
      `🔒 Temporary Password: ${pass || "Member@2026"}\n` +
      `🌐 Portal Link: ${window.location.origin}/en/auth/sign-in\n` +
      `-----------------------------------------\n` +
      `Please log in and update your password immediately.`;

    navigator.clipboard.writeText(formatted);
    setCopiedKey(email);
    setTimeout(() => setCopiedKey(null), 2500);
    showToast(`Credentials for ${name} copied to clipboard!`);
  };

  // ----------------------------------------------------
  // TRAINER ACTIONS
  // ----------------------------------------------------
  const handleOpenCreateTrainer = () => {
    setEditingTrainer(null);
    setTName("");
    setTEmail("");
    setTPhone("+251 9");
    setTSpecialization("Leadership & Duplication");
    setTBio("Certified senior trainer with deep network marketing expertise.");
    setTTeam("Trainers Faculty");
    setTAssignedCourses(courses.slice(0, 1).map((c) => c.id));
    setTPassword(generateRandomPassword("Trainer"));
    setTrainerModalOpen(true);
  };

  const handleOpenEditTrainer = (trainer: TrainerEntity) => {
    setEditingTrainer(trainer);
    setTName(trainer.name);
    setTEmail(trainer.email);
    setTPhone(trainer.phone);
    setTSpecialization(trainer.specialization);
    setTBio(trainer.bio);
    setTTeam(trainer.teamAssigned || "Trainers Faculty");
    setTAssignedCourses(trainer.assignedTrainings || []);
    setTPassword(trainer.rawPassword || "Trainer@2026");
    setTrainerModalOpen(true);
  };

  const handleSaveTrainer = async () => {
    if (!tName.trim() || !tEmail.trim() || !tPhone.trim()) {
      alert("Name, email, and phone are required.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      name: tName.trim(),
      email: tEmail.trim(),
      phone: tPhone.trim(),
      specialization: tSpecialization.trim(),
      bio: tBio.trim(),
      teamAssigned: tTeam,
      assignedTrainings: tAssignedCourses,
      password: tPassword.trim()
    };

    try {
      if (editingTrainer) {
        const res = await fetch("/api/trainers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTrainer.id, ...payload })
        });
        if (res.ok) {
          const json = await res.json();
          setTrainers((prev) =>
            prev.map((t) => (t.id === editingTrainer.id ? json.data.trainer : t))
          );
          setTrainerModalOpen(false);
          showToast(`Trainer ${tName} updated with new credentials & assignments!`);
        }
      } else {
        const res = await fetch("/api/trainers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          setTrainers((prev) => [json.data.trainer, ...prev]);
          setTrainerModalOpen(false);
          setCredentialsModalData({
            name: tName,
            email: tEmail,
            password: tPassword,
            role: "TRAINER",
            team: tTeam,
            assignedTrainings: tAssignedCourses
          });
          showToast(`Trainer ${tName} created and account credentials activated!`);
        }
      }
    } catch (err) {
      alert("Failed to save trainer: " + String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTrainer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove trainer "${name}"?`)) return;
    try {
      const res = await fetch(`/api/trainers?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTrainers((prev) => prev.filter((t) => t.id !== id));
        showToast(`Trainer ${name} removed.`);
      }
    } catch {
      alert("Failed to delete trainer.");
    }
  };

  // ----------------------------------------------------
  // MEMBER ACTIONS
  // ----------------------------------------------------
  const handleOpenCreateMember = () => {
    setEditingMember(null);
    setMFullName("");
    setMEmail("");
    setMPhone("+251 9");
    setMRole("MEMBER");
    setMRank("Starter IBO");
    setMPackage("Silver Associate");
    setMTeam(DEFAULT_TEAMS[1]);
    setMAssignedCourses(courses.slice(0, 1).map((c) => c.id));
    setMPassword(generateRandomPassword("Member"));
    setMStatus("ACTIVE");
    setMemberModalOpen(true);
  };

  const handleOpenEditMember = (m: MemberEntity) => {
    setEditingMember(m);
    setMFullName(m.user.fullName || `${m.profile.firstName} ${m.profile.lastName}`);
    setMEmail(m.user.email);
    setMPhone(m.user.phone || m.profile.phone || "+251 9");
    setMRole(m.user.role);
    setMRank(m.profile.rank || "Starter IBO");
    setMPackage(m.profile.packageType || "Silver Associate");
    setMTeam(m.profile.teamName || DEFAULT_TEAMS[1]);
    setMAssignedCourses(m.profile.assignedTrainings || []);
    setMPassword(m.profile.rawPassword || "Member@2026");
    setMStatus(m.profile.status);
    setMemberModalOpen(true);
  };

  const handleSaveMember = async () => {
    if (!mFullName.trim() || !mEmail.trim()) {
      alert("Full name and email are required.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      fullName: mFullName.trim(),
      email: mEmail.trim(),
      phone: mPhone.trim(),
      role: mRole,
      rank: mRank,
      packageType: mPackage,
      teamName: mTeam,
      assignedTrainings: mAssignedCourses,
      password: mPassword.trim(),
      status: mStatus
    };

    try {
      if (editingMember) {
        const res = await fetch("/api/members", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editingMember.user.id, ...payload })
        });
        if (res.ok) {
          const json = await res.json();
          setMembers((prev) =>
            prev.map((m) => (m.user.id === editingMember.user.id ? json.data.member : m))
          );
          setMemberModalOpen(false);
          showToast(`Team member ${mFullName} updated!`);
        }
      } else {
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const json = await res.json();
          setMembers((prev) => [json.data.member, ...prev]);
          setMemberModalOpen(false);
          setCredentialsModalData({
            name: mFullName,
            email: mEmail,
            password: mPassword,
            role: mRole,
            team: mTeam,
            assignedTrainings: mAssignedCourses
          });
          showToast(`Team member ${mFullName} created and enrolled into team ${mTeam}!`);
        }
      }
    } catch (err) {
      alert("Failed to save member: " + String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete member "${name}" and revoke login credentials?`)) return;
    try {
      const res = await fetch(`/api/members?id=${userId}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.user.id !== userId));
        showToast(`Member ${name} removed.`);
      }
    } catch {
      alert("Failed to delete member.");
    }
  };

  // ─── TEAM ACTIONS ────────────────────────────────────────────────
  const openCreateTeam = () => {
    setEditingTeam(null);
    setTmName("");
    setTmDescription("");
    setTmLeaderName("");
    setTmLeaderEmail("");
    setTmColor("#6366f1");
    setTmRegion("");
    setTeamModalOpen(true);
  };

  const openEditTeam = (team: typeof teams[0]) => {
    setEditingTeam(team);
    setTmName(team.name);
    setTmDescription(team.description || "");
    setTmLeaderName(team.leaderName || "");
    setTmLeaderEmail(team.leaderEmail || "");
    setTmColor(team.color || "#6366f1");
    setTmRegion(team.region || "");
    setTeamModalOpen(true);
  };

  const handleSaveTeam = async () => {
    if (!tmName.trim()) { alert("Team name is required."); return; }
    setIsSubmitting(true);
    const payload = {
      name: tmName.trim(),
      description: tmDescription.trim(),
      leaderName: tmLeaderName.trim() || undefined,
      leaderEmail: tmLeaderEmail.trim() || undefined,
      color: tmColor,
      region: tmRegion.trim() || undefined
    };
    try {
      if (editingTeam) {
        const res = await fetch("/api/teams", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTeam.id, ...payload })
        });
        if (res.ok) {
          const j = await res.json();
          setTeams((prev) => prev.map((t) => t.id === editingTeam.id ? j.data.team : t));
          setTeamModalOpen(false);
          showToast(`Team "${tmName}" updated!`);
        } else {
          const e = await res.json();
          alert(e?.error?.message || "Failed to update team");
        }
      } else {
        const res = await fetch("/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const j = await res.json();
          setTeams((prev) => [j.data.team, ...prev]);
          setTeamModalOpen(false);
          showToast(`Team "${tmName}" created!`);
        } else {
          const e = await res.json();
          alert(e?.error?.message || "Failed to create team");
        }
      }
    } catch (err) {
      alert("Error: " + String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (id: string, name: string) => {
    if (!confirm(`Delete team "${name}"? Members will be unassigned.`)) return;
    try {
      const res = await fetch(`/api/teams?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setTeams((prev) => prev.filter((t) => t.id !== id));
        if (selectedTeamId === id) setSelectedTeamId(null);
        showToast(`Team "${name}" deleted.`);
      }
    } catch { alert("Failed to delete team."); }
  };

  const openTeamDetail = async (teamId: string) => {
    setSelectedTeamId(teamId);
    setTeamMemberLoading(true);
    try {
      const res = await fetch(`/api/teams?id=${teamId}&members=true`);
      if (res.ok) {
        const j = await res.json();
        // Members come as {user, profile} objects
        setTeamMembers(j.data?.members || []);
      }
    } catch { /* ignore */ } finally {
      setTeamMemberLoading(false);
    }
  };

  const handleAddMemberToTeam = async (teamId: string, userId: string, userName: string) => {
    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_member", teamId, userId })
      });
      if (res.ok) {
        const j = await res.json();
        setTeams((prev) => prev.map((t) => t.id === teamId ? j.data.team : t));
        // Also refresh members list for the detail panel
        await openTeamDetail(teamId);
        showToast(`${userName} added to team!`);
      }
    } catch { alert("Failed to add member."); }
  };

  const handleRemoveMemberFromTeam = async (teamId: string, userId: string, userName: string) => {
    if (!confirm(`Remove ${userName} from this team?`)) return;
    try {
      const res = await fetch("/api/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove_member", teamId, userId })
      });
      if (res.ok) {
        const j = await res.json();
        setTeams((prev) => prev.map((t) => t.id === teamId ? j.data.team : t));
        await openTeamDetail(teamId);
        showToast(`${userName} removed from team.`);
      }
    } catch { alert("Failed to remove member."); }
  };

  const selectedTeam = useMemo(() => teams.find((t) => t.id === selectedTeamId) || null, [teams, selectedTeamId]);
  const availableToAdd = useMemo(() => {
    if (!selectedTeam) return [];
    const inTeam = new Set(selectedTeam.memberIds);
    return members.filter((m) => !inTeam.has(m.user.id) &&
      (!addMemberQuery ||
        `${m.user.fullName} ${m.user.email}`.toLowerCase().includes(addMemberQuery.toLowerCase())
      )
    );
  }, [members, selectedTeam, addMemberQuery]);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (memberTeamFilter !== "ALL") {
        if (m.profile.teamName?.toLowerCase() !== memberTeamFilter.toLowerCase()) return false;
      }
      if (memberRankFilter !== "ALL") {
        const matchesRank = m.profile.rank?.toLowerCase().includes(memberRankFilter.toLowerCase()) ||
          m.profile.packageType?.toLowerCase().includes(memberRankFilter.toLowerCase());
        if (!matchesRank) return false;
      }
      if (memberSearchQuery) {
        const q = memberSearchQuery.toLowerCase();
        const str = `${m.user.fullName} ${m.user.email} ${m.user.phone} ${m.profile.teamName}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [members, memberTeamFilter, memberRankFilter, memberSearchQuery]);

  // Filtered trainers
  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      if (trainerSearchQuery) {
        const q = trainerSearchQuery.toLowerCase();
        const str = `${t.name} ${t.email} ${t.phone} ${t.specialization} ${t.teamAssigned}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [trainers, trainerSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-400/40 bg-brand-navy p-3.5 text-xs text-white shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <Card className="p-6 border-slate-200 shadow-sm bg-gradient-to-r from-slate-900 via-brand-navy to-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                Super Admin Master Control
              </div>
              <h1 className="mt-1 text-2xl font-black text-white">
                Trainers & Team Members Studio
              </h1>
              <p className="text-xs text-slate-300">
                Full CRUD over Faculty Trainers & Team Members: assign squads, enroll in courses, generate login credentials, and issue handover access.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                if (activeTab === "TRAINERS") {
                  const rows = trainers.map((t) => ({
                    Name: t.name,
                    Email: t.email,
                    Phone: t.phone,
                    Specialization: t.specialization,
                    AssignedTeam: t.teamAssigned || "Faculty",
                    AssignedCoursesCount: t.assignedCoursesCount,
                    LoginPassword: t.rawPassword || "Trainer@2026"
                  }));
                  exportToCsv("Faculty_Trainers_Credentials_Roster", rows);
                } else {
                  const rows = members.map((m) => ({
                    Name: m.user.fullName || `${m.profile.firstName} ${m.profile.lastName}`,
                    Email: m.user.email,
                    Phone: m.user.phone || m.profile.phone,
                    Role: m.user.role,
                    Rank: m.profile.rank,
                    Package: m.profile.packageType,
                    Team: m.profile.teamName,
                    Status: m.profile.status,
                    LoginPassword: m.profile.rawPassword || "Member@2026"
                  }));
                  exportToCsv("Team_Members_Credentials_Roster", rows);
                }
              }}
              className="border border-white/20 bg-white/10 text-white text-xs font-bold hover:bg-white/20"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-cyan-300" />
              Export Roster
            </Button>

            <Button
              variant="ghost"
              onClick={() => printSection(activeTab === "TRAINERS" ? "trainers-printable-area" : "members-printable-area", activeTab === "TRAINERS" ? "Faculty Trainers Roster" : "Team Members & Credentials Roster")}
              className="border border-white/20 bg-white/10 text-white text-xs font-bold hover:bg-white/20"
            >
              <Printer className="mr-1.5 h-3.5 w-3.5 text-cyan-300" />
              Print Roster
            </Button>

            {activeTab === "TRAINERS" ? (
              <Button
                onClick={handleOpenCreateTrainer}
                className="brand-gradient text-brand-navy text-xs font-black shadow-lg hover:brightness-105"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Faculty Trainer
              </Button>
            ) : activeTab === "MEMBERS" ? (
              <Button
                onClick={handleOpenCreateMember}
                className="brand-gradient text-brand-navy text-xs font-black shadow-lg hover:brightness-105"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Team Member
              </Button>
            ) : (
              <Button
                onClick={openCreateTeam}
                className="brand-gradient text-brand-navy text-xs font-black shadow-lg hover:brightness-105"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Create New Team
              </Button>
            )}
          </div>
        </div>

        {/* Studio Tabs */}
        <div className="mt-6 flex gap-2 border-t border-white/10 pt-4">
          <button
            onClick={() => setActiveTab("TRAINERS")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "TRAINERS"
                ? "brand-gradient text-brand-navy shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            <GraduationCap className="h-4 w-4" />
            Faculty Trainers ({trainers.length})
          </button>

          <button
            onClick={() => setActiveTab("MEMBERS")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "MEMBERS"
                ? "brand-gradient text-brand-navy shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            <Users className="h-4 w-4" />
            Team Members ({members.length})
          </button>

          <button
            onClick={() => setActiveTab("TEAMS")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition",
              activeTab === "TEAMS"
                ? "brand-gradient text-brand-navy shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            <Building2 className="h-4 w-4" />
            Team Management ({teams.length})
          </button>
        </div>
      </Card>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. TAB: FACULTY TRAINERS */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === "TRAINERS" && (
        <div className="space-y-4" id="trainers-printable-area">
          {/* Trainer Stats */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Total Trainers</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{trainers.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">100% active faculty</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Assigned Courses</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {trainers.reduce((acc, t) => acc + (t.assignedCoursesCount || 0), 0)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Across 4 curriculum tiers</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Credentials Active</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{trainers.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Ready for login</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Average Rating</span>
              <p className="mt-1 text-2xl font-black text-amber-600">4.9 ★</p>
              <p className="mt-1 text-[11px] text-slate-500">Student reviews</p>
            </Card>
          </div>

          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search trainers by name, email, specialization..."
                value={trainerSearchQuery}
                onChange={(e) => setTrainerSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs outline-none focus:border-brand-cyan"
              />
            </div>
            <div className="text-xs text-slate-500 font-bold">
              Showing {filteredTrainers.length} of {trainers.length} Trainers
            </div>
          </div>

          {/* Trainers Table */}
          <Card className="p-5 border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-3">Trainer Info</th>
                    <th className="py-3 px-3">Specialization & Bio</th>
                    <th className="py-3 px-3">Assigned Team</th>
                    <th className="py-3 px-3">Assigned Courses</th>
                    <th className="py-3 px-3">Login Credentials</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrainers.map((t) => {
                    const passVisible = visiblePasswords[t.id];
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center font-bold text-brand-navy text-xs shrink-0 shadow-sm">
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-brand-navy">{t.name}</p>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3 text-slate-400" /> {t.email}
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" /> {t.phone}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <p className="font-bold text-slate-700">{t.specialization}</p>
                          <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">{t.bio}</p>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                            <Users className="h-3 w-3" />
                            {t.teamAssigned || "Trainers Faculty"}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {t.assignedTrainings && t.assignedTrainings.length > 0 ? (
                              t.assignedTrainings.map((cId) => {
                                const matched = courses.find((c) => c.id === cId);
                                return (
                                  <span
                                    key={cId}
                                    className="rounded bg-cyan-50 border border-cyan-200 text-cyan-800 px-1.5 py-0.5 text-[10px] font-bold truncate max-w-[160px]"
                                    title={matched?.title || cId}
                                  >
                                    📚 {matched?.title || cId}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">No courses assigned yet</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
                            <Key className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-mono text-slate-700 font-bold">
                              {passVisible ? t.rawPassword || "Trainer@2026" : "••••••••"}
                            </span>
                            <button
                              onClick={() =>
                                setVisiblePasswords((prev) => ({ ...prev, [t.id]: !prev[t.id] }))
                              }
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title={passVisible ? "Hide password" : "Show password"}
                            >
                              {passVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                            <button
                              onClick={() =>
                                copyCredentials(t.name, t.email, t.rawPassword || "Trainer@2026", "TRAINER", t.teamAssigned)
                              }
                              className="text-brand-blue hover:text-cyan-700 p-0.5 font-bold"
                              title="Copy credentials for handover"
                            >
                              {copiedKey === t.email ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                copyCredentials(t.name, t.email, t.rawPassword || "Trainer@2026", "TRAINER", t.teamAssigned)
                              }
                              title="Handover Credentials"
                              className="rounded bg-emerald-50 p-1 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              <Key className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditTrainer(t)}
                              title="Edit Trainer & Assignments"
                              className="rounded bg-slate-100 p-1 text-slate-700 hover:bg-slate-200 transition"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTrainer(t.id, t.name)}
                              title="Delete Trainer"
                              className="rounded bg-rose-50 p-1 text-rose-600 hover:bg-rose-100 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredTrainers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No trainers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. TAB: TEAM MEMBERS */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === "MEMBERS" && (
        <div className="space-y-4" id="members-printable-area">
          {/* Member Metric Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Total Members</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{members.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">
                {members.filter((m) => m.profile.status === "ACTIVE").length} Active verified
              </p>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Teams Assigned</span>
              <p className="mt-1 text-2xl font-black text-purple-700">
                {new Set(members.map((m) => m.profile.teamName).filter(Boolean)).size} Squads
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Organized cohorts</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Courses Enrolled</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">
                {members.reduce((acc, m) => acc + (m.profile.assignedTrainings?.length || 0), 0)}
              </p>
              <p className="mt-1 text-[11px] text-cyan-600 font-semibold">Active curriculums</p>
            </Card>

            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Credentials Generated</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{members.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Login ready</p>
            </Card>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative flex-1 min-w-[220px] max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search member by name, email, phone..."
                value={memberSearchQuery}
                onChange={(e) => setMemberSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Team:</span>
                <select
                  value={memberTeamFilter}
                  onChange={(e) => setMemberTeamFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Squads</option>
                  {DEFAULT_TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500">Rank:</span>
                <select
                  value={memberRankFilter}
                  onChange={(e) => setMemberRankFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <option value="ALL">All Ranks</option>
                  {PACKAGES_LIST.map((p) => (
                    <option key={p} value={p.split(" ")[0]}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <Card className="p-5 border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-3">Member Details</th>
                    <th className="py-3 px-3">Rank & Package</th>
                    <th className="py-3 px-3">Assigned Team</th>
                    <th className="py-3 px-3">Assigned Trainings</th>
                    <th className="py-3 px-3">Credentials Handover</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => {
                    const passVisible = visiblePasswords[m.user.id];
                    const fullName = m.user.fullName || `${m.profile.firstName} ${m.profile.lastName}`;
                    const password = m.profile.rawPassword || "Member@2026";

                    return (
                      <tr key={m.user.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center font-bold text-brand-navy text-xs shrink-0 shadow-sm">
                              {fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-brand-navy">{fullName}</p>
                                <span className={cn(
                                  "rounded px-1.5 py-0.2 text-[9px] font-black uppercase",
                                  m.user.role === "TEAM_LEADER" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                                )}>
                                  {m.user.role}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="h-3 w-3 text-slate-400" /> {m.user.email}
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <Phone className="h-3 w-3 text-slate-400" /> {m.user.phone || m.profile.phone || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <p className="font-bold text-slate-800">{m.profile.rank || "Starter IBO"}</p>
                          <span className="inline-block mt-0.5 rounded bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                            {m.profile.packageType || "Silver Associate"}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-700">
                            <Users className="h-3 w-3" />
                            {m.profile.teamName || "Addis Pioneers Squad"}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {m.profile.assignedTrainings && m.profile.assignedTrainings.length > 0 ? (
                              m.profile.assignedTrainings.map((cId) => {
                                const matched = courses.find((c) => c.id === cId);
                                return (
                                  <span
                                    key={cId}
                                    className="rounded bg-cyan-50 border border-cyan-200 text-cyan-800 px-1.5 py-0.5 text-[10px] font-bold truncate max-w-[160px]"
                                    title={matched?.title || cId}
                                  >
                                    📚 {matched?.title || cId}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">No courses enrolled</span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">
                            <Key className="h-3.5 w-3.5 text-slate-400" />
                            <span className="font-mono text-slate-700 font-bold">
                              {passVisible ? password : "••••••••"}
                            </span>
                            <button
                              onClick={() =>
                                setVisiblePasswords((prev) => ({ ...prev, [m.user.id]: !prev[m.user.id] }))
                              }
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                              title={passVisible ? "Hide password" : "Show password"}
                            >
                              {passVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </button>
                            <button
                              onClick={() =>
                                copyCredentials(fullName, m.user.email, password, m.user.role, m.profile.teamName || "MyUpline")
                              }
                              className="text-brand-blue hover:text-cyan-700 p-0.5 font-bold"
                              title="Copy credentials for handover"
                            >
                              {copiedKey === m.user.email ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                copyCredentials(fullName, m.user.email, password, m.user.role, m.profile.teamName || "MyUpline")
                              }
                              title="Copy Credential Slip"
                              className="rounded bg-emerald-50 p-1 text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              <Key className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditMember(m)}
                              title="Edit Member & Assignments"
                              className="rounded bg-slate-100 p-1 text-slate-700 hover:bg-slate-200 transition"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(m.user.id, fullName)}
                              title="Delete Member"
                              className="rounded bg-rose-50 p-1 text-rose-600 hover:bg-rose-100 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No team members found. Click <strong>"Add Team Member"</strong> to enroll and assign credentials.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. TAB: TEAM MANAGEMENT                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === "TEAMS" && (
        <div className="space-y-5">
          {/* Stats Row */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Total Teams</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{teams.length}</p>
              <p className="mt-1 text-[11px] text-emerald-600 font-semibold">{teams.filter((t) => t.isActive).length} active</p>
            </Card>
            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Total Members Assigned</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{teams.reduce((a, t) => a + t.memberCount, 0)}</p>
              <p className="mt-1 text-[11px] text-slate-500">Across all squads</p>
            </Card>
            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Teams with Leader</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{teams.filter((t) => t.leaderName).length}</p>
              <p className="mt-1 text-[11px] text-slate-500">Assigned team leaders</p>
            </Card>
            <Card className="p-4 border-slate-200">
              <span className="text-xs font-bold text-slate-500">Regions Covered</span>
              <p className="mt-1 text-2xl font-black text-brand-navy">{new Set(teams.map((t) => t.region).filter(Boolean)).size}</p>
              <p className="mt-1 text-[11px] text-slate-500">Ethiopia-wide</p>
            </Card>
          </div>

          {/* 2-column layout: Team Cards + Detail Panel */}
          <div className={`grid gap-5 ${selectedTeamId ? "lg:grid-cols-2" : "grid-cols-1"}`}>
            {/* LEFT: Team Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 content-start">
              {teams.length === 0 && (
                <div className="col-span-2 py-16 text-center text-slate-400">
                  <Building2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
                  <p className="text-sm font-bold">No teams yet.</p>
                  <p className="text-xs mt-1">Click <strong>Create New Team</strong> above to get started.</p>
                </div>
              )}
              {teams.map((team) => (
                <Card
                  key={team.id}
                  className={`p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedTeamId === team.id
                      ? "border-brand-cyan shadow-md scale-[1.01]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => openTeamDetail(team.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white text-lg font-black shadow-md"
                        style={{ background: team.color || "#6366f1" }}
                      >
                        {team.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-tight">{team.name}</p>
                        {team.region && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-0.5">
                            <MapPin className="h-2.5 w-2.5" /> {team.region}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${team.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                        {team.isActive ? "Active" : "Inactive"}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditTeam(team); }}
                          className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 transition"
                          title="Edit Team"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteTeam(team.id, team.name); }}
                          className="rounded-lg bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition"
                          title="Delete Team"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {team.description && (
                    <p className="mt-2.5 text-[11px] text-slate-500 leading-relaxed line-clamp-2">{team.description}</p>
                  )}

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700">{team.memberCount} Members</span>
                    </div>
                    {team.leaderName ? (
                      <div className="flex items-center gap-1 text-[10px] text-purple-700 font-bold bg-purple-50 rounded-full px-2 py-0.5">
                        <Crown className="h-2.5 w-2.5" />
                        {team.leaderName}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">No leader assigned</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* RIGHT: Team Detail / Member Roster Panel */}
            {selectedTeamId && selectedTeam && (
              <Card className="p-5 border-slate-200 shadow-sm h-fit sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-black text-sm shadow"
                      style={{ background: selectedTeam.color || "#6366f1" }}
                    >
                      {selectedTeam.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{selectedTeam.name}</h3>
                      <p className="text-[10px] text-slate-500">{selectedTeam.memberCount} members · {selectedTeam.region || "All regions"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeamId(null)}
                    className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Team leader info */}
                {selectedTeam.leaderName && (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-purple-50 border border-purple-100 p-2.5 text-xs">
                    <Crown className="h-4 w-4 text-purple-600 flex-shrink-0" />
                    <div>
                      <span className="font-black text-purple-800">Team Leader: </span>
                      <span className="text-purple-700 font-semibold">{selectedTeam.leaderName}</span>
                      {selectedTeam.leaderEmail && <span className="text-purple-500 ml-1">({selectedTeam.leaderEmail})</span>}
                    </div>
                  </div>
                )}

                {/* Current Members */}
                <div className="mb-3">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Team Roster</h4>
                  {teamMemberLoading ? (
                    <div className="py-4 text-center text-xs text-slate-400">Loading roster...</div>
                  ) : teamMembers.length === 0 ? (
                    <div className="py-4 text-center text-xs text-slate-400">
                      No members assigned yet. Add members below.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {teamMembers.map((m) => {
                        const name = m.user?.fullName || `${m.profile?.firstName || ""} ${m.profile?.lastName || ""}`.trim() || "Unknown";
                        return (
                          <div key={m.user?.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-black">
                                {name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 leading-tight">{name}</p>
                                <p className="text-[10px] text-slate-500">{m.profile?.rank || m.user?.role} · {m.user?.email}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveMemberFromTeam(selectedTeamId, m.user?.id, name)}
                              className="rounded bg-rose-50 p-1 text-rose-600 hover:bg-rose-100 transition"
                              title="Remove from team"
                            >
                              <UserMinus className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Add Member from existing members */}
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-2">Add Member to Team</h4>
                  <div className="relative mb-2">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search members by name or email..."
                      value={addMemberQuery}
                      onChange={(e) => setAddMemberQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-[11px] outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {availableToAdd.slice(0, 8).map((m) => {
                      const name = m.user?.fullName || `${m.profile?.firstName || ""} ${m.profile?.lastName || ""}`.trim() || "Unknown";
                      return (
                        <div key={m.user?.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white p-2 text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{name}</p>
                            <p className="text-[10px] text-slate-500">{m.user?.email} · {m.profile?.rank || m.user?.role}</p>
                          </div>
                          <button
                            onClick={() => handleAddMemberToTeam(selectedTeamId, m.user?.id, name)}
                            className="rounded-lg brand-gradient text-brand-navy px-2 py-1 text-[10px] font-black hover:brightness-105 flex items-center gap-1"
                          >
                            <UserPlus className="h-3 w-3" />
                            Add
                          </button>
                        </div>
                      );
                    })}
                    {availableToAdd.length === 0 && (
                      <p className="py-2 text-center text-[11px] text-slate-400">
                        {members.length === 0 ? "No members found. Create members first." : "All members already in team or no matches."}
                      </p>
                    )}
                    {availableToAdd.length > 8 && (
                      <p className="text-[10px] text-center text-slate-400 pt-1">
                        +{availableToAdd.length - 8} more — refine your search above
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TEAM CREATE / EDIT MODAL                                   */}
      {/* ─────────────────────────────────────────────────────────── */}
      {teamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-800">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    {editingTeam ? `Edit Team: ${editingTeam.name}` : "Create New Team"}
                  </h3>
                  <p className="text-[10px] text-slate-500">Define squad details, assign a team leader, and set the region.</p>
                </div>
              </div>
              <button onClick={() => setTeamModalOpen(false)} className="rounded-xl p-1.5 hover:bg-slate-100">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Team Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  value={tmName}
                  onChange={(e) => setTmName(e.target.value)}
                  placeholder="e.g. Addis Pioneers Squad"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:border-brand-cyan"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={tmDescription}
                  onChange={(e) => setTmDescription(e.target.value)}
                  placeholder="What is this team's focus and mission?"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none resize-none"
                />
              </div>

              {/* Leader Name + Email */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Team Leader Name</label>
                  <input
                    type="text"
                    value={tmLeaderName}
                    onChange={(e) => setTmLeaderName(e.target.value)}
                    placeholder="e.g. Alebe Kebede"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Leader Email</label>
                  <input
                    type="email"
                    value={tmLeaderEmail}
                    onChange={(e) => setTmLeaderEmail(e.target.value)}
                    placeholder="leader@myupline.org"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Region + Color */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Globe className="h-3 w-3" /> Region
                  </label>
                  <input
                    type="text"
                    value={tmRegion}
                    onChange={(e) => setTmRegion(e.target.value)}
                    placeholder="e.g. Addis Ababa, National"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Palette className="h-3 w-3" /> Team Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tmColor}
                      onChange={(e) => setTmColor(e.target.value)}
                      className="h-8 w-12 cursor-pointer rounded border border-slate-200"
                    />
                    <span className="font-mono text-[11px] text-slate-600">{tmColor}</span>
                    <div className="h-6 w-6 rounded-full border border-slate-200" style={{ background: tmColor }} />
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Quick Color Presets</label>
                <div className="flex flex-wrap gap-2">
                  {["#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#6366f1", "#14b8a6"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTmColor(c)}
                      className={`h-6 w-6 rounded-full border-2 transition ${tmColor === c ? "border-slate-900 scale-110" : "border-transparent"}`}
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex gap-2 border-t border-slate-100 pt-4">
              <Button
                variant="ghost"
                onClick={() => setTeamModalOpen(false)}
                className="flex-1 text-xs font-bold border border-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTeam}
                disabled={isSubmitting || !tmName.trim()}
                className="flex-1 brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                {isSubmitting ? (
                  <><RefreshCw className="mr-1.5 h-3.5 w-3.5 animate-spin" />Saving...</>
                ) : editingTeam ? (
                  <><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Update Team</>
                ) : (
                  <><Plus className="mr-1.5 h-3.5 w-3.5" />Create Team</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. MODAL: TRAINER CRUD & ASSIGNMENTS & CREDENTIALS */}
      {/* ────────────────────────────────────────────────────────── */}
      {trainerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">
                    {editingTrainer ? "Edit Faculty Trainer & Courses" : "Register Faculty Trainer"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign faculty squad, curriculum training courses, and generate portal credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTrainerModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Name, Email, Phone */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trainer Full Name *</label>
                  <input
                    type="text"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    placeholder="e.g. Coach Dawit Mengistu"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-brand-cyan"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login Email Address *</label>
                  <input
                    type="email"
                    value={tEmail}
                    onChange={(e) => setTEmail(e.target.value)}
                    placeholder="trainer@myupline.org"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    placeholder="+251 911 000 000"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={tSpecialization}
                    onChange={(e) => setTSpecialization(e.target.value)}
                    placeholder="e.g. 8-Step Invitation Script & Duplication"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Trainer Bio / Credentials</label>
                <textarea
                  rows={2}
                  value={tBio}
                  onChange={(e) => setTBio(e.target.value)}
                  placeholder="Professional network marketing track record..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none resize-none"
                />
              </div>

              {/* TEAM ASSIGNMENT (REQUIREMENT) */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-3.5">
                <label className="block font-black text-purple-900 mb-1 flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Assign to Team / Squad
                </label>
                <select
                  value={tTeam}
                  onChange={(e) => setTTeam(e.target.value)}
                  className="w-full rounded-lg border border-purple-200 bg-white p-2 text-xs font-semibold text-slate-800"
                >
                  {DEFAULT_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      👥 {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* TRAINING COURSES ASSIGNMENT (REQUIREMENT) */}
              <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-3.5">
                <label className="block font-black text-cyan-900 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Assign to Training Courses / Curriculum
                  </span>
                  <span className="text-[10px] text-cyan-700">
                    {tAssignedCourses.length} courses selected
                  </span>
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {courses.map((course) => {
                    const isSelected = tAssignedCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition",
                          isSelected
                            ? "border-cyan-500 bg-white shadow-sm font-bold text-cyan-950"
                            : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTAssignedCourses((prev) => [...prev, course.id]);
                              } else {
                                setTAssignedCourses((prev) => prev.filter((id) => id !== course.id));
                              }
                            }}
                            className="rounded text-brand-blue"
                          />
                          <span>{course.title}</span>
                        </div>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600">
                          {course.level}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* CREDENTIALS GENERATION (REQUIREMENT) */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black text-emerald-900 flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-emerald-700" />
                    Portal Login Credentials
                  </label>
                  <button
                    type="button"
                    onClick={() => setTPassword(generateRandomPassword("Trainer"))}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Username / Login:</span>
                    <input
                      type="text"
                      readOnly
                      value={tEmail || "trainer@myupline.org"}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono text-slate-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Password:</span>
                    <input
                      type="text"
                      value={tPassword}
                      onChange={(e) => setTPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
              <Button variant="ghost" onClick={() => setTrainerModalOpen(false)} className="text-xs font-bold">
                Cancel
              </Button>
              <Button
                onClick={handleSaveTrainer}
                disabled={isSubmitting}
                className="brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                {isSubmitting ? "Saving..." : editingTrainer ? "Save Trainer Changes" : "Create Trainer & Give Credentials"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. MODAL: MEMBER CRUD & ASSIGNMENTS & CREDENTIALS */}
      {/* ────────────────────────────────────────────────────────── */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-brand-navy">
                    {editingMember ? "Edit Team Member & Credentials" : "Enroll New Team Member"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign squad, enroll in curriculum trainings, and generate credentials handover
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMemberModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              {/* Member Full Name & Email */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={mFullName}
                    onChange={(e) => setMFullName(e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-brand-cyan"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Login Email Address *</label>
                  <input
                    type="email"
                    value={mEmail}
                    onChange={(e) => setMEmail(e.target.value)}
                    placeholder="member@myupline.org"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none focus:border-brand-cyan"
                  />
                </div>
              </div>

              {/* Phone, Role & Package */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={mPhone}
                    onChange={(e) => setMPhone(e.target.value)}
                    placeholder="+251 911 000 000"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Role</label>
                  <select
                    value={mRole}
                    onChange={(e) => setMRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="MEMBER">MEMBER (IBO)</option>
                    <option value="TEAM_LEADER">TEAM_LEADER</option>
                    <option value="TRAINER">TRAINER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Membership Package</label>
                  <select
                    value={mPackage}
                    onChange={(e) => {
                      setMPackage(e.target.value);
                      setMRank(e.target.value);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-800"
                  >
                    {PACKAGES_LIST.map((pkg) => (
                      <option key={pkg} value={pkg}>
                        {pkg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TEAM ASSIGNMENT (REQUIREMENT) */}
              <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-3.5">
                <label className="block font-black text-purple-900 mb-1 flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  Assign to Squad / Team
                </label>
                <select
                  value={mTeam}
                  onChange={(e) => setMTeam(e.target.value)}
                  className="w-full rounded-lg border border-purple-200 bg-white p-2 text-xs font-semibold text-slate-800"
                >
                  {DEFAULT_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      👥 {team}
                    </option>
                  ))}
                </select>
              </div>

              {/* TRAINING ASSIGNMENT (REQUIREMENT) */}
              <div className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-3.5">
                <label className="block font-black text-cyan-900 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    Assign to Training Courses
                  </span>
                  <span className="text-[10px] text-cyan-700">
                    {mAssignedCourses.length} enrolled
                  </span>
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {courses.map((course) => {
                    const isSelected = mAssignedCourses.includes(course.id);
                    return (
                      <label
                        key={course.id}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition",
                          isSelected
                            ? "border-cyan-500 bg-white shadow-sm font-bold text-cyan-950"
                            : "border-slate-200 bg-white/70 text-slate-600 hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMAssignedCourses((prev) => [...prev, course.id]);
                              } else {
                                setMAssignedCourses((prev) => prev.filter((id) => id !== course.id));
                              }
                            }}
                            className="rounded text-brand-blue"
                          />
                          <span>{course.title}</span>
                        </div>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase text-slate-600">
                          {course.level}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* CREDENTIALS GENERATION (REQUIREMENT) */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-black text-emerald-900 flex items-center gap-1.5">
                    <Key className="h-4 w-4 text-emerald-700" />
                    Member Portal Login Credentials
                  </label>
                  <button
                    type="button"
                    onClick={() => setMPassword(generateRandomPassword("Member"))}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Auto-Generate
                  </button>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Username / Login:</span>
                    <input
                      type="text"
                      readOnly
                      value={mEmail || "member@myupline.org"}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono text-slate-600"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold">Password:</span>
                    <input
                      type="text"
                      value={mPassword}
                      onChange={(e) => setMPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono font-bold text-emerald-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
              <Button variant="ghost" onClick={() => setMemberModalOpen(false)} className="text-xs font-bold">
                Cancel
              </Button>
              <Button
                onClick={handleSaveMember}
                disabled={isSubmitting}
                className="brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                {isSubmitting ? "Saving..." : editingMember ? "Save Member Changes" : "Create Member & Issue Credentials"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. SUCCESS CREDENTIALS HANDOVER SLIP MODAL */}
      {/* ────────────────────────────────────────────────────────── */}
      {credentialsModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-emerald-500/30">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Key className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-black text-brand-navy">Credentials Handover Slip</h3>
                <p className="text-xs text-slate-500">Ready to send to member via WhatsApp / Telegram</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs space-y-2 text-slate-800">
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans font-semibold">Full Name:</span>
                <span className="font-bold">{credentialsModalData.name}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans font-semibold">Assigned Team:</span>
                <span className="font-bold text-purple-700">{credentialsModalData.team || "Squad"}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans font-semibold">Role:</span>
                <span className="font-bold text-blue-700">{credentialsModalData.role}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans font-semibold">Login Email:</span>
                <span className="font-bold">{credentialsModalData.email}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-slate-500 font-sans font-semibold">Password:</span>
                <span className="font-bold text-emerald-700">{credentialsModalData.password}</span>
              </div>
              <div className="flex justify-between pt-1 text-[11px] text-slate-500">
                <span className="font-sans">Portal URL:</span>
                <span>/en/auth/sign-in</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setCredentialsModalData(null)}
                className="flex-1 text-xs font-bold"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  copyCredentials(
                    credentialsModalData.name,
                    credentialsModalData.email,
                    credentialsModalData.password,
                    credentialsModalData.role,
                    credentialsModalData.team
                  );
                  setCredentialsModalData(null);
                }}
                className="flex-1 brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy Slip & Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
