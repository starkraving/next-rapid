"use client"

import { useEffect } from "react";
import { saveRoute, setCurrentFormIndex, setCurrentRoute, setIsEditing, setProject } from "../context/actions";
import { useRapidContext } from "../context/store";
import { Page, Project } from "../data/types";
import { usePathname } from "next/navigation";
import { selectCurrentFormIndex, selectCurrentRoute, selectIsEditing, selectRouteProperties } from "../context/selectors";

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
    if (!pathName || (state.currentRoute && state.currentRoute === pathName)) {
      return;
    }
    dispatch(setCurrentRoute(pathName));
  }, [pathName])

  useEffect(() => {
    if (!state.project) {
      fetch('/api/_rapid/project')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch project: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.project) {
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

  const saveRouteToDisk = (routeProperties: Page) => {
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

  return {
    currentRoute: selectCurrentRoute(state),
    routeFound: Boolean(selectRouteProperties(state)),
    routeProperties: (selectRouteProperties(state) ?? defaultRouteProperties) as Page,
    isEditing: selectIsEditing(state),
    currentFormIndex: selectCurrentFormIndex(state),

    dispatchSaveRoute: (routeProperties: Page) => {
        dispatch(saveRoute(routeProperties));
        saveRouteToDisk(routeProperties);
    },
    dispatchSetIsEditing: (isEditing: boolean) => dispatch(setIsEditing(isEditing)),
    dispatchSetCurrentFormIndex: (currentForm: number | null) => dispatch(setCurrentFormIndex(currentForm)),
  };
}
