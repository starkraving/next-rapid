import { GlobalProperties, Page, Project, ProjectAction } from "../data/types";

export const SET_PROJECT = 'SET_PROJECT';
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE';
export const SET_CURRENT_FORM = 'SET_CURRENT_FORM';
export const SAVE_ROUTE = 'SAVE_ROUTE';
export const SAVE_PROJECT = 'SAVE_PROJECT';
export const SET_IS_EDITING = 'SET_IS_EDITING';
export const SET_IS_PREVIEWING = 'SET_IS_PREVIEWING';
export const SET_IS_PUBLISHING = 'SET_IS_PUBLISHING';
export const EDIT_GLOBALS = 'EDIT_GLOBALS';
export const SAVE_GLOBALS = 'SAVE_GLOBALS';

export const setProject = (project: Project): ProjectAction => ({
  type: SET_PROJECT,
  payload: project,
});

export const setCurrentRoute = (currentRoute: string): ProjectAction => ({
  type: SET_CURRENT_ROUTE,
  payload: currentRoute,
});

export const setCurrentFormIndex = (currentForm: number | null): ProjectAction => ({
  type: SET_CURRENT_FORM,
  payload: currentForm,
})

export const saveRoute = (routeProperties: Page): ProjectAction => ({
  type: SAVE_ROUTE,
  payload: routeProperties
});

export const setIsEditing = (isEditing: boolean): ProjectAction => ({
  type: SET_IS_EDITING,
  payload: isEditing,
});

export const setIsPreviewing = (isPreviewing: boolean): ProjectAction => ({
  type: SET_IS_PREVIEWING,
  payload: isPreviewing,
});

export const setIsPublishing = (isPublishing: boolean): ProjectAction => ({
  type: SET_IS_PUBLISHING,
  payload: isPublishing,
});

export const editGlobals = (): ProjectAction => ({
  type: EDIT_GLOBALS,
});

export const saveGlobals = (globalProperties: GlobalProperties): ProjectAction => ({
  type: SAVE_GLOBALS,
  payload: globalProperties,
});