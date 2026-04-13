"use client";

import { Button } from "@/components/ui/button";
import { Receipt, Search, Download, DollarSign, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInvoices } from "@/hooks/use-invoices";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

const statusColors = {
  Paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Sent: "bg-secondary/10 text-secondary border-secondary/20",
  Draft: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  Overdue: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Viewed: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export default function GlobalInvoices() {
  const { invoices, loading } = useInvoices();
  const { toast } = useToast();

  const handleExport = () => {
    toast("Preparing financial ledger for export...", "info");
    setTimeout(() => {
      toast("Ledger exported as CSV", "success");
    }, 1500);
  };

  const handleInvoiceHub = () => {
    toast("Connecting to global billing relay...", "info");
  };

  const totalRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.total : 0), 0);
  const openReceivables = invoices.reduce((s, i) => s + (i.status === 'Sent' ? i.total : 0), 0);
  const overdueAmount = invoices.reduce((s, i) => s + (i.status === 'Overdue' ? i.total : 0), 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Financial Center</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Unified billing and invoice tracking for all projects.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="border-border bg-card text-zinc-500 hover:text-foreground font-bold hover:bg-zinc-50 transition-all shadow-sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleInvoiceHub} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-md">
             Invoice Hub
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border shadow-sm group hover:border-emerald-500/20 transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Earnings</p>
              <DollarSign className="w-4 h-4 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-black text-foreground">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-secondary/20 transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Receivables</p>
              <Wallet className="w-4 h-4 text-secondary opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl font-black text-secondary">₹{openReceivables.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-rose-500/20 transition-all">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Overdue</p>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-rose-500">₹{overdueAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm group hover:border-primary/20 transition-all">
          <CardContent className="p-4">
            <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-1">Total Invoiced</p>
            <p className="text-2xl font-black text-foreground">
              ₹{invoices.reduce((s, i) => s + i.total, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search by ID, client, or project..." 
            className="pl-10 bg-card border-border focus:border-primary/50 text-foreground shadow-sm"
          />
        </div>
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-zinc-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Invoice / ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client</th>
                  <th className="hidden lg:table-cell px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="group hover:bg-zinc-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-zinc-100 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground tracking-tight">{inv.invoiceNumber}</p>
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">ID: {inv.id.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-foreground font-bold">{inv.clientName}</p>
                      <p className="hidden sm:block text-xs text-zinc-400">{inv.clientEmail}</p>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-zinc-500 font-medium">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider",
                        statusColors[inv.status as keyof typeof statusColors]
                      )}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">₹{inv.total.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
