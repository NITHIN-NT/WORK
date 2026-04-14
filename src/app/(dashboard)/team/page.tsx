import { Metadata } from "next";
import TeamClient from "./team-client";

export const metadata: Metadata = {
  title: "Team Management | WORK",
  description: "Manage workspace personnel and access protocols.",
};

export default function TeamPage() {
  return <TeamClient />;
}
