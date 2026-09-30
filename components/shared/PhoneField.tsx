"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Lang } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export type PhoneValue = { country: CountryCode; national: string };

/** Countries most of our patients live in are offered first; the rest follow alphabetically. */
const PINNED: CountryCode[] = ["TN", "SA", "AE", "EG", "MA", "DZ", "FR", "US", "GB"];

type CountryOption = { code: CountryCode; name: string; dial: string };

function buildCountries(language: Lang): CountryOption[] {
  const names = new Intl.DisplayNames([language], { type: "region" });
  const all = getCountries().map((code) => ({ code, name: names.of(code) ?? code, dial: `+${getCountryCallingCode(code)}` }));
  const pinned = PINNED.map((code) => all.find((option) => option.code === code)).filter((option): option is CountryOption => Boolean(option));
  const rest = all.filter((option) => !PINNED.includes(option.code)).sort((a, b) => a.name.localeCompare(b.name, language));
  return [...pinned, ...rest];
}

/** A sensible starting country: the browser's own region, else a regional default by language. */
export function defaultCountry(language: Lang): CountryCode {
  const region = typeof navigator === "undefined" ? undefined : new Intl.Locale(navigator.language).region;
  if (region && getCountries().includes(region as CountryCode)) return region as CountryCode;
  return language === "ar" ? "SA" : "US";
}

/** Checks the number for its country (length, prefix, line type ranges) and returns it as E.164, or null when it is not valid. */
export function toE164(value: PhoneValue): string | null {
  const parsed = parsePhoneNumberFromString(value.national, value.country);
  return parsed?.isValid() ? parsed.number : null;
}

function Flag({ code, className }: { code: CountryCode; className?: string }) {
  return <Icon icon={`circle-flags:${code.toLowerCase()}`} className={cn("size-5 shrink-0", className)} aria-hidden />;
}

type PhoneFieldProps = {
  id: string;
  value: PhoneValue;
  onChange: (value: PhoneValue) => void;
  language: Lang;
  placeholder?: string;
  invalid?: boolean;
  countryLabel: string;
  searchPlaceholder: string;
  noResults: string;
};

/**
 * Country code picker (flag + dial code, searchable) joined to a national-number input that
 * formats as the patient types. The number itself is checked with `toE164`.
 */
export function PhoneField({ id, value, onChange, language, placeholder, invalid, countryLabel, searchPlaceholder, noResults }: PhoneFieldProps) {
  const [open, setOpen] = useState(false);
  const countries = useMemo(() => buildCountries(language), [language]);
  const current = countries.find((option) => option.code === value.country);

  const type = (raw: string) => onChange({ ...value, national: new AsYouType(value.country).input(raw.replace(/[^\d\s()\-.]/g, "")) });

  return (
    // Phone numbers read left-to-right in every language; the control keeps that order in RTL pages.
    <div dir="ltr" className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`${countryLabel}: ${current?.name ?? value.country} ${current?.dial ?? ""}`}
            className={cn(
              "flex h-12 shrink-0 items-center gap-2 rounded-control border bg-white px-3 text-[0.9375rem] text-ink shadow-xs outline-none transition-[border-color,box-shadow] duration-200",
              "hover:border-teal-300 focus-visible:border-teal-500 focus-visible:shadow-focus",
              invalid ? "border-rose" : "border-line-strong",
            )}
          >
            <Flag code={value.country} />
            <span className="tabular-nums">{current?.dial}</span>
            <ChevronDown className="size-4 text-ink-subtle" aria-hidden />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[min(20rem,calc(100vw-2rem))] p-0" dir={language === "ar" ? "rtl" : "ltr"}>
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{noResults}</CommandEmpty>
              {countries.map((option) => (
                <CommandItem
                  key={option.code}
                  // cmdk filters on this string: name, ISO code and dial code all match.
                  value={`${option.name} ${option.code} ${option.dial}`}
                  onSelect={() => {
                    onChange({ country: option.code, national: new AsYouType(option.code).input(value.national.replace(/\D/g, "")) });
                    setOpen(false);
                  }}
                  className="gap-2.5"
                >
                  <Flag code={option.code} />
                  <span className="min-w-0 flex-1 truncate">{option.name}</span>
                  <span className="text-xs tabular-nums text-ink-muted" dir="ltr">{option.dial}</span>
                  {option.code === value.country && <Check className="size-4 text-teal-700" aria-hidden />}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value.national}
        onChange={(event) => type(event.target.value)}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={cn(
          "h-12 w-full min-w-0 rounded-control border bg-white px-4 text-[0.9375rem] tabular-nums text-ink shadow-xs outline-none transition-[border-color,box-shadow] duration-200",
          "placeholder:text-ink-subtle hover:border-teal-300 focus:border-teal-500 focus:shadow-focus",
          invalid ? "border-rose focus:shadow-[0_0_0_4px_rgb(184_112_112/0.16)]" : "border-line-strong",
        )}
      />
    </div>
  );
}
