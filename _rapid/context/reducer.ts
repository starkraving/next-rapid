import { Project, ProjectAction, ProjectState } from "../data/types";

export const getInitialState = (): ProjectState => ({
    project: null,
    currentRoute: null,
    currentFormIndex: null,
    isEditing: false,
    isPreviewing: false,
    isPublishing: false,
    selectedRoutes: [],
});

const appReducer = (state: ProjectState = getInitialState(), action: ProjectAction): ProjectState => {
  console.log({...action});
    switch (action.type) {
      case "SET_CURRENT_ROUTE":
        return {
            ...state,
            currentRoute: action.payload,
        };

      case "SET_CURRENT_FORM":
        return {
          ...state,
          currentFormIndex: action.payload,
        };

      case "SET_PROJECT":
        return {
          ...state,
          project: action.payload,
        };

      case "SAVE_ROUTE":
        return !state.currentRoute ? state : {
          ...state,
          isEditing: false,
          project: {
            ...state.project,
            routes: {
              ...state.project?.routes,
              [state.currentRoute]: action.payload
            }
          } as Project
        };

      case "SET_IS_EDITING":
        return {
          ...state,
          isEditing: action.payload
        };

      case "SET_IS_PREVIEWING":
        return {
          ...state,
          isPreviewing: action.payload,
        };

      case "SET_IS_PUBLISHING":
        return {
          ...state,
          isPublishing: action.payload,
          isPreviewing: (!action.payload) ? false : state.isPreviewing, // Exit preview mode when cancelling publish
          selectedRoutes: (!action.payload)
            ? []
            : (
              state.isPreviewing && state.currentRoute
                ? [state.currentRoute]
                : Object.keys(state.project?.routes || {})
            ),
        };

      case "SET_SELECTED_ROUTES":
        return {
          ...state,
          selectedRoutes: state.selectedRoutes.includes(action.payload)
            ? state.selectedRoutes.filter((route) => route !== action.payload)
            : [...state.selectedRoutes, action.payload],
        };


      case "EDIT_GLOBALS":
        return {
          ...state,
          isEditing: true,
          currentRoute: null,
        };

      case "SAVE_GLOBALS":
        return {
          ...state,
          isEditing: false,
          project: {
            ...state.project,
            global: action.payload,
          } as Project,
        };

      default:
        return state; 
    }
  };

  export default appReducer;