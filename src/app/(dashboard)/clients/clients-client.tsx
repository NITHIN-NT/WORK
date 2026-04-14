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
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Clients</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Manage your clients and company relationships.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 h-14 rounded-sm shadow-none"
        >
          <Plus className="w-5 h-5 mr-3" />
          New Client
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-sm overflow-hidden">
          <CardHeader className="p-8">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Active Clients</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground tabular-nums">{clients.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-sm overflow-hidden">
          <CardHeader className="p-8">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Total Value</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground tabular-nums">
              ₹{clients.reduce((s, c) => s + c.totalLTV, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-sm overflow-hidden">
          <CardHeader className="p-8">
            <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Outstanding Balance</CardDescription>
            <CardTitle className="text-3xl font-bold text-foreground tabular-nums">
              ₹{clients.reduce((s, c) => s + c.unpaidBalance, 0).toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-sm border border-border/60">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search clients..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-50/50 border-border rounded-sm text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border border-dashed border-border rounded-sm bg-white/50">
            <Users className="h-12 w-12 text-zinc-200 mb-6" />
            <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">No clients found</p>
          </div>
        ) : filteredClients.map((client) => (
          <Card 
            key={client.id}
            className="bg-white border-border/60 hover:border-primary/30 transition-all group shadow-none rounded-sm overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-sm bg-zinc-50 flex items-center justify-center border border-border group-hover:bg-white transition-colors">
                    <Building2 className="w-8 h-8 text-zinc-300 group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground tracking-tight">{client.company}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                        client.status === 'Active' ? "bg-primary text-white border-primary" : "bg-zinc-50 text-zinc-400 border-border"
                      )}>
                        {client.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-bold">
                        <UserCheck className="w-4 h-4 text-zinc-300" />
                        {client.name} 
                        {client.stakeholderRole && (
                          <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest ml-2 px-2 py-0.5 rounded bg-zinc-50 border border-border">{client.stakeholderRole}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-zinc-400 font-medium">
                        <Mail className="w-3.5 h-3.5 text-zinc-300" /> {client.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 py-6 lg:py-0 border-t lg:border-t-0 border-border/50">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Projects</p>
                    <p className="text-[13px] font-bold text-foreground flex items-center gap-2">
                       {client.activeProjects} Active
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Revenue</p>
                    <p className="text-[13px] font-bold text-foreground tabular-nums">₹{client.totalLTV.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Assignee</p>
                    <p className="text-[13px] font-bold text-zinc-500">{client.accountManager || 'None'}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Last Contact</p>
                    <p className="text-[13px] font-bold text-foreground flex items-center gap-2 tabular-nums">
                      {client.lastContact}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <DropdownMenu 
                    trigger={
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-foreground">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem 
                      variant="destructive" 
                      onClick={() => {
                        handleDeleteClient(client.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Client
                    </DropdownMenuItem>
                  </DropdownMenu>
                  <Button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-border shadow-none h-11 px-6 font-bold text-xs ring-0">
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

