import { Metadata } from "next";
import CalendarClient from "./calendar-client";

export const metadata: Metadata = {
  title: "Calendar | WORK",
  description: "Workspace-wide orchestration and scheduling.",
};

export default function CalendarPage() {
  return <CalendarClient />;
}
