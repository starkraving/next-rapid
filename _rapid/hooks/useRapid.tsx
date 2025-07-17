"use client"

import { useEffect } from "react";
import {
  editGlobals,
  saveGlobals,
  saveRoute,
  setCurrentFormIndex,
  setCurrentRoute,
  setIsEditing,
  setIsPreviewing,
  setIsPublishing,
  setProject
} from "../context/actions";
import { useRapidContext } from "../context/store";
import { GlobalProperties, Page, Project } from "../data/types";
import { usePathname } from "next/navigation";
import {
  selectCurrentFormIndex,
  selectCurrentRoute,
  selectGlobals,
  selectIsEditing,
  selectIsPreviewing,
  selectIsPublishing,
  selectSelectedRoutes,
  selectProject,
  selectRouteProperties
} from "../context/selectors";

export default function useRapid() {
  const { state, dispatch } = useRapidContext();
  const pathName = usePathname();

  const defaultRouteProperties = {
    title: '',
    description: '',
    links: [],
    forms: [],
  };

  useEffect(() => {
    if (!pathName || state.isEditing || (state.currentRoute && state.currentRoute === pathName)) {
      return;
    }
    dispatch(setCurrentRoute(pathName));
  }, [pathName])

  useEffect(() => {
    if (!state.project) {
      const storedProject = localStorage.getItem('project');
      if (storedProject) {
        const projectFromJSON = JSON.parse(storedProject);
        dispatch(setProject(projectFromJSON as Project));
        return;
      }
      fetch('/api/_rapid/project')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch project: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.project) {
            localStorage.setItem('project', JSON.stringify(data.project));
            dispatch(setProject(data.project as Project));
          } else {
            console.error("Invalid project data:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching project:", error);
        });
    }
  }, [state.project, dispatch]); 

  const saveRouteToDisk = (routeProperties: Page | GlobalProperties) => {
    fetch('/api/_rapid/project', {
            method: 'POST',
            body: JSON.stringify({
                currentRoute: selectCurrentRoute(state),
                routeProperties
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
  };

  const saveProjectToLocalStorage = (routeProperties: Page | GlobalProperties) => {
    const project = selectProject(state);
    const currentRoute = selectCurrentRoute(state);
    if (!project) {
      return;
    }
    if (currentRoute) {
      project.routes[currentRoute] = routeProperties;
    } else {
      project.global = routeProperties;
    }
    localStorage.setItem('project', JSON.stringify(project));
  };

  return {
    currentRoute: selectCurrentRoute(state),
    routeFound: Boolean(selectRouteProperties(state)),
    routeProperties: (selectRouteProperties(state) ?? defaultRouteProperties) as Page,
    isEditing: selectIsEditing(state),
    isPreviewing: selectIsPreviewing(state),
    isPublishing: selectIsPublishing(state),
    isLoaded: Boolean(selectProject(state)),
    currentFormIndex: selectCurrentFormIndex(state),
    globals: selectGlobals(state),
    selectedRoutes: selectSelectedRoutes(state),
    allRoutes: selectProject(state)?.routes || {},

    dispatchSaveRoute: (routeProperties: Page) => {
        dispatch(saveRoute(routeProperties));
        saveRouteToDisk(routeProperties);
        saveProjectToLocalStorage(routeProperties);
    },
    dispatchSaveGlobals: (globalProperties: GlobalProperties) => {
      dispatch(saveGlobals(globalProperties));
      saveRouteToDisk(globalProperties);
      saveProjectToLocalStorage(globalProperties);
      window.location.reload();
    },
    dispatchSetIsEditing: (isEditing: boolean) => dispatch(setIsEditing(isEditing)),
    dispatchSetCurrentFormIndex: (currentForm: number | null) => dispatch(setCurrentFormIndex(currentForm)),
    dispatchEditGlobals: () => dispatch(editGlobals()),
    dispatchSetIsPreviewing: (isPreviewing: boolean) => dispatch(setIsPreviewing(isPreviewing)),
    dispatchSetIsPublishing: (isPublishing: boolean) => dispatch(setIsPublishing(isPublishing)),
  };
}
