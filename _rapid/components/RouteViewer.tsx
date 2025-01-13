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
    const {dispatchSetIsEditing, dispatchEditGlobals, globals} = useRapid();
    return <>
        <section>
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
                            forms.map((form: Form, index: number) => (<FormViewer key={`form_${index}`} {...{form, index}} />))
                        }
                    </ul>
                </>
            }
            <div className="buttons">
                <button type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Route</button>
                <button type="button" onClick={() => dispatchEditGlobals()}>Edit Globals</button>
            </div>
        </section>
        <section style={{marginTop: '1em', borderTop: '1px solid #ccc', paddingTop: '1em'}}>
            {
                globals.links.length > 0 && <>
                    <h3>Global Links</h3>
                    <ul>
                        {
                            globals.links.map((link: Link, index: number) => (<LinkViewer key={`globallink_${index}`} {...{link}} />))
                        }
                    </ul>
                </>
            }
            {
                globals.forms.length > 0 && <>
                    <h3>Global Forms</h3>
                    <ul>
                        {
                            globals.forms.map((form: Form, index: number) => (<FormViewer key={`globalform_${index}`} {...{form, index}} />))
                        }
                    </ul>
                </>
            }
        </section>
    </>
}