import { Metadata } from "next";
import DocumentsClient from "./documents-client";

export const metadata: Metadata = {
  title: "Knowledge Base | Project Workspace OS",
  description: "Unified repository for all project documentation, proposals, and technical specifications across your organization.",
};

export default function DocumentsPage() {
  return <DocumentsClient />;
}
