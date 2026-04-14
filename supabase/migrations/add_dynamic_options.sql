-- add_workspace_options.sql
-- Table to store dynamic configuration options for modals (statuses, priorities, roles, etc.)

CREATE TABLE IF NOT EXISTS public.workspace_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL, -- e.g., 'project_status', 'task_priority', 'task_status', 'user_role'
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    color TEXT,
    order_index INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_options ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow authenticated read access" 
ON public.workspace_options FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin write access" 
ON public.workspace_options FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid()::text AND role = 'Administrator'
    )
);

-- Initial Seed Data
INSERT INTO public.workspace_options (category, label, value, color, order_index, is_system) VALUES
-- Project Statuses
('project_status', 'Planning', 'Planning', 'bg-zinc-100', 0, true),
('project_status', 'In Progress', 'In Progress', 'bg-primary/10', 1, true),
('project_status', 'Review', 'Review', 'bg-orange-100', 2, true),
('project_status', 'Blocked', 'Blocked', 'bg-rose-100', 3, true),
('project_status', 'Completed', 'Completed', 'bg-emerald-100', 4, true),

-- Task Statuses
('task_status', 'Todo', 'Todo', 'bg-zinc-100', 0, true),
('task_status', 'In Progress', 'In Progress', 'bg-primary/10', 1, true),
('task_status', 'Review', 'Review', 'bg-orange-100', 2, true),
('task_status', 'Blocked', 'Blocked', 'bg-rose-100', 3, true),
('task_status', 'Completed', 'Completed', 'bg-emerald-100', 4, true),

-- Task Priorities
('task_priority', 'Low', 'Low', 'bg-zinc-50', 0, true),
('task_priority', 'Medium', 'Medium', 'bg-blue-50', 1, true),
('task_priority', 'High', 'High', 'bg-orange-100', 2, true),
('task_priority', 'Urgent', 'Urgent', 'bg-rose-100', 3, true),

-- User Roles
('user_role', 'Administrator', 'Administrator', 'bg-primary/10', 0, true),
('user_role', 'Member', 'Member', 'bg-zinc-100', 1, true),
('user_role', 'Client', 'Client', 'bg-emerald-50', 2, true);
