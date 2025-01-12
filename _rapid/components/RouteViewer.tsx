import {Form, Link, Page} from "../data/types";
import React from "react";
import LinkViewer from "./LinkViewer";
import useRapid from "../hooks/useRapid";
import FormViewer from "./FormViewer";

interface RouteViewerProps {
    routeProperties: Page
}
export default function RouteVieewer({routeProperties}: RouteViewerProps) {
    const {description, links, forms} = routeProperties;
    const {dispatchSetIsEditing} = useRapid();
    return <section>
        <p>{description}</p>
        
        {
            links.length > 0 && <>
                <h3>Links</h3>
                <ul>
                    {
                        links.map((link: Link, index: number) => (<LinkViewer key={`link_${index}`} {...{link}} />))
                    }
                </ul>
            </> 
        }
        {
            forms.length > 0 && <>
                <h3>Forms</h3>
                <ul>
                    {
                        forms.map((form: Form, index: number) => (<FormViewer key={`form_${index}`} {...{form, index}}></FormViewer>))
                    }
                </ul>
            </>
        }
        <div className="buttons">
            <button type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Route</button>
        </div>
    </section>
}