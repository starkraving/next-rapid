import {Form, FormField, Link, Page} from "../data/types";
import React, { SyntheticEvent } from "react";
import useRapid from "../hooks/useRapid";
import makeTemplateHTML from "../prototype/libs/makeTemplateHTML";

interface RouteViewerProps {
    routeProperties: Page
}
export default function RouteViewer({routeProperties}: RouteViewerProps) {
    const {description: routeDescription, links, forms} = routeProperties;
    const {dispatchSetCurrentFormIndex, isEditing, currentRoute, globals: {links: globalLinks, forms: globalForms}} = useRapid();
    const allLinks = [...globalLinks, ...links]
        .reduce((collector: { [key: string]: Link[] }, link: Link) => {
                if (link.templateLocation === undefined) {
                    return collector;
                }
                if (!(link.templateLocation in collector)) {
                    collector[link.templateLocation] = [];
                }
                collector[link.templateLocation].push(link);
                return collector;
            }, {}
        );
    const allForms = [
        ...globalForms.map((form: Form, index: number) => ({...form, index, currentRoute: null})),
         ...forms.map((form: Form, index: number) => ({...form, index, currentRoute}))
    ]
        .reduce((collector: { [key: string]: Form[] }, form: Form) => {
                if (form.templateLocation === undefined) {
                    return collector;   
                }
                if (!(form.templateLocation in collector)) {
                    collector[form.templateLocation] = [];
                }
                collector[form.templateLocation].push(form);
                return collector;
            }, {}
        );

    const description = `<h2>Current Route: ${isEditing && !currentRoute ? 'Globals' : currentRoute}</h2>
        <p>${routeDescription}</p>`;

    const prototypeTemplate = makeTemplateHTML(description, allLinks, allForms);

    return <div dangerouslySetInnerHTML={{__html: prototypeTemplate}}
      onSubmit={(evt: SyntheticEvent) => {
        if ((evt.target as HTMLElement).getAttribute('data-index')) {
          dispatchSetCurrentFormIndex(parseInt((evt.target as HTMLElement).getAttribute('data-index') as string, 10));
          evt.preventDefault();
        }
      }} />
}