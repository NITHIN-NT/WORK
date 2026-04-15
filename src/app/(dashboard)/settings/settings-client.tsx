"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  User, 
  Globe, 
  Palette, 
  Bell, 
  CheckCircle2,
  ChevronRight,
  Shield,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user";
import { useToast } from "@/components/ui/toast";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/user";
import { useWorkspaceUsers } from "@/hooks/use-workspace-users";
import { useWorkspaceSettings } from "@/hooks/use-workspace-settings";
import { UserService } from "@/services/user.service";
import { SystemService } from "@/services/system.service";
import { InviteUserModal } from "@/components/shared/invite-user-modal";

type SettingsTab = 'profile' | 'workspace' | 'appearance' | 'team' | 'notifications' | 'security';

export default function SettingsClient() {
  const { user } = useAuthStore();
  const { users, loading: teamLoading, updateUserRole, removeUser, inviteUser } = useWorkspaceUsers();
  const { settings, loading: settingsLoading, updateSettings } = useWorkspaceSettings();
  
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { toast } = useToast();

  const dispatchSystemVerification = async () => {
    if (!user) return;
    try {
      await SystemService.dispatchNotificationRelay({
        userId: user.uid,
        title: "System Protocol Test",
        body: "Cryptographic handshake confirmed. Workspace alert relay is fully operational.",
        type: 'success'
      });
      toast("Verification pulse dispatched", "success");
    } catch {
      toast("Alert relay failure", "error");
    }
  };

  const synchronizeProfileIdentity = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      await UserService.synchronizeProfileIdentity(user.uid, { name });
      toast("Identity profile synchronized", "success");
    } catch {
      toast("Synchronization failure", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const updateCurrencyRelay = (currency: string) => {
    updateSettings({ currency });
    toast(`Financial relay updated to ${currency}`, "success");
  };

  const synchronizeTemporalZone = (timezone: string) => {
    updateSettings({ timezone });
    toast("Temporal synchronization active", "success");
  };

  const handleRemoveUser = async (userId: string, name: string) => {
    await removeUser(userId);
    toast(`Access revoked for ${name}`, "success");
  };

  const handleGrantAccess = () => {
    setIsInviteModalOpen(true);
  };

  const toggleMilestoneAlerts = () => {
    const newState = !settings.milestone_alerts;
    updateSettings({ milestone_alerts: newState });
    toast(`Milestone alerts ${newState ? 'enabled' : 'disabled'}`, "success");
  };

  const toggleFinancialAlerts = () => {
    const newState = !settings.financial_alerts;
    updateSettings({ financial_alerts: newState });
    toast(`Financial alerts ${newState ? 'enabled' : 'disabled'}`, "success");
  };

  const toggleMFA = () => {
    const newState = !settings.mfa_enabled;
    updateSettings({ mfa_enabled: newState });
    toast(`Multi-Factor Authentication ${newState ? 'initialized' : 'disabled'}`, "success");
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'workspace', label: 'Workspace', icon: Globe },
    { id: 'team', label: 'Team', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  if (settingsLoading || teamLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Loading Settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-reveal-up pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic">
            Settings
            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">.</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-tight text-[11px] uppercase tracking-[0.4em]">Integrated Core Configuration</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-80 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-500 border",
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)] scale-105"
                  : "glass text-zinc-500 border-white/5 hover:bg-white/5 hover:text-white"
              )}
            >
              <tab.icon className={cn("w-5 h-5 transition-transform duration-500", activeTab === tab.id ? "text-white scale-110" : "text-zinc-600")} />
              <span className="flex-1 text-left">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-10">
          {activeTab === 'profile' && (
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 border-b border-white/5">
                <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Identity Management</CardTitle>
                <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pt-2">Synchronization profile parameters</CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <form onSubmit={synchronizeProfileIdentity} className="space-y-12">
                  <div className="flex items-center gap-10">
                    <div className="h-32 w-32 rounded-[2rem] bg-white/5 border border-white/5 flex items-center justify-center text-4xl font-black text-white shadow-2xl relative overflow-hidden group">
                      {user?.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="ID" 
                          fill
                          priority
                          className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                        />
                      ) : (
                        user?.displayName?.charAt(0) || 'U'
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Palette className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button type="button" variant="outline" className="border-white/5 glass h-14 px-10 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                        Update Core Avatar
                      </Button>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">Handshake supports JPG, PNG, GIF</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Operator Name</label>
                      <Input name="name" defaultValue={user?.displayName || ""} className="h-16 text-white font-black" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Endpoint Identity</label>
                      <Input disabled value={user?.email || ""} className="h-16 bg-white/5 border-white/5 text-zinc-600 font-bold italic" />
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="h-16 px-16 rounded-2xl shadow-none active:scale-95 transition-all"
                  >
                    {isSaving ? "Syncing..." : "Push Updates"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-12 border-b border-white/5 bg-white/[0.02]">
                <div className="space-y-2">
                  <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Operational Unit</CardTitle>
                  <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pt-1">Authorized workspace access ledger</CardDescription>
                </div>
                <Button onClick={handleGrantAccess} className="px-10 h-14 rounded-xl">
                  <UserPlus className="w-5 h-5 mr-3" />
                  Grant Access
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="px-12 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Operator</th>
                        <th className="px-12 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Clearance</th>
                        <th className="px-12 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Status</th>
                        <th className="px-12 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Last Heartbeat</th>
                        <th className="px-12 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((u) => (
                        <tr key={u.id} className="group hover:bg-white/[0.03] transition-colors">
                          <td className="px-12 py-8">
                            <div className="flex items-center gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center font-black text-white border border-white/10 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                {u.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="text-lg font-black text-white tracking-tight italic mb-1.5">{u.name}</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-12 py-8">
                            <select 
                              defaultValue={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                              className="bg-white/5 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none hover:border-primary/50 transition-all cursor-pointer"
                            >
                              {Object.values(UserRole).map(role => (
                                <option key={role} value={role} className="bg-zinc-900">{role}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-12 py-8">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border inline-flex items-center gap-2",
                              u.status === 'Active' 
                                ? "text-primary bg-primary/20 border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.1)]" 
                                : "text-zinc-600 bg-white/5 border-white/10"
                            )}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 tabular-nums italic">
                            {u.lastSeen}
                          </td>
                          <td className="px-12 py-8 text-right">
                            <DropdownMenu 
                              trigger={
                                <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-600 hover:text-white hover:bg-white/5 transition-all">
                                  <MoreHorizontal className="w-6 h-6" />
                                </Button>
                              }
                            >
                              <DropdownMenuItem 
                                variant="destructive" 
                                onClick={() => handleRemoveUser(u.id, u.name)}
                              >
                                <UserMinus className="w-4 h-4 mr-2" /> Revoke Keys
                              </DropdownMenuItem>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'workspace' && (
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 border-b border-white/5">
                <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Workspace Protocol</CardTitle>
                <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pt-2">Global transaction and temporal standards</CardDescription>
              </CardHeader>
              <CardContent className="p-12 space-y-12">
                <div className="space-y-8">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] block">Financial Manifest Relay</label>
                  <div className="grid grid-cols-3 gap-8">
                    {['INR', 'USD', 'EUR'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => updateCurrencyRelay(curr)}
                        className={cn(
                          "px-10 py-12 rounded-[2rem] border text-[14px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex flex-col items-center justify-center gap-4",
                          settings.currency === curr 
                            ? "bg-primary text-white border-primary shadow-[0_0_30px_rgba(var(--primary),0.2)] scale-105" 
                            : "bg-white/5 text-zinc-600 border-white/5 hover:bg-white/10 hover:border-primary/30"
                        )}
                      >
                        <span className="text-3xl font-black italic tracking-tighter">{curr}</span>
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-[0.4em]",
                          settings.currency === curr ? "text-white/60" : "text-zinc-600"
                        )}>
                          {curr === 'INR' ? 'Indian Rupee' : curr === 'USD' ? 'US Dollar' : 'Euro Unit'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-8 pt-12 border-t border-white/5">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] block">Temporal Synchronization</label>
                  <div className="relative group">
                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-hover:text-primary transition-colors duration-500" />
                    <select 
                      value={settings.timezone}
                      onChange={(e) => synchronizeTemporalZone(e.target.value)}
                      className="w-full h-16 bg-white/5 border border-white/5 text-white font-black pl-16 pr-8 rounded-2xl appearance-none cursor-pointer hover:bg-white/10 transition-all outline-none"
                    >
                      <option value="(GMT+05:30) Mumbai, New Delhi" className="bg-zinc-900">UTC+05:30 • IST Zone</option>
                      <option value="(GMT-08:00) Pacific Time Zone" className="bg-zinc-900">UTC-08:00 • PST Node</option>
                      <option value="(GMT+01:00) Central European Relay" className="bg-zinc-900">UTC+01:00 • CE Relay</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 border-b border-white/5">
                <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Visual Synthesis</CardTitle>
                <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pt-2">Interface matrix configuration</CardDescription>
              </CardHeader>
              <CardContent className="p-12 grid gap-10">
                {[
                  { id: 'custom', name: 'Legacy Light', desc: 'High luminance industrial relay', primary: 'bg-white border-zinc-200' },
                  { id: 'dark', name: 'Titanium Dark', desc: 'Deep-void premium synthesis', primary: 'bg-zinc-900 border-white/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.5)]' },
                ].map((theme) => (
                  <div 
                    key={theme.id}
                    onClick={() => updateSettings({ theme: theme.id as 'custom' | 'dark' })}
                    className={cn(
                      "flex items-center justify-between p-10 rounded-[2.5rem] transition-all duration-700 cursor-pointer border-2",
                      settings.theme === theme.id 
                        ? "bg-white/5 border-primary shadow-[0_0_30px_rgba(var(--primary),0.1)]" 
                        : "bg-transparent border-white/5 hover:bg-white/[0.02]"
                    )}
                  >
                    <div className="flex items-center gap-10">
                      <div className={cn("h-16 w-32 rounded-2xl border flex items-center justify-center relative overflow-hidden", theme.primary)}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      </div>
                      <div>
                        <p className="text-2xl font-black text-white tracking-tighter italic">{theme.name}</p>
                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-2 italic">{theme.desc}</p>
                      </div>
                    </div>
                    {settings.theme === theme.id && (
                      <div className="flex items-center gap-3 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                        <CheckCircle2 className="w-4 h-4" />
                        Active
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Alert Relay</CardTitle>
                <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pt-2">Objective notification stream logic</CardDescription>
              </CardHeader>
              <CardContent className="p-12 space-y-12">
                <div className="flex items-center justify-between p-10 glass border-primary/20 bg-primary/5 rounded-[2rem]">
                  <div className="space-y-2">
                    <p className="text-lg font-black text-white tracking-tight italic leading-none">Diagnostic Pulse</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Verify cryptographic relay handshake</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={dispatchSystemVerification}
                    className="border-white/10 glass text-primary text-[10px] font-black uppercase tracking-[0.4em] h-14 px-10 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-none"
                  >
                    Send Pulse
                  </Button>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 'milestone', label: 'Milestone Thresholds', desc: 'Critical operational completion alerts', active: settings.milestone_alerts, toggle: toggleMilestoneAlerts },
                    { id: 'financial', label: 'Financial Liquidity', desc: 'Monetary event and invoice notifications', active: settings.financial_alerts, toggle: toggleFinancialAlerts },
                  ].map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-10 rounded-[2rem] border border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <div className="space-y-2">
                        <p className="text-lg font-black text-white group-hover:text-primary transition-colors tracking-tight italic leading-none">{notif.label}</p>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{notif.desc}</p>
                      </div>
                      <div 
                        onClick={notif.toggle}
                        className={cn(
                          "h-8 w-14 rounded-full relative cursor-pointer border transition-all duration-500",
                          notif.active ? "bg-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]" : "bg-white/5 border-white/10"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1.5 h-4 w-4 bg-white rounded-full transition-all duration-500 shadow-xl",
                          notif.active ? "right-1.5 scale-110" : "left-1.5"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="glass border-white/5 rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-12 border-b border-white/5 bg-white/[0.01]">
                <CardTitle className="text-3xl font-black text-white tracking-tighter italic">Hardened Security</CardTitle>
                <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] pt-2">Cryptographic integrity and session control</CardDescription>
              </CardHeader>
              <CardContent className="p-12 space-y-12">
                <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Shield className="w-32 h-32 text-primary" />
                  </div>
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <h4 className="text-2xl font-black text-white italic tracking-tighter">Two-Factor Authentication</h4>
                    </div>
                    <p className="text-sm text-zinc-400 font-bold leading-relaxed max-w-sm italic">Multi-layer defense protocol for identity verification.</p>
                    <Button 
                      onClick={toggleMFA}
                      className={cn(
                        "h-16 px-16 rounded-[1.5rem] shadow-none active:scale-95 transition-all font-black text-xs uppercase tracking-[0.3em]",
                        settings.mfa_enabled 
                          ? "bg-rose-500 hover:bg-rose-600 text-white" 
                          : "bg-white hover:bg-zinc-100 text-black"
                      )}
                    >
                      {settings.mfa_enabled ? 'Disable Defense' : 'Initialize Defense'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-10">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] block italic">Active Terminal Nodes</h4>
                  <div className="divide-y divide-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    {[
                      { city: 'Mumbai Node', device: 'Strategic Workstation', status: 'Primary', ip: '10.x.x.102' },
                      { city: 'Delhi Relay', device: 'Mobile Endpoint', status: 'Idle', ip: '10.x.x.214' }
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-10 bg-transparent hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-8">
                          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shadow-xl group hover:bg-primary transition-all duration-500">
                            <Globe className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-white tracking-tight italic">{session.device}</p>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">{session.city} • {session.ip}</p>
                          </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.4em] px-4 py-1.5 rounded-full border",
                          session.status === 'Primary' 
                            ? "text-primary border-primary/30 bg-primary/10 italic animate-pulse" 
                            : "text-zinc-600 border-white/5 bg-white/5"
                        )}>
                          {session.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <InviteUserModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={async (email, role) => {
          await inviteUser(email, role);
          toast(`Invitation sent to ${email}`, "success");
        }}
      />
    </div>
  );
}

