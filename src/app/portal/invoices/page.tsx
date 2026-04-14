"use client";

import { usePortal } from "@/hooks/use-portal";
import { 
  FileText, 
  Search, 
  Download, 
  CheckCircle2, 
  Clock, 
  TrendingDown,
  CreditCard,
  Building2,
  Briefcase
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { } from "@/types/invoice";

export default function PortalInvoicesPage() {
  const { invoices, loading } = usePortal();
  const [query, setQuery] = useState("");

  const filteredInvoices = invoices.filter(i => 
    i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
    i.projectName?.toLowerCase().includes(query.toLowerCase())
  );

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.total, 0);

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-150">
        <Skeleton className="h-12 w-64 rounded-xl" />
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
        <div className="space-y-4 pt-10">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-4xl font-black text-foreground tracking-tighter">Financial Ledger</h1>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em]">Invoices, settlement records and billing history.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800 shadow-none rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Aggregate Settlement</p>
            <p className="text-4xl font-black tracking-tight mb-2">₹{totalPaid.toLocaleString()}</p>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3" />
              Reconciled Funds
            </p>
          </div>
          <TrendingDown className="absolute bottom-[-20px] right-[-20px] h-40 w-40 text-white/[0.03] rotate-12" />
        </Card>
        
        <Card className="bg-white border-border/60 shadow-none rounded-3xl p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Pending Reconciliation</p>
          <p className="text-4xl font-black tracking-tight text-foreground mb-2">₹{totalPending.toLocaleString()}</p>
          <p className={cn(
            "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
            totalPending > 0 ? "text-amber-500" : "text-emerald-500"
          )}>
            {totalPending > 0 ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
            {totalPending > 0 ? "Outstanding Dues" : "Account Balanced"}
          </p>
        </Card>

        <Card className="bg-white border-border/60 shadow-none rounded-3xl p-8 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary/20 transition-all">
          <Building2 className="h-8 w-8 text-zinc-200 mb-4 group-hover:text-primary transition-all" />
          <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Update Billing Entity</p>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-border/60">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search invoice number or project..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-50 border-none rounded-xl text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      <Card className="border-border/60 shadow-none rounded-[2.5rem] bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {filteredInvoices.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center bg-zinc-50/20">
                <FileText className="h-12 w-12 text-zinc-200 mb-6" />
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Zero Financial Instruments Matched</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-zinc-50/50 transition-all group">
                  <div className="flex items-start gap-6">
                    <div className={cn(
                      "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all flex-shrink-0 shadow-sm",
                      invoice.status === 'Paid' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-amber-50 border-amber-100 text-amber-600"
                    )}>
                      <FileText className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{invoice.invoiceNumber}</h4>
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] border",
                          invoice.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Briefcase className="h-3.5 w-3.5" />
                          {invoice.projectName || "Unassigned"}
                        </p>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          Issued {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between lg:justify-end gap-12 border-t lg:border-t-0 border-border/40 pt-6 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Instrument Value</p>
                      <p className="text-xl font-black text-foreground tabular-nums">₹{invoice.total.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {invoice.status === 'Overdue' && (
                        <Button className="h-10 px-6 rounded-xl bg-zinc-900 shadow-none text-white font-black text-xs uppercase tracking-widest">
                          Settle Now
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-primary border border-transparent hover:bg-white hover:border-border transition-all rounded-xl shadow-none">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Security Badge */}
      <div className="flex items-center justify-center gap-4 py-8 border-t border-border/40">
        <CreditCard className="h-5 w-5 text-zinc-300" />
        <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Secure SSL Encrypted Financial Portal</p>
      </div>
    </div>
  );
}
