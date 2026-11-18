"use client";

import { useState } from "react";
import { useActionState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/src/components/common/Button";
import Input from "@/src/components/common/input";
import FormError from "@/src/components/common/form-error";
import { profileSchema } from "@/src/lib/validations/profile.schema";
import {
  initialProfileFormState,
  type ProfileFieldName,
  type ProfileFormState,
} from "@/src/lib/types/profile.types";

type ProfileFormProps = {
  action: (
    previousState: ProfileFormState,
    formData: FormData,
  ) => Promise<ProfileFormState>;
  initialValues: { firstName: string; lastName: string };
  submitLabel: string;
};

export default function ProfileForm({
  action,
  initialValues,
  submitLabel,
}: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialProfileFormState,
  );
  // Controlled inputs keep what the user typed after a server-side error.
  const [values, setValues] = useState(initialValues);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<ProfileFieldName, string>>
  >({});

  function handleChange(field: ProfileFieldName, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    // A client error must not stay under a field the user is already fixing.
    setClientErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = profileSchema.safeParse(values);

    if (result.success) {
      setClientErrors({});
      return;
    }

    // Blocking the submit keeps the Server Action from being called at all.
    event.preventDefault();

    const nextErrors: Partial<Record<ProfileFieldName, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if ((field === "firstName" || field === "lastName") && !nextErrors[field]) {
        nextErrors[field] = issue.message;
      }
    }
    setClientErrors(nextErrors);
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 md:gap-5"
    >
      <Input
        name="firstName"
        label="نام"
        placeholder="مثلاً علی"
        autoComplete="given-name"
        value={values.firstName}
        onChange={(event) => handleChange("firstName", event.currentTarget.value)}
        autoFocus={initialValues.firstName === ""}
        error={clientErrors.firstName ?? state.fieldErrors?.firstName?.[0]}
      />
      <Input
        name="lastName"
        label="نام خانوادگی"
        placeholder="مثلاً محمدی"
        autoComplete="family-name"
        value={values.lastName}
        onChange={(event) => handleChange("lastName", event.currentTarget.value)}
        autoFocus={
          initialValues.firstName !== "" && initialValues.lastName === ""
        }
        error={clientErrors.lastName ?? state.fieldErrors?.lastName?.[0]}
      />
      {state.formError ? <FormError>{state.formError}</FormError> : null}
      <Button
        type="submit"
        size="md"
        fullWidth
        loading={isPending}
        className="mt-1"
      >
        {submitLabel}
      </Button>
    </form>
  );
}
