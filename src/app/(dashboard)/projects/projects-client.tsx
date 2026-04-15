"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderKanban, Plus, Search, MoreVertical, Calendar, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { Project } from "@/types/project";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, addProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    toast("Project deleted successfully", "success");
  };

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>) => {
    addProject(projectData);
    toast("New project created successfully", "success");
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.client.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-40 rounded-sm" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 w-full rounded-sm" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-reveal-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <h1 className="text-6xl font-black text-white tracking-tighter italic">
            Projects
            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]">.</span>
          </h1>
          <p className="text-zinc-500 font-bold tracking-tight text-[11px] uppercase tracking-[0.4em]">Strategic Operations Manifest</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="px-12 h-16 rounded-2xl shadow-2xl"
        >
          <Plus className="h-5 w-5 mr-3" />
          Initialize Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 glass p-8 rounded-[2.5rem] border-white/5">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-white transition-colors" />
          <Input
            placeholder="Query operational nodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-14 font-black text-white"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem] bg-white/5">
          <FolderKanban className="h-16 w-16 text-zinc-700 mb-8 animate-pulse" />
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">
            {query ? "Zero matching records found" : "No Project Instances Detected"}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="group h-full p-6 border-white/5 hover:border-primary/30 transition-all duration-500 cursor-pointer relative overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] border transition-all duration-500",
                        project.status === 'In Progress' 
                          ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]" 
                          : "bg-white/5 text-zinc-500 border-white/10"
                      )}>
                        {project.status}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-black text-white group-hover:text-primary transition-colors tracking-tighter italic">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] group-hover:text-zinc-400 transition-colors">
                      {project.client}
                    </CardDescription>
                  </div>
                  <DropdownMenu 
                    trigger={
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem onClick={() => toast("Feature coming soon", "info")}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      variant="destructive" 
                      onClick={() => {
                        handleDeleteProject(project.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete Project
                    </DropdownMenuItem>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-zinc-500">Operation Status</span>
                        <span className="text-white">{project.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-zinc-500 pt-6 border-t border-white/5 uppercase tracking-widest">
                      <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                        <FolderKanban className="h-4 w-4" />
                        <span>{project.tasksCount} Objectives</span>
                      </div>
                      <div className="flex items-center gap-2 group-hover:text-white transition-colors">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateProject}
      />
    </div>
  );
}

