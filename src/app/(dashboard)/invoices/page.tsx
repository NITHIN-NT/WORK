import { Metadata } from "next";
import InvoicesClient from "./invoices-client";

export const metadata: Metadata = {
  title: "Invoices & Billing | Project Workspace OS",
  description: "Centralized financial ledger to track, manage, and generate project invoices across all client workspaces.",
};

export default function InvoicesPage() {
  return <InvoicesClient />;
}
