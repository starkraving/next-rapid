"use client"
import { RapidContextProvider } from "../context/store";
import { Page } from "../data/types";
import useRapid from "../hooks/useRapid";
import ContextualActions from "./ContextualActions";
import CurrentFormEditor from "./CurrentFormEditor";
import CurrentFormViewer from "./CurrentFormViewer";
import RouteEditor from "./RouteEditor";
import RouteViewer from "./RouteViewer";

export const isDevMode = process.env.NODE_ENV === 'development';

function NotFound() {
  const {currentRoute, currentFormIndex, routeFound, isEditing, isLoaded, routeProperties: propsForRoute, globals} = useRapid();
  const routeProperties = currentRoute ? propsForRoute : globals as Page;
  const currentForm = routeFound && currentFormIndex !== null && routeProperties.forms[currentFormIndex]
    ? routeProperties.forms[currentFormIndex]
    : null;
  
  if (!isLoaded) {
    return 'Loading...';
  }
  
  return <section className="flex-1">
    {
      (currentForm !== null)
        ? !isEditing && <CurrentFormViewer {...{currentForm}} /> || <CurrentFormEditor {...{currentForm}} />
        : routeFound && !isEditing && <RouteViewer {...{routeProperties}} /> || <RouteEditor {...{routeProperties}} />
    }
  </section>
};

function ContextualNotFound() {
  return <RapidContextProvider>
    <ContextualActions />
    <NotFound />
  </RapidContextProvider>;
}

const CombinedNotFound = ({template}: {template: string}) => {
  return <div className="flex">
    <ContextualNotFound />
    <div id="prototype_template" dangerouslySetInnerHTML={{__html: template}} />
  </div>;
};

export default CombinedNotFound;