import { Metadata } from "next";
import ClientsClient from "./clients-client";

export const metadata: Metadata = {
  title: "Client Directory | Project Workspace OS",
  description: "Centralized CRM for managing client accounts, lifetime values, and active project distributions.",
};

export default function ClientsPage() {
  return <ClientsClient />;
}
