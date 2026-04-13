"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderKanban, Plus, Search, MoreVertical, Calendar, Pencil, Share2, Archive, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useProjects } from "@/hooks/use-projects";
import { Project } from "@/types/project";
import { CreateProjectModal } from "@/components/projects/create-project-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, loading, addProject, deleteProject } = useProjects();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteProject(id);
    toast("Project deleted successfully", "success");
  };

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'tasksCount'>) => {
    addProject(projectData);
    toast("Project launched successfully", "success");
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground mb-1">Projects</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Manage your client workspaces.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-black h-11 px-6 shadow-lg shadow-primary/20"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Project
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-border mx-[-4px] shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-50 border-border focus:border-primary/50 text-foreground"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="group h-full bg-card hover:bg-white border-border/50 hover:border-primary/20 transition-all cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      project.status === 'In Progress' ? "bg-primary/5 text-primary border-primary/20 shadow-sm shadow-primary/5" : "bg-zinc-100 text-zinc-500 border-border"
                    )}>
                      {project.status}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                    {project.client}
                  </CardDescription>
                </div>
                <DropdownMenu 
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-foreground">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  }
                >
                  <DropdownMenuItem onClick={() => toast("Edit coming soon", "info")}>
                    <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Sharing link copied", "success")}>
                    <Share2 className="w-3.5 h-3.5 mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Project archived", "info")}>
                    <Archive className="w-3.5 h-3.5 mr-2" /> Archive
                  </DropdownMenuItem>
                  <div className="h-px bg-border my-1" />
                  <DropdownMenuItem 
                    variant="destructive" 
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete Project
                  </DropdownMenuItem>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-zinc-500">Progress</span>
                      <span className="text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-border">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-sm shadow-primary/20" 
                        style={{ width: `${project.progress}%` }} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-500 pt-3 border-t border-border uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5 text-primary" />
                      <span>{project.tasksCount} Tasks</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                      <span>{new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateProject}
      />
    </div>
  );
}
