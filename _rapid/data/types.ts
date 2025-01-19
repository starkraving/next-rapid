export type Link = {
    visibleText: string;
    route: string;
    templateLocation?: string;
};

export type FormField = {
  inputType: "hidden" | "text" | "textarea" | "radio" | "checkbox" | "select" | "url" | "email" | "password" | "number" | "date" | "color";
  name: string;
  labelText: string;
  options?: string[];
  additionalAttributes?: string;
};

export type Form = {
  submitText: string;
  description: string;
  handlerName: string;
  redirectRoute?: string;
  apiRoute?: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  templateLocation?: string;
  fields: FormField[];
};

export type Page = {
    description?: string;
    links: Link[];
    forms: Form[];
};

export type GlobalProperties = {
  description?: string;
  links: Link[];
  forms: Form[];
};

export type Project = {
  routes: Record<string, Page>;
  global: GlobalProperties;
};

export type ProjectState = {
  project: null | Project;
  currentRoute: null | string;
  currentFormIndex: null | number;
  isEditing: boolean;
};

export type ProjectAction =
  | { type: "SET_PROJECT"; payload: Project }
  | { type: "RESET_PROJECT" }
  | { type: "SET_CURRENT_ROUTE", payload: string }
  | { type: "SAVE_ROUTE", payload: Page }
  | { type: "SET_IS_EDITING", payload: boolean }
  | { type: "SET_CURRENT_FORM", payload: number | null }
  | { type: "EDIT_GLOBALS" }
  | { type: "SAVE_GLOBALS", payload: GlobalProperties }