import type { Metadata } from "next";
import { DiagnosticPageWrapper } from "./DiagnosticPageWrapper";

export const metadata: Metadata = {
  title: "Diagnostic | VitaMind",
  description: "Private diagnostic conversation interface for VitaMind.",
};

export default function DiagnosticPage() {
  return <DiagnosticPageWrapper />;
}
