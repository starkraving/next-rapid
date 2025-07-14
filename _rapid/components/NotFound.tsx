"use client"
import React, { ReactElement } from "react";
import { render } from "react-dom";
import { RapidContextProvider } from "../context/store";
import { Page } from "../data/types";
import useRapid from "../hooks/useRapid";
import ContextualActions from "./ContextualActions";
import CurrentFormEditor from "./CurrentFormEditor";
import CurrentFormViewer from "./CurrentFormViewer";
import RouteEditor from "./RouteEditor";
import RouteViewer from "./RouteViewer";
import RoutePreviewer from "./RoutePreviewer";
import match from "../libs/match";

export const isDevMode = process.env.NODE_ENV === 'development';

function NotFound(): ReactElement {
  const {currentRoute, currentFormIndex, routeFound, isEditing, isPreviewing, isLoaded, routeProperties: propsForRoute, globals} = useRapid();
  const routeProperties = currentRoute ? propsForRoute : globals as Page;
  const currentForm = routeFound && currentFormIndex !== null && routeProperties.forms[currentFormIndex]
    ? routeProperties.forms[currentFormIndex]
    : null;

  const ContextualPage = () =>
    match([
      [currentForm !== null && !isEditing, () => <CurrentFormViewer {...{currentForm}} />],
      [currentForm !== null && !!isEditing, () => <CurrentFormEditor {...{currentForm}} />],
      [!!isEditing || !routeFound, () => <RouteEditor {...{routeProperties}} />],
      [!!isPreviewing, () => <RoutePreviewer {...{currentRoute, routeProperties}} />],
      [true, () => <RouteViewer {...{routeProperties}} />],
    ]);

  if (!isLoaded) {
    return (<span>Loading...</span>);
  }
  
  return <section className="flex-1">
    <ContextualPage />      
  </section>
};

function ContextualNotFound(): ReactElement {
  return <RapidContextProvider>
    <ContextualActions />
    <NotFound />
  </RapidContextProvider>;
}

const CombinedNotFound = ({template}: {template: string}): ReactElement => {
  return <div className="flex">
    <ContextualNotFound />
    <div id="prototype_template" dangerouslySetInnerHTML={{__html: template}} />
  </div>;
};

export default CombinedNotFound;