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
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-56 w-full rounded-3xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Projects</h1>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">View and manage all your active projects.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 h-14 rounded-2xl shadow-none"
        >
          <Plus className="h-5 w-5 mr-3" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-3xl border border-border/60">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-12 bg-zinc-50/50 border-border rounded-xl text-sm font-bold shadow-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border border-dashed border-border rounded-3xl bg-white/50">
          <FolderKanban className="h-12 w-12 text-zinc-200 mb-6" />
          <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
            {query ? "No projects match your search" : "No projects yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="group h-full bg-white border-border/60 hover:border-primary/30 transition-all cursor-pointer shadow-none hover:shadow-sm relative overflow-hidden rounded-3xl">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-8 pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-colors",
                        project.status === 'In Progress' ? "bg-primary text-white border-primary" : "bg-zinc-50 text-zinc-400 border-border"
                      )}>
                        {project.status === 'In Progress' ? 'In Progress' : project.status}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      {project.client}
                    </CardDescription>
                  </div>
                  <DropdownMenu 
                    trigger={
                      <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-foreground">
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
                <CardContent className="p-8 pt-4">
                  <div className="space-y-6">
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-foreground">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-border/50">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }} 
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 pt-3 border-t border-border/50 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-zinc-300" />
                        <span>{project.tasksCount} Tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-300" />
                        <span>Deadline: {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
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

