import { Metadata } from "next";
import SettingsClient from "./settings-client";

export const metadata: Metadata = {
  title: "Settings | Project Workspace OS",
  description: "Configure your workspace preferences, localization settings, and visual themes.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
