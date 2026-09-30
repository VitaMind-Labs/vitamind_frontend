"use client";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8">
      <h1 className="text-[clamp(1.625rem,1.2rem+1.4vw,2.125rem)] font-semibold leading-tight tracking-tight text-ink">{title}</h1>
      {subtitle && (
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}
