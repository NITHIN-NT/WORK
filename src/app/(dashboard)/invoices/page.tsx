import { Metadata } from "next";
import InvoicesClient from "./invoices-client";

export const metadata: Metadata = {
  title: "Invoices | WORK",
  description: "Financial tracking and invoice lifecycle management.",
};

export default function InvoicesPage() {
  return <InvoicesClient />;
}
