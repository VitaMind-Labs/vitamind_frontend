import { checkinsApi, profileApi } from "@/lib/api/patient";
import { prefetchPatientData } from "@/hooks/usePatientResource";
import { localDay } from "@/lib/patient/format";

/**
 * Warm the first screens of the patient app. The calls are independent, so they run together; each
 * lands in the same cache the screens read, under the same key, so the dashboard opens already filled.
 */
export function prefetchPatientHome() {
  const day = localDay();
  void Promise.allSettled([
    prefetchPatientData("profile", () => profileApi.get(), 60_000),
    prefetchPatientData(`checkins:today:${day}`, async () => (await checkinsApi.today(day)).data),
  ]);
}
