import { OrientationSkeleton } from "@/features/diagnostic";

/** Route-level Suspense boundary while the orientation segment loads. */
export default function Loading() {
  return <OrientationSkeleton />;
}
