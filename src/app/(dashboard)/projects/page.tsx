import { Metadata } from "next";
import ProjectsClient from "./projects-client";

export const metadata: Metadata = {
  title: "Projects | WORK",
  description: "Manage, track, and organize all active workspaces.",
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
