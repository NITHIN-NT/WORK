"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  Mail, 
  UserCheck,
  Trash2
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/use-clients";
import { CreateClientModal } from "@/features/directory/components/create-client-modal";
import { Client } from "@/services/directory.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";



export default function ClientsClient() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clients, loading, addClient, deleteClient } = useClients();
  const { toast } = useToast();

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    toast("Client deleted successfully", "success");
  };

  const handleAddClient = (clientData: Omit<Client, "id" | "activeProjects" | "totalLTV" | "unpaidBalance" | "lastContact">) => {
    addClient(clientData);
    toast("Client added successfully", "success");
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.company.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-40 rounded-sm" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-sm" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-reveal-up pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic">
            Clients
            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">.</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-tight text-[11px] uppercase tracking-[0.4em]">External Stakeholder Coordination</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="px-12 h-16 rounded-2xl shadow-2xl"
        >
          <Plus className="w-5 h-5 mr-3" />
          Onboard Client
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="glass border-white/5 hover:border-primary/20 transition-all duration-500 overflow-hidden">
          <CardHeader className="p-10">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Active Entities</CardDescription>
            <CardTitle className="text-4xl font-black text-white tabular-nums italic tracking-tighter">{clients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass border-white/5 hover:border-emerald-500/20 transition-all duration-500 overflow-hidden">
          <CardHeader className="p-10">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Portfolio Value</CardDescription>
            <CardTitle className="text-4xl font-black text-white tabular-nums italic tracking-tighter">
              ₹{clients.reduce((s, c) => s + c.totalLTV, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass border-white/5 hover:border-amber-500/20 transition-all duration-500 overflow-hidden">
          <CardHeader className="p-10">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Pending Liquidity</CardDescription>
            <CardTitle className="text-4xl font-black text-white tabular-nums italic tracking-tighter">
              ₹{clients.reduce((s, c) => s + c.unpaidBalance, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 glass p-8 rounded-[2.5rem] border-white/5">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
          <Input 
            placeholder="Search coordination nodes..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-14 text-white font-black"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredClients.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/5">
            <Users className="h-16 w-16 text-zinc-700 mb-8 animate-pulse" />
            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Zero matching entities</p>
          </div>
        ) : filteredClients.map((client) => (
          <Card 
            key={client.id}
            className="glass border-white/5 hover:border-primary/30 transition-all duration-500 group shadow-none"
          >
            <div className="p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex items-center gap-8">
                  <div className="h-20 w-20 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-2xl">
                    <Building2 className="w-10 h-10 text-zinc-500 group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-black text-white tracking-tighter italic">{client.company}</h3>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border transition-all duration-500",
                        client.status === 'Active' 
                          ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                          : "bg-white/5 text-zinc-500 border-white/10"
                      )}>
                        {client.status}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 mt-1">
                      <div className="flex items-center gap-2 text-[13px] text-zinc-400 font-bold">
                        <UserCheck className="w-4.5 h-4.5 text-zinc-600" />
                        {client.name} 
                        {client.stakeholderRole && (
                          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-3 px-3 py-1 rounded-lg bg-white/5 border border-white/5">{client.stakeholderRole}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-zinc-500 font-medium">
                        <Mail className="w-4 h-4 text-zinc-600" /> {client.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 py-8 lg:py-0 border-t lg:border-t-0 border-white/5">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Deployments</p>
                    <p className="text-[14px] font-black text-white flex items-center gap-2 italic">
                       {client.activeProjects} Active
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Lifecycle</p>
                    <p className="text-[14px] font-black text-emerald-400 tabular-nums italic">₹{client.totalLTV.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Strategic PM</p>
                    <p className="text-[14px] font-black text-zinc-400">{client.accountManager || 'None'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]">Last Sync</p>
                    <p className="text-[14px] font-black text-white flex items-center gap-2 tabular-nums">
                      {client.lastContact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <DropdownMenu 
                    trigger={
                      <Button variant="ghost" size="icon" className="h-12 w-12 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <MoreVertical className="h-6 w-6" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem 
                      variant="destructive" 
                      onClick={() => {
                        handleDeleteClient(client.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Entity
                    </DropdownMenuItem>
                  </DropdownMenu>
                  <Button className="glass bg-white/5 hover:bg-white/10 text-white border-white/5 shadow-2xl h-14 px-8 font-black text-xs uppercase tracking-[0.2em] rounded-xl transition-all duration-500 hover:scale-105 active:scale-95">
                    Client Portal
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <CreateClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddClient}
      />
    </div>
  );
}

