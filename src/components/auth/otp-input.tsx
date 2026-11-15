"use client";

import { useEffect, useRef } from "react";
import type {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
} from "react";
import { cn } from "@/src/lib/utils/ui.utils";
import {
  toEnglishDigits,
  toPersianDigits,
} from "@/src/lib/utils/digits.utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  label: string;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
};

const DIGIT_PATTERN = /^[0-9۰-۹٠-٩]$/;

export default function OtpInput({
  value,
  onChange,
  onComplete,
  label,
  length = 5,
  disabled = false,
  hasError = false,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  // Boxes are a projection of `value`; a second copy of the digits would drift.
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");

  // The step's only job is the code, so the first box owns focus when it appears.
  useEffect(() => {
    inputsRef.current[0]?.focus();
    inputsRef.current[0]?.select();
  }, []);

  function focusBox(index: number) {
    const target = Math.min(Math.max(index, 0), length - 1);
    const input = inputsRef.current[target];
    if (!input) return;
    input.focus();
    input.select();
  }

  function commit(nextValue: string) {
    onChange(nextValue);
    // Report only the edge into a full code, so editing a filled box does not re-fire.
    if (nextValue.length === length && value.length !== length) {
      onComplete?.(nextValue);
    }
  }

  function writeDigit(index: number, digit: string) {
    const targetIndex = Math.min(index, value.length);
    const nextDigits = Array.from({ length }, (_, i) => value[i] ?? "");
    nextDigits[targetIndex] = digit;
    commit(nextDigits.join(""));
    focusBox(targetIndex + 1);
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>) {
    const incoming = toEnglishDigits(event.target.value).replace(/\D/g, "");
    if (incoming.length === 0) return;

    // Some mobile keyboards autofill the whole code into the focused box.
    if (incoming.length > 1) {
      const code = incoming.slice(0, length);
      commit(code);
      focusBox(code.length);
      return;
    }

    writeDigit(index, incoming);
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
        focusBox(index);
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusBox(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusBox(index - 1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusBox(index + 1);
      return;
    }

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    // Digits are written here because maxLength={1} blocks a collapsed caret
    // from replacing an existing digit.
    if (DIGIT_PATTERN.test(event.key)) {
      event.preventDefault();
      writeDigit(index, toEnglishDigits(event.key));
      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const code = toEnglishDigits(event.clipboardData.getData("text"))
      .replace(/\D/g, "")
      .slice(0, length);
    if (!code) return;
    commit(code);
    focusBox(code.length);
  }

  return (
    <div
      role="group"
      aria-label={label}
      dir="ltr"
      className="flex w-full items-center gap-2"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputsRef.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`رقم ${toPersianDigits(String(index + 1))} از ${toPersianDigits(String(length))}`}
          aria-invalid={hasError || undefined}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
          className={cn(
            "h-12 min-w-0 flex-1 basis-0 max-w-14 rounded-control border bg-surface text-center text-headline-md text-foreground transition-shadow motion-fast disabled:opacity-50",
            hasError ? "focus-ring-error" : "border-border focus-ring",
          )}
        />
      ))}
    </div>
  );
}
