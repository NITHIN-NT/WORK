"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/user";
import { PortalService } from "@/services/portal.service";
import { Project } from "@/types/project";
import { Invoice } from "@/types/invoice";
import { Task } from "@/types/task";
import { supabase } from "@/lib/supabase";

export function usePortal() {
  const { user } = useAuthStore();

  const [clientId, setClientId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    async function fetchUserProfile() {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('role, companyId')
          .eq('id', user!.uid)
          .single();
          
        if (!error && profile) {
          setClientId(profile.companyId || null);
          setRole(profile.role || null);
        }
      } catch (error) {
        console.error("[usePortal] Profile fetch error:", error);
      }
    }

    fetchUserProfile();
  }, [user]);


  useEffect(() => {
    if (!clientId) return;

    const unsubProjects = PortalService.subscribeToClientProjects(clientId, (list) => {
      setProjects(list);
    });

    const unsubInvoices = PortalService.subscribeToClientInvoices(clientId, (list) => {
      setInvoices(list);
    });

    return () => {
      unsubProjects();
      unsubInvoices();
    };
  }, [clientId]);

  useEffect(() => {
    if (projects.length === 0) {
      queueMicrotask(() => {
        setTasks([]);
        if (clientId) setLoading(false);
      });
      return;
    }

    const projectIds = projects.map(p => p.id);
    const unsubTasks = PortalService.subscribeToClientTasks(projectIds, (list) => {
      setTasks(list);
      setLoading(false);
    });

    return () => unsubTasks();
  }, [projects, clientId]);

  return {
    clientId,
    role,
    projects,
    invoices,
    tasks,
    loading: loading && !!user,
    isClient: role === 'Client stakeholder'
  };
}
