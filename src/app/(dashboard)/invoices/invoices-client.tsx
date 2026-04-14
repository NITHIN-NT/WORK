"use client";

import { Button } from "@/components/ui/button";
import { Receipt, Search, Download, DollarSign, Wallet, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useInvoices } from "@/hooks/use-invoices";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

export default function GlobalInvoices() {
  const { invoices, loading } = useInvoices();
  const { toast } = useToast();

  const handleExportInvoices = () => {
    toast("Preparing your invoice export...", "info");
    setTimeout(() => {
      toast("Invoices exported successfully", "success");
    }, 1500);
  };

  const handlePaymentsConnect = () => {
    toast("Connecting to payment gateway...", "info");
  };

  const totalRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.total : 0), 0);
  const activeReceivables = invoices.reduce((s, i) => s + (i.status === 'Sent' ? i.total : 0), 0);
  const overdueArrears = invoices.reduce((s, i) => s + (i.status === 'Overdue' ? i.total : 0), 0);

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-3xl" />)}
        </div>
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Invoices</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">Manage your business revenue and invoice history.</p>
        </div>
        
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleExportInvoices} className="border-border bg-white text-zinc-500 font-bold px-8 h-12 rounded-xl hover:bg-zinc-50 transition-all shadow-none">
            <Download className="w-4 h-4 mr-3" />
            Export Invoices
          </Button>
          <Button onClick={handlePaymentsConnect} className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 h-12 rounded-xl shadow-none">
             Payments
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Total Revenue</p>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">₹{totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Pending Payments</p>
              <Wallet className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground tabular-nums">₹{activeReceivables.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Overdue</p>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-rose-500 tabular-nums">₹{overdueArrears.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-border/60 shadow-none hover:border-primary/20 transition-all rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">Total Value</p>
            <p className="text-2xl font-bold text-foreground tabular-nums">
              ₹{invoices.reduce((s, i) => s + i.total, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 bg-white p-6 rounded-3xl border border-border/60">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search invoices..." 
              className="pl-12 h-12 bg-zinc-50/50 border-border rounded-xl text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
        </div>

        <Card className="bg-white border-border/60 shadow-none rounded-3xl overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-zinc-50/30">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Invoice #</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Client</th>
                    <th className="hidden lg:table-cell px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="group hover:bg-zinc-50/50 transition-colors cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-zinc-50 border border-border flex items-center justify-center group-hover:bg-white transition-colors">
                            <Receipt className="h-5 w-5 text-zinc-400 transition-colors" />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-foreground tracking-tight">{inv.invoiceNumber}</p>
                            <p className="text-[9px] text-zinc-300 font-black uppercase tracking-widest mt-0.5">{inv.id.toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-[14px] text-foreground font-bold tracking-tight">{inv.clientName}</p>
                        <p className="hidden sm:block text-[11px] text-zinc-400 font-medium">{inv.clientEmail}</p>
                      </td>
                      <td className="hidden lg:table-cell px-8 py-6 text-[11px] text-zinc-400 font-bold uppercase tracking-widest">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-[0.2em]",
                          inv.status === 'Paid' ? "bg-primary text-white border-primary" : "bg-zinc-50 text-zinc-400 border-border"
                        )}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[15px] font-bold text-foreground tabular-nums">₹{inv.total.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
