"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  User,
  Shield,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Camera,
  Upload,
  KeyRound,
  Eye,
  EyeOff,
  Building,
  Crown,
  Users,
  Search,
  Edit3,
  Award,
  Share2,
  QrCode,
  X,
  ExternalLink,
  MessageSquare,
  Globe,
  Sliders
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDictionary, Locale } from "@/lib/i18n";
import { SystemRole } from "@/lib/rbac";
import { PRE_MADE_AVATARS, PreMadeAvatar, getPreMadeAvatars } from "@/lib/avatars-data";

interface ProfileManagementModuleProps {
  locale: string;
  currentUser?: any;
  userRole?: SystemRole;
  onOpenAi?: (prompt: string) => void;
}

export function ProfileManagementModule({
  locale,
  currentUser,
  userRole = "MEMBER",
  onOpenAi
}: ProfileManagementModuleProps) {
  const normLocale = (locale === "am" ? "am" : "en") as Locale;
  const dict = getDictionary(normLocale);

  const [activeTab, setActiveTab] = useState<"my-profile" | "avatars" | "security" | "directory">(
    "my-profile"
  );

  // Profile data
  const [profileData, setProfileData] = useState<{
    user: any;
    profile: any;
    stats: any;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Editable Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [titleOrOccupation, setTitleOrOccupation] = useState("");
  const [country, setCountry] = useState("Ethiopia");
  const [region, setRegion] = useState("Addis Ababa");
  const [city, setCity] = useState("Bole");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(
    PRE_MADE_AVATARS[0]?.avatarUrl || ""
  );

  // Avatar Modal
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState<"ALL" | "MALE" | "FEMALE">("ALL");
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Password Update
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Super Admin / Team Leader Directory
  const [directoryMembers, setDirectoryMembers] = useState<any[]>([]);
  const [directoryLoading, setDirectoryLoading] = useState(false);
  const [directorySearch, setDirectorySearch] = useState("");
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [memberEditModalOpen, setMemberEditModalOpen] = useState(false);

  // Member edit form state
  const [emName, setEmName] = useState("");
  const [emPhone, setEmPhone] = useState("");
  const [emRole, setEmRole] = useState("MEMBER");
  const [emRank, setEmRank] = useState("Starter IBO");
  const [emPackage, setEmPackage] = useState("Silver Associate");
  const [emTeam, setEmTeam] = useState("");
  const [emStatus, setEmStatus] = useState("ACTIVE");

  const isSuperOrAdmin = userRole === "SUPER_ADMIN" || userRole === "ADMIN";
  const isTeamLeader = userRole === "TEAM_LEADER";
  const canViewDirectory = isSuperOrAdmin || isTeamLeader;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch logged in profile
  const fetchMyProfile = useCallback(async () => {
    setLoading(true);
    try {
      const q = currentUser?.id ? `?userId=${currentUser.id}` : currentUser?.email ? `?email=${currentUser.email}` : "";
      const res = await fetch(`/api/profile${q}`);
      if (res.ok) {
        const json = await res.json();
        const { user, profile, stats } = json.data;
        setProfileData({ user, profile, stats });

        // Populate fields
        setFullName(user.fullName || `${profile.firstName || ""} ${profile.lastName || ""}`.trim());
        setEmail(user.email || "");
        setPhone(user.phone || profile.phone || "");
        setBio(profile.bio || "");
        setTitleOrOccupation(profile.titleOrOccupation || "");
        setCountry(profile.country || "Ethiopia");
        setRegion(profile.region || "Addis Ababa");
        setCity(profile.city || "Bole");
        setAddress(profile.address || "");
        setGender((profile.gender as any) || "MALE");
        setTelegramHandle(profile.telegramHandle || "");
        setWhatsappNumber(profile.whatsappNumber || "");

        const avatar = profile.avatarUrl || PRE_MADE_AVATARS[0].avatarUrl;
        setSelectedAvatarUrl(avatar);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch directory for Super Admin or Team Leader
  const fetchDirectory = useCallback(async () => {
    if (!canViewDirectory) return;
    setDirectoryLoading(true);
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const json = await res.json();
        let list = json.data?.members || [];
        if (isTeamLeader && profileData?.profile?.teamName) {
          // Filter to team members
          list = list.filter((m: any) => m.profile?.teamName === profileData.profile.teamName);
        }
        setDirectoryMembers(list);
      }
    } catch (err) {
      console.error("Failed to load directory:", err);
    } finally {
      setDirectoryLoading(false);
    }
  }, [canViewDirectory, isTeamLeader, profileData]);

  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  useEffect(() => {
    if (activeTab === "directory") {
      fetchDirectory();
    }
  }, [activeTab, fetchDirectory]);

  // Save profile updates
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      alert("Full name is required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profileData?.user?.id,
          fullName: fullName.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
          titleOrOccupation: titleOrOccupation.trim(),
          country: country.trim(),
          region: region.trim(),
          city: city.trim(),
          address: address.trim(),
          gender,
          telegramHandle: telegramHandle.trim(),
          whatsappNumber: whatsappNumber.trim(),
          avatarUrl: selectedAvatarUrl
        })
      });

      if (res.ok) {
        const json = await res.json();
        setProfileData((prev) => prev ? { ...prev, user: json.data.user, profile: json.data.profile } : null);
        showToast(normLocale === "am" ? "የግል መገለጫዎ በተሳካ ሁኔታ ተዘምኗል!" : "Profile details updated successfully!");
      } else {
        alert("Failed to save profile");
      }
    } catch {
      alert("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  // Select pre-made avatar
  const handleSelectAvatar = (avatar: PreMadeAvatar) => {
    setSelectedAvatarUrl(avatar.avatarUrl);
    setAvatarModalOpen(false);
    showToast(`${avatar.name} selected as your active avatar! Click Save to apply.`);
  };

  // Custom Avatar Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSelectedAvatarUrl(dataUrl);
      setAvatarModalOpen(false);
      showToast("Custom photo loaded! Click Save to apply.");
    };
    reader.readAsDataURL(file);
  };

  // Password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPassMessage({
        text: normLocale === "am" ? "የይለፍ ቃል ቢያንስ 6 ፊደላት ወይም ቁጥሮች መሆን አለበት።" : "Password must be at least 6 characters.",
        success: false
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({
        text: normLocale === "am" ? "የይለፍ ቃሎቹ አይመሳሰሉም።" : "Passwords do not match.",
        success: false
      });
      return;
    }

    setPassLoading(true);
    setPassMessage(null);
    try {
      const res = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profileData?.user?.id,
          currentPassword,
          newPassword
        })
      });
      const json = await res.json();
      if (res.ok) {
        setPassMessage({
          text: normLocale === "am" ? "የይለፍ ቃልዎ በተሳካ ሁኔታ ተቀይሯል!" : json.data?.message || "Password updated successfully!",
          success: true
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPassMessage({ text: json.error?.message || "Failed to update password", success: false });
      }
    } catch {
      setPassMessage({ text: "Server error occurred", success: false });
    } finally {
      setPassLoading(false);
    }
  };

  // Directory member edit
  const openEditMemberModal = (m: any) => {
    setEditingMember(m);
    setEmName(m.user.fullName || `${m.profile.firstName} ${m.profile.lastName}`);
    setEmPhone(m.user.phone || m.profile.phone || "");
    setEmRole(m.user.role || "MEMBER");
    setEmRank(m.profile.rank || "Starter IBO");
    setEmPackage(m.profile.packageType || "Silver Associate");
    setEmTeam(m.profile.teamName || "");
    setEmStatus(m.profile.status || "ACTIVE");
    setMemberEditModalOpen(true);
  };

  const handleSaveMemberEdit = async () => {
    if (!editingMember) return;
    try {
      const res = await fetch("/api/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: editingMember.user.id,
          fullName: emName,
          phone: emPhone,
          role: emRole,
          rank: emRank,
          packageType: emPackage,
          teamName: emTeam,
          status: emStatus
        })
      });
      if (res.ok) {
        const json = await res.json();
        setDirectoryMembers((prev) =>
          prev.map((item) => (item.user.id === editingMember.user.id ? json.data.member : item))
        );
        setMemberEditModalOpen(false);
        showToast(`Member profile for ${emName} updated successfully!`);
      } else {
        alert("Failed to update member.");
      }
    } catch {
      alert("Error updating member profile.");
    }
  };

  const filteredAvatars = useMemo(() => {
    return getPreMadeAvatars(avatarFilter);
  }, [avatarFilter]);

  const filteredDirectory = useMemo(() => {
    if (!directorySearch.trim()) return directoryMembers;
    const q = directorySearch.toLowerCase();
    return directoryMembers.filter((m) => {
      const str = `${m.user?.fullName} ${m.user?.email} ${m.user?.phone} ${m.profile?.teamName} ${m.profile?.rank}`.toLowerCase();
      return str.includes(q);
    });
  }, [directoryMembers, directorySearch]);

  const copyReferralCode = () => {
    if (!profileData?.profile?.referralCode) return;
    navigator.clipboard.writeText(profileData.profile.referralCode);
    setCopiedKey("ref");
    setTimeout(() => setCopiedKey(null), 2500);
    showToast("Referral code copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-400/40 bg-brand-navy p-3.5 text-xs text-white shadow-xl animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-white/60 hover:text-white text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Hero Header Card with Live Profile Preview */}
      <Card className="p-6 border-slate-200 shadow-sm bg-gradient-to-r from-slate-950 via-brand-navy to-slate-900 text-white">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Clickable Avatar with edit badge */}
            <div
              onClick={() => setAvatarModalOpen(true)}
              className="group relative cursor-pointer"
              title="Click to choose a pre-made avatar"
            >
              <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-cyan-400/50 bg-slate-800 shadow-xl transition-all duration-300 group-hover:border-cyan-300 group-hover:scale-105">
                {selectedAvatarUrl ? (
                  <img src={selectedAvatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-black text-2xl brand-gradient text-brand-navy">
                    {fullName.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400 text-brand-navy shadow-md transition group-hover:scale-110">
                <Camera className="h-3.5 w-3.5 font-black" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-cyan-300 border border-cyan-500/30">
                  <Shield className="h-2.5 w-2.5" />
                  {userRole.replace(/_/g, " ")}
                </span>
                {profileData?.profile?.rank && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black text-purple-300 border border-purple-500/30">
                    <Crown className="h-2.5 w-2.5" />
                    {profileData.profile.rank}
                  </span>
                )}
                {profileData?.profile?.teamName && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black text-emerald-300 border border-emerald-500/30">
                    <Users className="h-2.5 w-2.5" />
                    {profileData.profile.teamName}
                  </span>
                )}
              </div>

              <h1 className="mt-1.5 text-2xl font-black text-white">
                {fullName || "User Profile"}
              </h1>
              <p className="text-xs text-slate-300 max-w-xl">
                {bio || (normLocale === "am" ? "የግል መገለጫዎን፣ አቫታርዎን፣ እና የመገኛ መረጃዎን እዚህ ያቀናብሩ።" : "Manage your official identity, leadership avatar, regional contact, and credentials.")}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setAvatarModalOpen(true)}
              className="border border-white/20 bg-white/10 text-white text-xs font-bold hover:bg-white/20 flex items-center gap-1.5"
            >
              <Camera className="h-3.5 w-3.5 text-cyan-300" />
              {normLocale === "am" ? "አቫታር ምረጥ (24)" : "Choose Avatar (24)"}
            </Button>

            <Button
              onClick={handleSaveProfile}
              disabled={saving}
              className="brand-gradient text-brand-navy text-xs font-black shadow-lg hover:brightness-105 flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  {dict.common.saving}
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  {normLocale === "am" ? "ለውጦችን አስቀምጥ" : "Save Profile"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <button
            onClick={() => setActiveTab("my-profile")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition",
              activeTab === "my-profile"
                ? "brand-gradient text-brand-navy shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            <User className="h-3.5 w-3.5" />
            {normLocale === "am" ? "የግል መገለጫ" : "My Profile"}
          </button>

          <button
            onClick={() => setActiveTab("avatars")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition",
              activeTab === "avatars"
                ? "brand-gradient text-brand-navy shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            <Camera className="h-3.5 w-3.5" />
            {normLocale === "am" ? "አቫታር ስቱዲዮ (24)" : "Avatar Studio (24)"}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition",
              activeTab === "security"
                ? "brand-gradient text-brand-navy shadow-md"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            )}
          >
            <KeyRound className="h-3.5 w-3.5" />
            {normLocale === "am" ? "የይለፍ ቃል እና ደህንነት" : "Security & Password"}
          </button>

          {canViewDirectory && (
            <button
              onClick={() => setActiveTab("directory")}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition",
                activeTab === "directory"
                  ? "brand-gradient text-brand-navy shadow-md"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              )}
            >
              <Users className="h-3.5 w-3.5" />
              {isSuperOrAdmin
                ? (normLocale === "am" ? "የአባላት ማውጫ (CRUD)" : "All Members Directory (CRUD)")
                : (normLocale === "am" ? "የቡድኔ አባላት ማውጫ" : "My Squad Directory")}
            </button>
          )}
        </div>
      </Card>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: MY PROFILE                                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "my-profile" && (
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Main Edit Form */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5 border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-sm font-black text-brand-navy">
                  {normLocale === "am" ? "የግል መረጃ እና ስም" : "Personal & Contact Details"}
                </h2>
                <p className="text-xs text-slate-500">
                  {normLocale === "am"
                    ? "ይህ መረጃ በቡድንዎ፣ በዳውንላይንዎ እና በሰርተፊኬቶችዎ ላይ ይታያል።"
                    : "This information appears across your team roster, certificates, and upline directory."}
                </p>
              </div>

              {/* Full Name & Email */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {normLocale === "am" ? "ሙሉ ስም *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dawit Mengistu"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {normLocale === "am" ? "የመግቢያ ኢሜይል" : "Login Email Address"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone & Gender */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3 text-brand-green" />
                    {normLocale === "am" ? "ስልክ ቁጥር *" : "Phone Number *"}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 911 000 000"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none focus:border-brand-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {normLocale === "am" ? "ጾታ" : "Gender"}
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none"
                  >
                    <option value="MALE">Male (ወንድ)</option>
                    <option value="FEMALE">Female (ሴት)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Title / Occupation & Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {normLocale === "am" ? "የስራ መጠሪያ / ማዕረግ" : "Professional Tagline / Title"}
                </label>
                <input
                  type="text"
                  value={titleOrOccupation}
                  onChange={(e) => setTitleOrOccupation(e.target.value)}
                  placeholder="e.g. Master Builder & Leadership Coach"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {normLocale === "am" ? "የግል የህይወት ታሪክ / ራዕይ (Bio)" : "Personal Bio & Entrepreneur Vision"}
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your goals, motivation, and leadership mission with your network..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-brand-cyan resize-none"
                />
              </div>

              {/* Location Fields */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  {normLocale === "am" ? "የመኖሪያ እና የክልል አድራሻ" : "Regional Location & Office Address"}
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Region / State</label>
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g. Addis Ababa"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">City / Subcity</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bole"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Social Communication */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-800 mb-3 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-brand-blue" />
                  {normLocale === "am" ? "የቴሌግራም እና ዋትስአፕ መገናኛ" : "Telegram & WhatsApp Direct Contact"}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Telegram Username</label>
                    <input
                      type="text"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      placeholder="@username"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">WhatsApp Direct Number</label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+251 9..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Cards: Business Stats & Referral Card */}
          <div className="space-y-5">
            {/* Membership ID & Referral Code Card */}
            <Card className="p-5 border-slate-200 shadow-sm bg-gradient-to-br from-indigo-900 to-brand-navy text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">
                  {normLocale === "am" ? "የአባልነት መታወቂያ" : "Official Member ID"}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white">
                  {profileData?.profile?.status || "ACTIVE"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/20 bg-slate-800 shadow">
                  {selectedAvatarUrl ? (
                    <img src={selectedAvatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-black text-lg brand-gradient text-brand-navy">
                      {fullName.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-black text-white text-base">{fullName}</p>
                  <p className="text-xs text-cyan-300 font-semibold">{profileData?.profile?.rank || "Crown Diamond"}</p>
                  <p className="text-[10px] text-slate-300">{profileData?.profile?.teamName || "Vision Leaders"}</p>
                </div>
              </div>

              {/* Referral Code Box */}
              <div className="rounded-xl border border-white/15 bg-white/10 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 text-[11px] font-bold">
                    {normLocale === "am" ? "የሪፈራል ኮድዎ" : "Your Referral Code"}
                  </span>
                  <button
                    onClick={copyReferralCode}
                    className="flex items-center gap-1 text-[11px] font-black text-cyan-300 hover:text-white"
                  >
                    {copiedKey === "ref" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    {copiedKey === "ref" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-1 font-mono text-lg font-black text-white tracking-wider">
                  {profileData?.profile?.referralCode || "UPLINE-7749"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white/5 p-2 border border-white/10">
                  <p className="text-[10px] text-slate-400 font-bold">Package Tier</p>
                  <p className="font-black text-white text-xs mt-0.5">{profileData?.profile?.packageType || "Diamond Leader"}</p>
                </div>
                <div className="rounded-lg bg-white/5 p-2 border border-white/10">
                  <p className="text-[10px] text-slate-400 font-bold">Personal PV</p>
                  <p className="font-black text-amber-300 text-xs mt-0.5">{profileData?.stats?.personalPV || 500} PV</p>
                </div>
              </div>
            </Card>

            {/* Quick Avatar Preview Card */}
            <Card className="p-5 border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800">
                  {normLocale === "am" ? "የአቫታር ምርጫ" : "Avatar Selection"}
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">24 Presets</span>
              </div>
              <p className="text-xs text-slate-500">
                {normLocale === "am"
                  ? "ከ 12 ወንድ እና 12 ሴት የአመራር አቫታሮች ይምረጡ ወይም የራስዎን ፎቶ ይጫኑ።"
                  : "Choose from 12 male and 12 female executive avatars, or upload a custom image."}
              </p>
              <Button
                onClick={() => setAvatarModalOpen(true)}
                className="w-full brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                <Camera className="mr-1.5 h-3.5 w-3.5" />
                {normLocale === "am" ? "የአቫታር ጋለሪ ክፈት" : "Open Avatar Gallery"}
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: AVATAR STUDIO (FULL 24 PRESETS GALLERY)                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "avatars" && (
        <div className="space-y-5">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-brand-navy">
                  {normLocale === "am" ? "የአቫታር ስቱዲዮ (24 የተመረጡ አቫታሮች)" : "Pre-Made Leadership Avatars (24 Presets)"}
                </h2>
                <p className="text-xs text-slate-500">
                  {normLocale === "am"
                    ? "ለስራዎ እና ለክብርዎ የሚመጥነውን ወንድ ወይም ሴት አቫታር በአንድ ጠቅታ ይምረጡ።"
                    : "Curated collection of distinguished male and female Ethiopian business leadership avatars."}
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200">
                {(["ALL", "MALE", "FEMALE"] as const).map((genderOption) => (
                  <button
                    key={genderOption}
                    onClick={() => setAvatarFilter(genderOption)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                      avatarFilter === genderOption
                        ? "bg-white text-brand-navy shadow-sm font-black"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {genderOption === "ALL" ? "All (24)" : genderOption === "MALE" ? "👨 Male (12)" : "👩 Female (12)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 pt-2">
              {filteredAvatars.map((av) => {
                const isSelected = selectedAvatarUrl === av.avatarUrl;
                return (
                  <div
                    key={av.id}
                    onClick={() => handleSelectAvatar(av)}
                    className={cn(
                      "group relative flex flex-col items-center rounded-2xl border-2 p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                      isSelected
                        ? "border-brand-cyan bg-cyan-50/50 shadow-md ring-2 ring-brand-cyan/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    {/* Checkmark Badge if selected */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-white shadow">
                        <Check className="h-3 w-3 font-black" />
                      </div>
                    )}

                    {/* Avatar Graphic */}
                    <div className="h-16 w-16 overflow-hidden rounded-2xl shadow-md border border-slate-200 bg-slate-100 transition group-hover:scale-110">
                      {av.avatarUrl ? (
                        <img src={av.avatarUrl} alt={av.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>

                    <p className="mt-2.5 text-xs font-black text-slate-800 line-clamp-1">{av.name}</p>
                    <span className="mt-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                      {av.badge}
                    </span>

                    <button
                      type="button"
                      className={cn(
                        "mt-3 w-full rounded-lg py-1 text-[10px] font-black transition",
                        isSelected
                          ? "bg-brand-cyan text-brand-navy"
                          : "bg-slate-100 text-slate-700 group-hover:brand-gradient group-hover:text-brand-navy"
                      )}
                    >
                      {isSelected ? "Active Avatar" : "Select"}
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: SECURITY & PASSWORD                                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "security" && (
        <Card className="p-5 border-slate-200 shadow-sm space-y-4 max-w-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <KeyRound className="h-5 w-5 text-purple-600" />
            <div>
              <h2 className="text-sm font-black text-brand-navy">
                {normLocale === "am" ? "የይለፍ ቃል መቀየሪያ" : "Update Your Password"}
              </h2>
              <p className="text-xs text-slate-500">
                {normLocale === "am"
                  ? "የመግቢያ ይለፍ ቃልዎን እዚህ ወዲያውኑ በአዲስ ይቀይሩ።"
                  : "Update your login credentials with immediate database sync."}
              </p>
            </div>
          </div>

          {passMessage && (
            <div
              className={cn(
                "rounded-xl p-3 text-xs font-bold",
                passMessage.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              )}
            >
              {passMessage.text}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {normLocale === "am" ? "የአሁኑ የይለፍ ቃል" : "Current Password"}
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {normLocale === "am" ? "አዲሱ የይለፍ ቃል *" : "New Password *"}
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {normLocale === "am" ? "አዲሱን የይለፍ ቃል በድጋሚ ያረጋግጡ *" : "Confirm New Password *"}
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-brand-cyan"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
              >
                {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {showPass ? "Hide Passwords" : "Show Passwords"}
              </button>
            </div>

            <Button
              type="submit"
              disabled={passLoading || !newPassword}
              className="w-full brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
            >
              {passLoading ? "Updating..." : (normLocale === "am" ? "የይለፍ ቃል ቀይር" : "Update Password")}
            </Button>
          </form>
        </Card>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: RBAC DIRECTORY (FOR SUPER_ADMIN, ADMIN, TEAM_LEADER)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === "directory" && canViewDirectory && (
        <div className="space-y-4">
          <Card className="p-5 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-brand-navy">
                  {isSuperOrAdmin
                    ? (normLocale === "am" ? "ሁሉንም አባላት ማስተዳደሪያ (Super Admin CRUD)" : "All Platform Members Directory (Full CRUD)")
                    : (normLocale === "am" ? "የቡድኔ አባላት ማውጫ" : "My Team Squad Directory")}
                </h2>
                <p className="text-xs text-slate-500">
                  {isSuperOrAdmin
                    ? "Manage profiles, roles, teams, ranks, and credentials of any platform member."
                    : "Inspect and update profile information for members enrolled in your squad."}
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, team..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            {/* Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Role & Rank</th>
                    <th className="py-2.5 px-3">Team Squad</th>
                    <th className="py-2.5 px-3">Phone & Region</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDirectory.map((m) => {
                    const name = m.user?.fullName || `${m.profile?.firstName || ""} ${m.profile?.lastName || ""}`.trim();
                    const avatar = m.profile?.avatarUrl;
                    return (
                      <tr key={m.user.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-xs">
                              {avatar ? (
                                <img src={avatar} alt={name} className="h-full w-full object-cover" />
                              ) : (
                                name.charAt(0) || "U"
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{name}</p>
                              <p className="text-[10px] text-slate-500">{m.user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-700">
                              {m.user.role}
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5">{m.profile?.rank || "Starter IBO"}</p>
                          </div>
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-700">
                          {m.profile?.teamName || "Unassigned"}
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-mono text-[11px]">{m.user.phone || m.profile?.phone || "—"}</p>
                          <p className="text-[10px] text-slate-500">{m.profile?.region || "Addis Ababa"}</p>
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-black",
                              m.profile?.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            )}
                          >
                            {m.profile?.status || "ACTIVE"}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <Button
                            onClick={() => openEditMemberModal(m)}
                            variant="ghost"
                            className="h-7 px-2 text-xs font-bold border border-slate-200 hover:bg-slate-100"
                          >
                            <Edit3 className="mr-1 h-3 w-3 text-brand-blue" />
                            Edit Profile
                          </Button>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredDirectory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        {directoryLoading ? "Loading member profiles..." : "No members found matching your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: PRE-MADE AVATARS SELECTOR MODAL                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {normLocale === "am" ? "የአመራር አቫታር ይምረጡ (24 አማራጮች)" : "Select Your Leadership Avatar (24 Presets)"}
                </h3>
                <p className="text-xs text-slate-500">
                  {normLocale === "am"
                    ? "ከወንድ እና ሴት አቫታሮች የሚወዱትን ይምረጡ ወይም የራስዎን ፎቶ ይጫኑ።"
                    : "Choose between distinguished male and female executive avatars, or upload your own photo."}
                </p>
              </div>
              <button
                onClick={() => setAvatarModalOpen(false)}
                className="rounded-xl p-1.5 hover:bg-slate-100 text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200">
                {(["ALL", "MALE", "FEMALE"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setAvatarFilter(g)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                      avatarFilter === g
                        ? "bg-white text-brand-navy shadow-sm font-black"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {g === "ALL" ? "All (24)" : g === "MALE" ? "👨 Male (12)" : "👩 Female (12)"}
                  </button>
                ))}
              </div>

              {/* Upload custom file input */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition">
                  <Upload className="h-3.5 w-3.5 text-brand-blue" />
                  <span>Upload Device Photo</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Avatars Grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 max-h-[55vh] overflow-y-auto p-1">
              {filteredAvatars.map((av) => {
                const isSelected = selectedAvatarUrl === av.avatarUrl;
                return (
                  <div
                    key={av.id}
                    onClick={() => handleSelectAvatar(av)}
                    className={cn(
                      "group relative flex flex-col items-center rounded-2xl border-2 p-3 text-center cursor-pointer transition-all hover:scale-105",
                      isSelected
                        ? "border-brand-cyan bg-cyan-50/50 shadow-md ring-2 ring-brand-cyan/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-white shadow">
                        <Check className="h-2.5 w-2.5 font-black" />
                      </div>
                    )}
                    <div className="h-14 w-14 overflow-hidden rounded-xl shadow-sm border border-slate-200 bg-slate-100">
                      {av.avatarUrl ? (
                        <img src={av.avatarUrl} alt={av.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-[11px] font-black text-slate-800 line-clamp-1">{av.name}</p>
                    <span className="mt-0.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-600">
                      {av.badge}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-end border-t border-slate-100 pt-3">
              <Button
                variant="ghost"
                onClick={() => setAvatarModalOpen(false)}
                className="text-xs font-bold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: EDIT MEMBER PROFILE (SUPER_ADMIN & TEAM_LEADER)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {memberEditModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Edit Member Profile: {editingMember.user.fullName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Update role, rank tier, team assignment, or account status.
                </p>
              </div>
              <button
                onClick={() => setMemberEditModalOpen(false)}
                className="rounded-xl p-1.5 hover:bg-slate-100 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={emName}
                  onChange={(e) => setEmName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={emPhone}
                  onChange={(e) => setEmPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                />
              </div>

              {isSuperOrAdmin && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">System Role</label>
                    <select
                      value={emRole}
                      onChange={(e) => setEmRole(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="TEAM_LEADER">TEAM_LEADER</option>
                      <option value="TRAINER">TRAINER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                    <select
                      value={emStatus}
                      onChange={(e) => setEmStatus(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING">PENDING</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rank Title</label>
                  <input
                    type="text"
                    value={emRank}
                    onChange={(e) => setEmRank(e.target.value)}
                    placeholder="e.g. Gold Executive"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Package Tier</label>
                  <select
                    value={emPackage}
                    onChange={(e) => setEmPackage(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                  >
                    <option value="Diamond Leader">Diamond Leader</option>
                    <option value="Gold Executive">Gold Executive</option>
                    <option value="Silver Associate">Silver Associate</option>
                    <option value="Bronze Starter">Bronze Starter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Team Squad</label>
                <input
                  type="text"
                  value={emTeam}
                  onChange={(e) => setEmTeam(e.target.value)}
                  placeholder="e.g. Addis Pioneers Squad"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-3">
              <Button
                variant="ghost"
                onClick={() => setMemberEditModalOpen(false)}
                className="flex-1 text-xs font-bold border border-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMemberEdit}
                className="flex-1 brand-gradient text-brand-navy text-xs font-black shadow-md hover:brightness-105"
              >
                Save Member Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
