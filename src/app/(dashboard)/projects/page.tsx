import { Metadata } from "next";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects | Project Workspace OS",
  description: "Manage, track, and organize all your active client project workspaces in one centralized dashboard.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
