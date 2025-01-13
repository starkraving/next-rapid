import { GlobalProperties, Page, Project, ProjectState } from "../data/types";

export const selectProject = (state: ProjectState): Project | null => state.project;

export const selectCurrentRoute = (state: ProjectState): string | null => state.currentRoute;

export const selectRouteProperties = (state: ProjectState): Page | null => {
    const project = selectProject(state);
    const currentRoute = selectCurrentRoute(state);
    return project && currentRoute ? project.routes[currentRoute] ?? null : null;
};

export const selectGlobals = (state: ProjectState): GlobalProperties => {
    const project = selectProject(state);
    return project?.global ?? {links: [], forms: []} as GlobalProperties;
};

export const selectCurrentFormIndex = (state: ProjectState): number | null => state.currentFormIndex;

export const selectIsEditing = (state: ProjectState): Boolean => state.isEditing;