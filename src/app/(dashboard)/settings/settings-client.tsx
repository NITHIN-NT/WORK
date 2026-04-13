"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  User, 
  Settings, 
  Globe, 
  Palette, 
  Bell, 
  CheckCircle2,
  ChevronRight,
  Languages,
  BadgeDollarSign,
  Shield,
  Mail,
  MoreHorizontal,
  UserPlus,
  ShieldAlert,
  UserMinus,
  Contact,
  Camera,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user";
import { useToast } from "@/components/ui/toast";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type SettingsTab = 'profile' | 'workspace' | 'appearance' | 'team' | 'notifications' | 'security';

import { useAuthStore } from "@/store/user";
import { useWorkspaceUsers } from "@/hooks/use-workspace-users";
import { useWorkspaceSettings } from "@/hooks/use-workspace-settings";
import { db } from "@/lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

export default function SettingsClient() {
  const { user } = useAuthStore();
  const { users, loading: teamLoading, updateUserRole } = useWorkspaceUsers();
  const { settings, loading: settingsLoading, updateSettings } = useWorkspaceSettings();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { name });
      toast("Profile identity synced", "success");
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCurrencyChange = (curr: string) => {
    updateSettings({ currency: curr });
    toast(`Currency updated to ${curr}`, "success");
  };

  const handleTimezoneChange = (tz: string) => {
    updateSettings({ timezone: tz });
    toast("Timezone relay updated", "success");
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'workspace', label: 'Workspace & Locale', icon: Globe },
    { id: 'team', label: 'Team & Access', icon: Shield },
    { id: 'appearance', label: 'Visual Theme', icon: Palette },
    { id: 'notifications', label: 'Alerts & Sync', icon: Bell },
  ];

  if (settingsLoading || teamLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Settings className="w-10 h-10 text-primary" />
            Settings
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Control your experience and workspace localization.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 border",
                activeTab === tab.id
                  ? "bg-primary/5 text-primary border-primary/20 shadow-sm shadow-primary/5"
                  : "text-zinc-500 border-zinc-50 hover:bg-zinc-100 hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-zinc-600")} />
              {tab.label}
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-foreground">Profile Identity</CardTitle>
                <CardDescription className="text-zinc-500">How you appear to your team and clients.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center gap-8 pb-8 border-b border-border">
                    <div className="h-24 w-24 rounded-3xl bg-zinc-100 border border-border flex items-center justify-center text-4xl font-black text-foreground shadow-sm group hover:scale-[1.02] transition-all overflow-hidden relative">
                      {user?.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="Avatar" 
                          fill
                          className="object-cover" 
                        />
                      ) : (
                        user?.displayName?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button type="button" variant="outline" size="sm" className="border-border bg-white h-10 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-foreground hover:bg-zinc-50 rounded-xl transition-all">
                        Change Avatar
                      </Button>
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.1em] pl-1">Photo synced from Auth relay.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Legal Identity / Name</label>
                      <Input name="name" defaultValue={user?.displayName || ""} className="h-12 bg-zinc-50 border-border focus:border-primary/50 text-foreground text-sm font-bold rounded-xl shadow-xs transition-all" />
                    </div>
                    <div className="space-y-3 opacity-60">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">System Email (Locked)</label>
                      <Input disabled value={user?.email || ""} className="h-12 bg-zinc-200 border-border text-zinc-500 text-sm font-bold rounded-xl shadow-xs transition-all cursor-not-allowed" />
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-[52px] px-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
                  >
                    {isSaving ? "Syncing Identity..." : "Save Identity"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
              <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-border/50 bg-zinc-50/30">
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black text-foreground tracking-tight">Team & Access</CardTitle>
                    <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Active workspace staff and external clients.</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Staff
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border bg-zinc-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Team Member</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Permission Role</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                          <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Last Auth</th>
                          <th className="px-8 py-5"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((u) => (
                          <tr key={u.id} className="group hover:bg-zinc-50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-zinc-400 group-hover:text-primary transition-all border border-border group-hover:bg-white group-hover:shadow-md">
                                  {u.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <p className="text-sm font-black text-foreground tracking-tight leading-none mb-1">{u.name}</p>
                                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <select 
                                defaultValue={u.role}
                                onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                                className="bg-white border border-border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 outline-none hover:border-primary/50 transition-all cursor-pointer shadow-sm focus:ring-4 focus:ring-primary/5"
                              >
                                {Object.values(UserRole).map(role => (
                                  <option key={role} value={role}>{role}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-8 py-6">
                              <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border shadow-xs inline-flex items-center gap-1.5",
                                u.status === 'Active' ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/20" : "text-zinc-400 bg-zinc-100 border-border"
                              )}>
                                <div className={cn("w-1 h-1 rounded-full", u.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-zinc-400")} />
                                {u.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                              {u.lastSeen}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <DropdownMenu 
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-foreground hover:bg-white rounded-xl transition-all">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                }
                              >
                                <DropdownMenuItem onClick={() => toast("User profile opening", "info")}>
                                  <Contact className="w-3.5 h-3.5 mr-2" /> View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast("Permissions requested from Owner", "info")}>
                                  <ShieldAlert className="w-3.5 h-3.5 mr-2" /> Audit Access
                                </DropdownMenuItem>
                                <div className="h-px bg-border my-1" />
                                <DropdownMenuItem 
                                  variant="destructive" 
                                  onClick={() => toast(`Removal logic would trigger for ${u.name}`, "info")}
                                >
                                  <UserMinus className="w-3.5 h-3.5 mr-2" /> Remove Member
                                </DropdownMenuItem>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                      <div className="p-12 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                        No team members registered.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20 p-6 flex gap-6 items-center shadow-sm rounded-3xl">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center border border-primary/10 shadow-sm">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-foreground italic">RBAC Guard Active</h4>
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5 group">
                      <Image 
                        src={user?.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"} 
                        alt="Profile Avatar" 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h4 className="text-base font-black text-foreground italic">Invite Audit Relay</h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">Auth logs generated for every team intersection.</p>
                  </div>
                </Card>
                <Card className="bg-card border-border p-6 flex gap-6 items-center shadow-sm rounded-3xl">
                  <div className="h-14 w-14 rounded-2xl bg-zinc-50 flex items-center justify-center border border-border shadow-sm">
                    <Mail className="w-7 h-7 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-foreground italic">Invite Audit Relay</h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed">Auth logs generated for every team intersection.</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-border/50">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <Languages className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black text-foreground tracking-tight">Workspace & Locale</CardTitle>
                    <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Regional relays and financial localization.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-10">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BadgeDollarSign className="w-4 h-4 text-primary" /> Default Currency Relay
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {['INR', 'USD', 'EUR'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => handleCurrencyChange(curr)}
                        className={cn(
                          "px-6 py-6 rounded-3xl border text-base font-black transition-all group shadow-sm flex flex-col items-center justify-center gap-2",
                          settings.currency === curr 
                            ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105" 
                            : "bg-zinc-50 text-zinc-400 border-border hover:bg-white hover:border-primary/20"
                        )}
                      >
                        {curr}
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-widest opacity-60",
                          settings.currency === curr ? "text-primary-foreground" : "text-zinc-500"
                        )}>
                          {curr === 'INR' ? 'Rupee (₹)' : curr === 'USD' ? 'US Dollar ($)' : 'Euro (€)'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-border/50">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Regional Time-Sync</label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => handleTimezoneChange(e.target.value)}
                    className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-14 rounded-2xl px-6 text-sm font-black outline-none transition-all shadow-sm cursor-pointer appearance-none hover:bg-white"
                  >
                    <option value="(GMT+05:30) Mumbai, New Delhi">(GMT+05:30) Mumbai, New Delhi</option>
                    <option value="(GMT-08:00) Pacific Time Zone">(GMT-08:00) Pacific Time Zone</option>
                    <option value="(GMT+01:00) Central European Relay">(GMT+01:00) Central European Relay</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-900 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black text-foreground tracking-tight">Visual Shell</CardTitle>
                    <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Aesthetic controls for the workspace workspace experience.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 grid gap-6">
                {[
                  { id: 'custom', name: 'Studio Light', desc: 'Obsidian on Warm White (Active)', primary: 'bg-white border-border shadow-md' },
                  { id: 'dark', name: 'Midnight', desc: 'Standard deep space dark mode', primary: 'bg-zinc-900' },
                  { id: 'ocean', name: 'Oceanic', desc: 'Muted navy blues and architecture grays', primary: 'bg-slate-800' },
                ].map((theme) => (
                  <div 
                    key={theme.id}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[2rem] transition-all cursor-pointer group shadow-sm border-2",
                      theme.id === 'custom' 
                        ? "bg-zinc-50 border-primary/20 shadow-md" 
                        : "bg-white border-border hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-6">
                      <div className={cn("h-16 w-32 rounded-2xl shadow-inner", theme.primary)} />
                      <div>
                        <p className="text-lg font-black text-foreground italic">{theme.name}</p>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{theme.desc}</p>
                      </div>
                    </div>
                    {theme.id === 'custom' && (
                      <div className="flex items-center gap-2 px-6 py-2.5 bg-white border border-primary/20 rounded-2xl text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Selected
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-border/50 bg-zinc-50/30">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black text-foreground tracking-tight">Alerts & Sync</CardTitle>
                    <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Configure how you receive workspace updates.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-sm font-black text-foreground uppercase tracking-widest italic">Email Relays</h4>
                  {[
                    { id: 'proj-updates', label: 'Project Milestones', desc: 'Notify when a major project goal is reached.' },
                    { id: 'financial', label: 'Financial Alerts', desc: 'Critical updates on invoice status and payments.' },
                    { id: 'team', label: 'Team Invitations', desc: 'Alerts when new staff join your workspaces.' }
                  ].map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-50 bg-zinc-50/50 hover:bg-white hover:border-primary/20 transition-all group">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">{notif.label}</p>
                        <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">{notif.desc}</p>
                      </div>
                      <div className="h-6 w-11 bg-zinc-200 rounded-full relative cursor-pointer overflow-hidden border border-border group-hover:border-primary/30">
                        <div className="absolute top-1 left-1 h-3.5 w-3.5 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-border/50 bg-rose-500/10">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-3xl font-black text-foreground tracking-tight">Security Audit</CardTitle>
                    <CardDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Monitor auth sessions and core security policies.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 shadow-xl overflow-hidden relative group">
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-rose-500/10 blur-[80px] rounded-full group-hover:bg-rose-500/20 transition-all duration-700" />
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-rose-500" />
                        <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Two-Factor Authentication</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-[8px] font-black uppercase tracking-widest border border-rose-500/30">Highly Recommended</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-md">Add an additional layer of verification to your workspace identity to prevent unauthorized access.</p>
                    <Button className="bg-white hover:bg-zinc-100 text-zinc-900 font-black h-10 px-8 rounded-xl shadow-lg transition-all active:scale-95">
                      Activate 2FA
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Recent Auth Sessions</h4>
                  <div className="divide-y divide-border border rounded-2xl overflow-hidden shadow-sm">
                    {[
                      { city: 'Mumbai', device: 'MacBook Pro', status: 'Active Now', ip: '192.168.1.1' },
                      { city: 'Delhi', device: 'iPhone 15', status: '2h ago', ip: '192.168.1.42' }
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-white hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-zinc-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-foreground tracking-tight italic">{session.device}</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{session.city} • {session.ip}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{session.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
