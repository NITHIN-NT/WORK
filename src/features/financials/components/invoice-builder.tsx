"use client";

import { useState, useMemo } from 'react';
import { Invoice, InvoiceItem } from '@/types/invoice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Send } from "lucide-react";
import { useAuthStore } from "@/store/user";

interface InvoiceBuilderProps {
  projectId: string;
  initialData?: Partial<Invoice>;
  onSave: (invoice: Partial<Invoice>) => void;
}

export function InvoiceBuilder({ initialData, onSave }: InvoiceBuilderProps) {
  useAuthStore();

  const [items, setItems] = useState<InvoiceItem[]>(initialData?.items || [
    { id: '1', description: 'Design Services', quantity: 1, rate: 120, amount: 120 }
  ]);
  const [taxRate, setTaxRate] = useState(initialData?.taxRate || 10);
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const dispatchInvoiceRelay = async () => {
    onSave({ items, taxRate, currency });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = Number(updated.quantity) * Number(updated.rate);
        }
        return updated;
      }
      return item;
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <Card className="bg-white border-border shadow-none rounded-sm overflow-hidden transition-all">
          <CardHeader className="p-8 border-b border-border/40">
            <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Financial Items</CardTitle>
            <CardDescription className="text-[11px] font-black text-zinc-400 uppercase tracking-widest pt-1">Define project deliverables and service valuations.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="hidden sm:grid grid-cols-12 gap-6 text-[10px] font-black text-zinc-300 uppercase tracking-widest px-4">
              <div className="col-span-6">Description Protocol</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit Rate</div>
              <div className="col-span-2 text-right">Valuation</div>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center group p-2 hover:bg-zinc-50 rounded-sm transition-colors">
                  <div className="col-span-6">
                    <Input 
                      placeholder="e.g. Design Component Architecture" 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="bg-zinc-50/50 border-border text-sm font-bold h-12 rounded-sm focus:bg-white transition-all shadow-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="bg-zinc-50/50 border-border text-sm font-bold h-12 rounded-sm focus:bg-white transition-all shadow-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="bg-zinc-50/50 border-border text-sm font-bold h-12 rounded-sm focus:bg-white transition-all shadow-none"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-3 px-2">
                    <div className="text-right">
                      <span className="text-xs font-black text-foreground block tracking-tight">
                        {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {item.amount.toLocaleString()}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="h-10 w-10 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 transition-all rounded-sm"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={addItem}
              className="w-full mt-6 border border-border bg-white text-zinc-400 hover:text-primary hover:border-primary font-black transition-all h-14 rounded-sm shadow-none"
            >
              <Plus className="h-5 w-5 mr-3" />
              Append Financial Item
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="bg-white border-primary border-2 shadow-none rounded-md lg:sticky lg:top-24 overflow-hidden">
          <CardHeader className="p-8 border-b border-border/40">
            <CardTitle className="text-2xl font-bold text-foreground tracking-tight">Recap</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-black uppercase tracking-widest text-[9px]">Gross Subtotal</span>
                <span className="text-foreground font-bold">{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400 font-black uppercase tracking-widest text-[9px]">System Tax ({taxRate}%)</span>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="h-8 w-14 bg-zinc-50 border-border text-center p-0 font-bold text-xs rounded-lg shadow-none"
                  />
                  <span className="text-foreground font-bold">{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {taxAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-6 border-t border-border flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] italic">Total Capital</span>
                <span className="text-5xl font-black text-primary tracking-tight tabular-nums">
                  {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <Button 
                onClick={dispatchInvoiceRelay}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-sm shadow-none transition-all active:scale-[0.98]"
              >
                <Send className="h-5 w-5 mr-3" />
                Dispatch Invoice
              </Button>
              <Button variant="outline" className="w-full border-border bg-white text-zinc-500 font-bold hover:bg-zinc-50 h-14 rounded-sm shadow-none">
                Export Protocol (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-border shadow-none rounded-sm overflow-hidden">
          <CardHeader className="p-8 border-b border-border/40 bg-zinc-50/20">
            <CardTitle className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Identifiers</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] block pl-1">Financial Token Name</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-12 bg-zinc-50 border border-border rounded-sm text-sm font-black text-foreground px-4 outline-none transition-all appearance-none cursor-pointer hover:bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
