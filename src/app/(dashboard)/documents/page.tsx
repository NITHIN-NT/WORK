import { Metadata } from "next";
import DocumentsClient from "./documents-client";

export const metadata: Metadata = {
  title: "Documents | WORK",
  description: "Centralized repository for project directives and knowledge assets.",
};

export default function DocumentsPage() {
  return <DocumentsClient />;
}
