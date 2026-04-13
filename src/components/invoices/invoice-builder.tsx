"use client";

import { useState, useMemo } from 'react';
import { Invoice, InvoiceItem } from '@/types/invoice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Send } from "lucide-react";

import { logActivity } from "@/lib/activity-store";
import { useAuthStore } from "@/store/user";

interface InvoiceBuilderProps {
  projectId: string;
  initialData?: Partial<Invoice>;
  onSave: (invoice: Partial<Invoice>) => void;
}

export function InvoiceBuilder({ projectId, initialData, onSave }: InvoiceBuilderProps) {
  const { user } = useAuthStore();

  const [items, setItems] = useState<InvoiceItem[]>(initialData?.items || [
    { id: '1', description: 'Design Services', quantity: 1, rate: 120, amount: 120 }
  ]);
  const [taxRate, setTaxRate] = useState(initialData?.taxRate || 10);
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);
  const taxAmount = useMemo(() => (subtotal * taxRate) / 100, [subtotal, taxRate]);
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  const handleSend = async () => {
    onSave({ items, taxRate, currency });
    
    if (user) {
      await logActivity({
        projectId,
        type: 'invoice_sent',
        title: 'Invoice Sent',
        description: `Financial update: A new invoice for ${currency} ${total.toLocaleString()} was generated.`,
        userId: user.uid,
        userName: user.displayName || 'User',
        metadata: { amount: total, currency }
      });
    }
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card 
          className="bg-card border-border shadow-sm backdrop-blur-xl"
          style={{ WebkitBackdropFilter: 'blur(24px)' }}
        >
          <CardHeader>
            <CardTitle className="text-xl font-black text-foreground tracking-tight">Invoice Items</CardTitle>
            <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Add services or products to this invoice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="hidden sm:grid grid-cols-12 gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center group">
                  <div className="col-span-6">
                    <Input 
                      placeholder="e.g. Design Services" 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="bg-zinc-50/50 border-border text-sm font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="bg-zinc-50/50 border-border text-sm font-medium"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      className="bg-zinc-50/50 border-border text-sm font-medium"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2 px-2">
                    <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                      {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {item.amount.toLocaleString()}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 text-zinc-400 hover:text-rose-500 hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={addItem}
              className="w-full mt-4 border-dashed border-border hover:border-primary/30 bg-zinc-50/50 text-zinc-500 hover:text-primary hover:bg-primary/5 font-bold transition-all h-11"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Line Item
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card 
          className="bg-card border-primary/20 backdrop-blur-2xl shadow-xl shadow-primary/5 lg:sticky lg:top-24"
          style={{ WebkitBackdropFilter: 'blur(40px)' }}
        >
          <CardHeader>
            <CardTitle className="text-xl font-black text-foreground tracking-tight">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="text-foreground font-black">{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Tax ({taxRate}%)</span>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="h-7 w-12 bg-zinc-50 border-border text-center p-0 font-bold text-xs"
                  />
                  <span className="text-foreground font-black">{currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {taxAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-primary tracking-tight">
                  {currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency} {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleSend}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20 h-11"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Invoice
              </Button>
              <Button variant="outline" className="w-full border-border bg-white text-foreground font-bold hover:bg-zinc-50 h-11">
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-card border-border shadow-sm backdrop-blur-xl"
          style={{ WebkitBackdropFilter: 'blur(24px)' }}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Currency Label</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 bg-zinc-50 border border-border rounded-xl text-sm font-bold text-foreground px-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
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
