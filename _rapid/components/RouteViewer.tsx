import {Form, Link, Page} from "../data/types";
import React from "react";
import useRapid from "../hooks/useRapid";

interface RouteViewerProps {
    routeProperties: Page
}
export default function RouteViewer({routeProperties}: RouteViewerProps) {
    const {description: routeDescription, links, forms} = routeProperties;
    const {isEditing, currentRoute, globals: {links: globalLinks, forms: globalForms}} = useRapid();
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
    const allForms = [...globalForms, ...forms]
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

    const description = `<h1>Current Route: ${isEditing && !currentRoute ? 'Globals' : currentRoute}</h1>
        <p>${routeDescription}</p>`;

    let prototypeTemplate = document.querySelector('#prototype_template template')?.innerHTML ?? '';
    
    // replace description placeholder with actual description
    prototypeTemplate = prototypeTemplate.replace('{{description}}', description);

    // use regex to find all values for rapid-link-block-start
    const allLinkBlocksRegex = /rapid-link-block-start="([^"]+)"/g;
    const allLinkBlocks = [...prototypeTemplate.matchAll(allLinkBlocksRegex)]
        .map(([, blockName]) => blockName);

    // loop through link block placeholders and remove if empty, or replace with actual links
    allLinkBlocks.forEach((blockName) => {
        const blockLinks = allLinks[blockName] ?? [];
        if (blockLinks.length === 0) {
            prototypeTemplate = prototypeTemplate.replace(new RegExp(`<!-- rapid-link-block-start="${blockName}" -->[\\s\\S]*?<!-- rapid-link-block-end="${blockName}" -->`), '');
            return;
        }
        // find the substring between the link repeat start and end
        const linkRepeatStart = `<!-- rapid-link-repeat-start="${blockName}" -->`;
        const linkRepeatEnd = `<!-- rapid-link-repeat-end="${blockName}" -->`;
        const linkRepeat = prototypeTemplate.substring(
            prototypeTemplate.indexOf(linkRepeatStart) + linkRepeatStart.length,
            prototypeTemplate.indexOf(linkRepeatEnd)
        );
        // replace the link repeat with the actual links
        prototypeTemplate = prototypeTemplate.replace(linkRepeat, blockLinks.map((link: Link) => linkRepeat.replace('{{route}}', link.route).replace('{{visibleText}}', link.visibleText)).join(''));
    });

    return <div dangerouslySetInnerHTML={{__html: prototypeTemplate}} />
}