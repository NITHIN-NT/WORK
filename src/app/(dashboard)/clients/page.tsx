import { Metadata } from "next";
import ClientsClient from "./clients-client";

export const metadata: Metadata = {
  title: "Clients | WORK",
  description: "External stakeholder coordination and profile management.",
};

export default function ClientsPage() {
  return <ClientsClient />;
}
