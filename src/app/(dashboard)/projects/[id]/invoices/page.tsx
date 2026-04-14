"use client";

import { useState } from "react";
import { InvoiceBuilder } from "@/features/financials/components/invoice-builder";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

const MOCK_INVOICES = [
  { id: '1', number: 'INV-2026-001', client: 'Acme Corp', amount: 4500, status: 'Paid', date: '2026-03-15' },
  { id: '2', number: 'INV-2026-002', client: 'Nexus Tech', amount: 1200, status: 'Sent', date: '2026-04-01' },
  { id: '3', number: 'INV-2026-003', client: 'Startup Inc', amount: 800, status: 'Draft', date: '2026-04-12' },
];

const statusColors = {
  Paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Sent: "bg-secondary/10 text-secondary border-secondary/20",
  Draft: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  Overdue: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  Viewed: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export default function ProjectInvoices() {
  const params = useParams();
  const [view, setView] = useState<'list' | 'create'>('list');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Finances & Invoices</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">Manage billing and payment status for this workspace context.</p>
        </div>
        
        {view === 'list' ? (
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]"
            onClick={() => setView('create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            className="text-zinc-500 hover:text-foreground font-bold px-4 h-11 rounded-xl transition-all"
            onClick={() => setView('list')}
          >
            Back to List
          </Button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all">
              <CardContent className="p-8">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Billed</p>
                <p className="text-3xl font-black text-foreground">₹14,500</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group hover:border-secondary/20 transition-all">
              <CardContent className="p-8">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Pending</p>
                <p className="text-3xl font-black text-secondary">₹2,400</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group border-emerald-500/20 transition-all">
              <CardContent className="p-8">
                <p className="text-[10px] font-black text-emerald-500/70 uppercase tracking-widest mb-1">Paid</p>
                <p className="text-3xl font-black text-emerald-500">₹12,100</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden group hover:border-rose-500/20 transition-all">
              <CardContent className="p-8">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Overdue</p>
                <p className="text-3xl font-black text-rose-500">₹0</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-zinc-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Description / ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client Name</th>
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Net Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_INVOICES.map((inv) => (
                      <tr key={inv.id} className="group hover:bg-zinc-50 transition-colors cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                              <Receipt className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{inv.number}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs text-zinc-400 font-black uppercase tracking-widest">{inv.date}</td>
                        <td className="px-8 py-6 text-sm text-foreground font-black tracking-tight">{inv.client}</td>
                        <td className="px-8 py-6">
                          <span className={cn(
                            "px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-widest",
                            statusColors[inv.status as keyof typeof statusColors]
                          )}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">₹{inv.amount.toLocaleString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-150">
          <InvoiceBuilder 
            projectId={params.id as string}
            onSave={(data) => {
              console.log('Save invoice:', data);
              setView('list');
            }} 
          />
        </div>
      )}
    </div>
  );
}
