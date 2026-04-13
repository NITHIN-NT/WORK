"use client";

import { useState } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Building2, 
  Mail, 
  ArrowUpRight,
  BadgeDollarSign,
  Layers,
  Clock,
  UserCheck,
  Pencil,
  Trash2,
  ShieldCheck
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/user";
import { useClients } from "@/hooks/use-clients";
import { CreateClientModal } from "@/components/clients/create-client-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Lead';
  activeProjects: number;
  totalLTV: number;
  unpaidBalance: number;
  lastContact: string;
  stakeholderRole: UserRole;
  accountManager: string;
  logoUrl?: string;
}



export default function ClientsClient() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clients, loading, addClient, deleteClient } = useClients();
  const { toast } = useToast();

  const handleDeleteClient = (id: string) => {
    deleteClient(id);
    toast("Client profile deleted", "success");
  };

  const handleAddClient = (clientData: Omit<Client, 'id' | 'activeProjects' | 'totalLTV' | 'unpaidBalance' | 'lastContact'>) => {
    addClient(clientData);
    toast("Client profile created", "success");
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Users className="w-10 h-10 text-primary" />
            Clients
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Manage and nurture your primary client relationships.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border/50 shadow-sm group hover:border-primary/20 transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Layers className="w-3 h-3 text-primary" /> Total Accounts
            </CardDescription>
            <CardTitle className="text-3xl font-black text-foreground">{clients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card border-border/50 shadow-sm group hover:border-emerald-500/20 transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-emerald-500/70">
              <BadgeDollarSign className="w-3 h-3" /> Total LTV
            </CardDescription>
            <CardTitle className="text-3xl font-black text-foreground">
              ₹{clients.reduce((s, c) => s + c.totalLTV, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card border-border/50 shadow-sm group hover:border-rose-500/20 transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-rose-500/70">
              <BadgeDollarSign className="w-3 h-3" /> Unpaid Balances
            </CardDescription>
            <CardTitle className="text-3xl font-black text-foreground">
              ₹{clients.reduce((s, c) => s + c.unpaidBalance, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search clients by name, company, or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-50 border-border focus:border-primary/50 text-foreground"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {['Active', 'Lead', 'Inactive'].map(s => (
            <Button key={s} variant="outline" size="sm" className="flex-1 sm:flex-none border-border bg-white text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 hover:text-foreground">
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="grid gap-4">
        {filteredClients.map((client) => (
          <Card 
            key={client.id}
            className="bg-card border-border/50 hover:border-primary/20 transition-all group shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center border border-border shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <Building2 className="w-8 h-8 text-zinc-300 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-black text-foreground tracking-tight">{client.company}</h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        client.status === 'Active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        client.status === 'Lead' ? "bg-primary/10 text-primary border-primary/20" :
                        "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                      )}>
                        {client.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 py-1">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold group-hover:text-foreground transition-colors">
                        <UserCheck className="w-3.5 h-3.5 text-primary" />
                        {client.name} 
                        <span className="text-[10px] opacity-60 font-medium px-2 py-0.5 rounded bg-zinc-50 border border-border">{client.stakeholderRole}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium lowercase">
                        <Mail className="w-3 h-3" /> {client.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12 py-4 lg:py-0 border-t lg:border-t-0 border-border">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Projects</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" /> {client.activeProjects}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Revenue</p>
                    <p className="text-sm font-bold text-foreground">₹{client.totalLTV.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Manager</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {client.accountManager.charAt(0)}
                      </div>
                      <p className="text-xs font-bold text-zinc-500">{client.accountManager}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Last Sync</p>
                    <p className="text-sm font-bold text-foreground flex items-center gap-2 whitespace-nowrap">
                      <Clock className="w-4 h-4 text-zinc-400" /> {client.lastContact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu 
                    trigger={
                      <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-foreground">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem onClick={() => toast("Client edit coming soon", "info")}>
                      <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Client
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast("Stakeholder permissions updated", "success")}>
                      <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Permissions
                    </DropdownMenuItem>
                    <div className="h-px bg-border my-1" />
                    <DropdownMenuItem 
                      variant="destructive" 
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Account
                    </DropdownMenuItem>
                  </DropdownMenu>
                  <Button size="sm" className="bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-border group-hover:border-primary/20 transition-all font-bold">
                    View CRM <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
