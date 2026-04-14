"use client";

import { useState } from "react";
import { 
  UserPlus, 
  UserMinus, 
  MoreHorizontal,
  Users2,
  Calendar,
  Shield,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user";
import { useToast } from "@/components/ui/toast";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useWorkspaceUsers } from "@/hooks/use-workspace-users";
import { InviteUserModal } from "@/components/shared/invite-user-modal";
import MiscellaneousClient from "../settings/miscellaneous-client";

type TeamView = 'registry' | 'config';

export default function TeamClient() {
  const { users, loading, updateUserRole, removeUser, inviteUser } = useWorkspaceUsers();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<TeamView>('registry');
  const { toast } = useToast();

  const handleRemoveUser = async (userId: string, name: string) => {
    try {
      await removeUser(userId);
      toast(`Access revoked for ${name}`, "success");
    } catch {
      toast("Failed to revoke access", "error");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-5 w-5 rounded-md bg-primary/10 flex items-center justify-center">
              <Users2 className="w-3 h-3 text-primary" />
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Workspace Team</p>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Team Management</h1>
          <p className="text-sm font-medium text-zinc-500 max-w-xl">
            Configure access protocols, manage cryptographic identities, and onboard new personnel.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-zinc-100 p-1 rounded-sm flex items-center gap-1">
            <button 
              onClick={() => setActiveView('registry')}
              className={cn(
                "px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
                activeView === 'registry' ? "bg-white text-foreground shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              Personnel Registry
            </button>
            <button 
              onClick={() => setActiveView('config')}
              className={cn(
                "px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all",
                activeView === 'config' ? "bg-white text-foreground shadow-sm" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              Registry Configuration
            </button>
          </div>
          {activeView === 'registry' && (
            <Button 
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-12 rounded-sm shadow-none transition-all flex items-center gap-3"
            >
              <UserPlus className="w-4 h-4" />
              Onboard Personnel
            </Button>
          )}
        </div>
      </div>

      {activeView === 'registry' ? (
        <>
          {/* Stats Quick Look */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {[
              { label: "Active Members", value: users.filter(u => u.status === 'Active').length, icon: Shield, color: "text-emerald-500" },
              { label: "Pending Approvals", value: users.filter(u => u.status === 'Pending').length, icon: Calendar, color: "text-orange-500" },
              { label: "Total Capacity", value: users.length, icon: Activity, color: "text-primary" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border border-border p-6 rounded-sm flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                </div>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
            ))}
          </div>

          {/* Main Table */}
          <Card className="bg-white border-border/60 shadow-none rounded-md overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
            <CardHeader className="p-10 border-b border-border/40 bg-zinc-50/20">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-foreground tracking-tight">Access Registry</CardTitle>
                <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pt-1">
                  Live verification of all authenticated workspace identities.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-zinc-50/50">
                      <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Personnel</th>
                      <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Assignment</th>
                      <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Network Status</th>
                      <th className="px-10 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Last Active</th>
                      <th className="px-10 py-5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {users.map((u) => (
                      <tr key={u.id} className="group hover:bg-zinc-50/50 transition-colors">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-sm bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 border border-border group-hover:bg-white transition-all text-sm shadow-sm">
                              {u.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-[15px] font-bold text-foreground tracking-tight leading-none mb-2">{u.name}</p>
                              <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <select 
                            defaultValue={u.role}
                            onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                            className="bg-white border border-border rounded-sm px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 outline-none hover:border-primary/50 transition-all cursor-pointer shadow-none"
                          >
                            {Object.values(UserRole).map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-10 py-8">
                          <span className={cn(
                            "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border inline-flex items-center gap-2",
                            u.status === 'Active' ? "text-white bg-primary border-primary" : "text-zinc-500 bg-zinc-50 border-border"
                          )}>
                            <div className={cn("h-1.5 w-1.5 rounded-full", u.status === 'Active' ? "bg-white animate-pulse" : "bg-zinc-300")} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-zinc-400 tabular-nums">
                          {u.lastSeen}
                        </td>
                        <td className="px-10 py-8 text-right">
                          <DropdownMenu 
                            trigger={
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-300 hover:text-foreground hover:bg-white transition-all rounded-sm">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            }
                          >
                            <DropdownMenuItem 
                              variant="destructive" 
                              onClick={() => handleRemoveUser(u.id, u.name || "User")}
                            >
                              <UserMinus className="w-4 h-4 mr-2" /> Revoke Access
                            </DropdownMenuItem>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {loading && (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center">
                          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest animate-pulse">Synchronizing Registry...</p>
                        </td>
                      </tr>
                    )}
                    {!loading && users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-zinc-400 font-medium italic">
                          No authenticated identities found in registry.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-700">
          <MiscellaneousClient />
        </div>
      )}

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
