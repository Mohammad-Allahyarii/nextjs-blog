export type ProfileFieldName = "firstName" | "lastName";

export type ProfileFormState = {
  fieldErrors?: Partial<Record<ProfileFieldName, string[]>>;
  formError?: string;
};

export const initialProfileFormState: ProfileFormState = {};
