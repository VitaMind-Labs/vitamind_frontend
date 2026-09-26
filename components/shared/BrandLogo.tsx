import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/config/brand";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-9",
  md: "h-11 sm:h-12",
  lg: "h-14 sm:h-16",
  xl: "h-24 sm:h-28",
} as const;

type BrandLogoProps = {
  size?: keyof typeof SIZES;
  /** Render as a home link (default) or as a plain image. */
  href?: string | null;
  className?: string;
  priority?: boolean;
};

/**
 * The single VitaMind logo used across every header, loader and footer.
 * The artwork already carries the wordmark, so no text is rendered beside it.
 */
export function BrandLogo({ size = "md", href = "/", className, priority = true }: BrandLogoProps) {
  const image = (
    <Image
      src="/logo-mark.png"
      alt={BRAND.name}
      width={465}
      height={368}
      priority={priority}
      className={cn("w-auto select-none object-contain", SIZES[size])}
    />
  );

  if (!href) return <span className={cn("inline-flex shrink-0", className)}>{image}</span>;

  return (
    <Link
      href={href}
      aria-label={`${BRAND.name} — home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-xl transition-opacity duration-200 hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-500",
        className,
      )}
    >
      {image}
    </Link>
  );
}
