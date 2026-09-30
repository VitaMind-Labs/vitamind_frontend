import { redirect } from "next/navigation";

/** Retired screen: the patient app now has six screens (see components/patient/shell/nav.ts). */
export default function RetiredAppointmentsPage() {
  redirect("/dashboard");
}
