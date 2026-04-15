"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, GripVertical } from "lucide-react";
import { useOptions } from "@/hooks/use-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { PostgrestError } from "@supabase/supabase-js";

const CATEGORIES = [
  { id: 'project_status', label: 'Project Statuses', desc: 'Define lifecycle stages for projects.' },
  { id: 'task_status', label: 'Task Statuses', desc: 'Define stages for the task board.' },
  { id: 'task_priority', label: 'Task Priorities', desc: 'Define levels of urgency for tasks.' },
  { id: 'user_role', label: 'Access Protocols', desc: 'Define personnel roles for onboarding.' },
];

export default function MiscellaneousClient() {
  const { getByCategory, addOption, updateOption, deleteOption, loading, error } = useOptions();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!newItemLabel.trim()) return;
    try {
      await addOption({
        category: activeCategory,
        label: newItemLabel.trim(),
        value: newItemLabel.trim(),
        order_index: getByCategory(activeCategory).length,
        color: "bg-zinc-100" // Default color
      });
      setNewItemLabel("");
      toast("Option added successfully", "success");
    } catch {
      toast("Failed to add option", "error");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editLabel.trim()) return;
    try {
      await updateOption(id, { label: editLabel.trim(), value: editLabel.trim() });
      setEditingId(null);
      toast("Option updated", "success");
    } catch {
      toast("Update failure", "error");
    }
  };

  const handleDelete = async (id: string, isSystem: boolean) => {
    if (isSystem) {
      toast("Cannot delete system default options", "error");
      return;
    }
    try {
      await deleteOption(id);
      toast("Option deleted", "success");
    } catch {
      toast("Deletion failure", "error");
    }
  };

  const activeOptions = getByCategory(activeCategory);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Miscellaneous</h1>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
          Manage dynamic options for modals and application registries.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Category Sidebar */}
        <div className="w-full lg:w-72 space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-full text-left px-6 py-4 rounded-sm text-[11px] font-black uppercase tracking-widest transition-all border",
                activeCategory === cat.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-zinc-500 border-border hover:bg-zinc-50"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Option Management */}
        <div className="flex-1 space-y-8">
          <Card className="bg-white border-border/60 shadow-none rounded-sm overflow-hidden">
            <CardHeader className="p-10 border-b border-zinc-50">
              <CardTitle className="text-2xl font-bold text-foreground tracking-tight">
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </CardTitle>
              <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pt-2">
                {CATEGORIES.find(c => c.id === activeCategory)?.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              {/* Add New */}
              <div className="flex gap-4">
                <Input 
                  placeholder="New option label..." 
                  className="h-14 bg-zinc-50 border-zinc-100 font-bold px-6 rounded-none focus:bg-white transition-all shadow-none"
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button 
                  onClick={handleAdd}
                  className="bg-primary hover:bg-primary/90 text-white font-black px-8 h-14 rounded-none shadow-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              {/* List */}
              <div className="border border-zinc-100 rounded-none overflow-hidden">
                {loading ? (
                  <div className="p-10 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-zinc-300">
                    Synchronizing Registry...
                  </div>
                ) : (error as PostgrestError)?.code === '42P01' ? (
                  <div className="p-12 text-center space-y-4 bg-rose-50/30">
                    <p className="text-sm font-bold text-rose-500">Database Migration Required</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">
                      The &apos;workspace_options&apos; table was not detected. Please run the SQL migration in your Supabase dashboard to continue.
                    </p>
                    <div className="pt-2">
                       <code className="text-[9px] bg-rose-50 text-rose-600 px-3 py-1 rounded-sm">supabase/migrations/add_dynamic_options.sql</code>
                    </div>
                  </div>
                ) : activeOptions.length === 0 ? (
                  <div className="p-10 text-center text-[10px] font-black uppercase tracking-widest text-zinc-300 italic">
                    No custom options defined for this category.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-50">
                    {activeOptions.map((opt) => (
                      <div key={opt.id} className="group flex items-center p-6 bg-white hover:bg-zinc-50/50 transition-all">
                        <GripVertical className="w-4 h-4 text-zinc-200 mr-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex-1">
                          {editingId === opt.id ? (
                            <div className="flex gap-2">
                              <Input 
                                autoFocus
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                className="h-10 bg-white border-primary text-sm font-bold rounded-none"
                              />
                              <Button size="sm" onClick={() => handleUpdate(opt.id)}>
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <span className="text-[13px] font-bold text-foreground">{opt.label}</span>
                              {opt.is_system && (
                                <span className="text-[8px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full">System Default</span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!opt.is_system && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => { setEditingId(opt.id); setEditLabel(opt.label); }}
                                className="h-9 w-9 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-none"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDelete(opt.id, opt.is_system)}
                                className="h-9 w-9 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-none"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
