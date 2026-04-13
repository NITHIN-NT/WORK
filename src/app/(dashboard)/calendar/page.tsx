import { Metadata } from "next";
import CalendarClient from "./calendar-client";

export const metadata: Metadata = {
  title: "Global Schedule | Project Workspace OS",
  description: "Comprehensive timeline and calendar view aggregating all project deadlines, milestones, and events across your organization.",
};

export default function CalendarPage() {
  return <CalendarClient />;
}
