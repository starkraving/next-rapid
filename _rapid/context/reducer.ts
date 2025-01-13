import { Project, ProjectAction, ProjectState } from "../data/types";

export const getInitialState = (): ProjectState => ({
    project: null,
    currentRoute: null,
    currentFormIndex: null,
    isEditing: false,
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