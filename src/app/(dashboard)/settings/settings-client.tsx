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
    <div className="space-y-12 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Settings</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Manage your account and workspace preferences.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-80 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[12px] font-bold transition-all border",
                activeTab === tab.id
                  ? "bg-primary text-white border-primary shadow-none"
                  : "bg-white text-zinc-500 border-border/60 hover:bg-zinc-50 hover:text-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-zinc-400")} />
              <span className="flex-1 text-left">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-10">
          {activeTab === 'profile' && (
            <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="p-10 border-b border-border/40">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Profile</CardTitle>
                <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={synchronizeProfileIdentity} className="space-y-10">
                  <div className="flex items-center gap-10">
                    <div className="h-24 w-24 rounded-3xl bg-zinc-50 border border-border flex items-center justify-center text-3xl font-bold text-foreground shadow-none relative overflow-hidden group">
                      {user?.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="ID" 
                          fill
                          priority
                          className="object-cover" 
                        />
                      ) : (
                        user?.displayName?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="space-y-3">
                      <Button type="button" variant="outline" className="border-border bg-white h-11 px-6 font-bold text-xs rounded-xl shadow-none">
                        Upload Photo
                      </Button>
                      <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">Supports JPG, PNG or GIF.</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Full Name</label>
                      <Input name="name" defaultValue={user?.displayName || ""} className="h-14 bg-zinc-50/50 border-border text-foreground font-bold rounded-xl shadow-none focus:bg-white" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Email Address</label>
                      <Input disabled value={user?.email || ""} className="h-14 bg-zinc-100 border-border text-zinc-400 font-bold rounded-xl shadow-none cursor-not-allowed" />
                    </div>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 text-white font-black h-14 px-12 rounded-2xl shadow-none transition-all"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between p-10 border-b border-border/40">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Team Members</CardTitle>
                  <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Manage who has access to your workspace.</CardDescription>
                </div>
                <Button onClick={handleGrantAccess} className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-xl shadow-none">
                  <UserPlus className="w-4 h-4 mr-3" />
                  Invite User
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-zinc-50/30">
                        <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">User</th>
                        <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Role</th>
                        <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Last Active</th>
                        <th className="px-10 py-5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {users.map((u) => (
                        <tr key={u.id} className="group hover:bg-zinc-50/50 transition-colors">
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 border border-border group-hover:bg-white transition-all">
                                {u.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="text-[14px] font-bold text-foreground tracking-tight leading-none mb-1.5">{u.name}</p>
                                <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                            <select 
                              defaultValue={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                              className="bg-white border border-border rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 outline-none hover:border-primary/50 transition-all cursor-pointer shadow-none"
                            >
                              {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-10 py-6">
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border inline-flex items-center gap-2",
                              u.status === 'Active' ? "text-white bg-primary border-primary" : "text-zinc-400 bg-zinc-50 border-border"
                            )}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 tabular-nums">
                            {u.lastSeen}
                          </td>
                          <td className="px-10 py-6 text-right">
                            <DropdownMenu 
                              trigger={
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-300 hover:text-foreground hover:bg-white transition-all">
                                  <MoreHorizontal className="w-5 h-5" />
                                </Button>
                              }
                            >
                              <DropdownMenuItem 
                                variant="destructive" 
                                onClick={() => handleRemoveUser(u.id, u.name)}
                              >
                                <UserMinus className="w-4 h-4 mr-2" /> Revoke Access
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
            <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="p-10 border-b border-border/40">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Workspace Preferences</CardTitle>
                <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Set your default currency and timezone.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] block">Currency</label>
                  <div className="grid grid-cols-3 gap-6">
                    {['INR', 'USD', 'EUR'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => updateCurrencyRelay(curr)}
                        className={cn(
                          "px-8 py-8 rounded-3xl border text-[14px] font-bold transition-all flex flex-col items-center justify-center gap-3",
                          settings.currency === curr 
                            ? "bg-primary text-white border-primary" 
                            : "bg-zinc-50/50 text-zinc-400 border-border hover:bg-white hover:border-primary/30"
                        )}
                      >
                        <span className="text-xl">{curr}</span>
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-[0.3em]",
                          settings.currency === curr ? "text-white/60" : "text-zinc-300"
                        )}>
                          {curr === 'INR' ? 'Rupee' : curr === 'USD' ? 'Dollar' : 'Euro'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-border/30">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] block">Timezone</label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => synchronizeTemporalZone(e.target.value)}
                    className="w-full bg-zinc-50 border border-border focus:border-primary/50 text-foreground h-14 rounded-xl px-6 text-sm font-bold outline-none transition-all cursor-pointer appearance-none hover:bg-white"
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
            <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="p-10 border-b border-border/40">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Appearance</CardTitle>
                <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Customize how your workspace looks.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 grid gap-8">
                {[
                  { id: 'custom', name: 'Light Mode', desc: 'Default light theme', primary: 'bg-white border-border' },
                  { id: 'dark', name: 'Dark Mode', desc: 'Dark theme for low light environments', primary: 'bg-zinc-900' },
                ].map((theme) => (
                  <div 
                    key={theme.id}
                    onClick={() => updateSettings({ theme: theme.id as 'custom' | 'dark' })}
                    className={cn(
                      "flex items-center justify-between p-8 rounded-3xl transition-all cursor-pointer border-2",
                      settings.theme === theme.id 
                        ? "bg-zinc-50 border-primary" 
                        : "bg-white border-border/60 hover:bg-zinc-50"
                    )}
                  >
                    <div className="flex items-center gap-8">
                      <div className={cn("h-12 w-24 rounded-xl border", theme.primary)} />
                      <div>
                        <p className="text-lg font-bold text-foreground tracking-tight">{theme.name}</p>
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">{theme.desc}</p>
                      </div>
                    </div>
                    {settings.theme === theme.id && (
                      <div className="flex items-center gap-3 px-5 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em]">
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
            <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="p-10 border-b border-border/40 bg-zinc-50/20">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Notifications</CardTitle>
                <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Choose what you want to be notified about.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-10">
                <div className="flex items-center justify-between p-6 bg-zinc-50 border border-border/60 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-[12px] font-bold text-foreground">Test Notifications</p>
                    <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-tight">Send a test notification to verify your settings.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={dispatchSystemVerification}
                    className="border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest h-10 px-6 rounded-xl hover:bg-primary hover:text-white transition-all shadow-none"
                  >
                    Send Test
                  </Button>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 'milestone', label: 'Project Milestones', desc: 'Get notified when projects reach their goals.', active: settings.milestone_alerts, toggle: toggleMilestoneAlerts },
                    { id: 'financial', label: 'Financial Alerts', desc: 'Get notified about invoices and payments.', active: settings.financial_alerts, toggle: toggleFinancialAlerts },
                  ].map((notif) => (
                    <div key={notif.id} className="flex items-center justify-between p-6 rounded-2xl border border-border/40 hover:bg-zinc-50 transition-colors">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground tracking-tight">{notif.label}</p>
                        <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">{notif.desc}</p>
                      </div>
                      <div 
                        onClick={notif.toggle}
                        className={cn(
                          "h-6 w-11 rounded-full relative cursor-pointer border transition-colors",
                          notif.active ? "bg-primary border-primary/20" : "bg-zinc-200 border-zinc-300"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 h-3.5 w-3.5 bg-white rounded-full transition-all",
                          notif.active ? "right-1" : "left-1"
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
              <CardHeader className="p-10 border-b border-border/40 bg-zinc-50/20">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Security</CardTitle>
                <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Manage your account security and active sessions.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 space-y-12">
                <div className="p-8 bg-zinc-900 rounded-[2.5rem] border border-zinc-900 shadow-none relative overflow-hidden group">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-white" />
                        <h4 className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Two-Factor Authentication</h4>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed max-w-sm">Add an extra layer of security to your account.</p>
                    <Button 
                      onClick={toggleMFA}
                      className={cn(
                        "font-black h-12 px-10 rounded-xl shadow-none transition-all active:scale-95",
                        settings.mfa_enabled 
                          ? "bg-rose-500 hover:bg-rose-600 text-white" 
                          : "bg-white hover:bg-zinc-100 text-zinc-900"
                      )}
                    >
                      {settings.mfa_enabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Active Sessions</h4>
                  <div className="divide-y divide-border/40 border border-border/60 rounded-2xl overflow-hidden shadow-none">
                    {[
                      { city: 'Mumbai', device: 'System Workstation', status: 'Active', ip: '192.168.1.1' },
                      { city: 'Delhi', device: 'Mobile Endpoint', status: 'Idle', ip: '192.168.1.42' }
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-white hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-border flex items-center justify-center">
                            <Globe className="w-5 h-5 text-zinc-300" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground tracking-tight">{session.device}</p>
                            <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">{session.city} • {session.ip}</p>
                          </div>
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.2em]",
                          session.status === 'Active' ? "text-primary italic animate-pulse" : "text-zinc-300"
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

