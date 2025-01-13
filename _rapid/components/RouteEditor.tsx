import React, { ReactElement, SyntheticEvent } from "react";
import { Form, GlobalProperties, Link, Page } from "../data/types";
import useRapid from "../hooks/useRapid";

interface RouteEditorProps {
    routeProperties: Page
}

export default function RouteEditor({routeProperties}: RouteEditorProps): ReactElement {
    const {currentRoute, dispatchSaveRoute, dispatchSaveGlobals, dispatchSetIsEditing, dispatchSetCurrentFormIndex, isEditing} = useRapid();

    /**
     * Form submit handler to build a Page object and submit it to global state
     * @param SyntheticEvent evt 
     */
    const handleFormSubmit = (evt: SyntheticEvent) => {
        const formData = new FormData(evt.target as HTMLFormElement);
        const newRouteProperties = {
            description: formData.get('description'),
            links: [],
            forms: []
        } as Page;

        const arVisibleText = formData.getAll('visibleText').map((value: FormDataEntryValue) => value.toString());
        const arRoute = formData.getAll('route').map((value: FormDataEntryValue) => value.toString());
        newRouteProperties.links = arVisibleText
            .map((visibleText, i) => ({
                visibleText,
                route: arRoute[i],
                templateLocation: 'general' 
            } as Link))
            .filter((editableLink: Link) => editableLink.visibleText.length > 0);

        const arSubmitText = formData.getAll('submitText').map((value: FormDataEntryValue) => value.toString());
        const arHandlerName = formData.getAll('handlerName').map((value: FormDataEntryValue) => value.toString());
        const arAdditionalFormProps = formData.getAll('additionalFormProps').map((value: FormDataEntryValue) => (value.toString()));
        newRouteProperties.forms = arSubmitText
            .map((submitText, i) => ({
                submitText,
                handlerName: arHandlerName[i],
                ...JSON.parse(arAdditionalFormProps[i]),
            } as Form))
            .filter((editableForm: Form) => editableForm.submitText.length > 0);

        
        if (currentRoute) {
            dispatchSaveRoute(newRouteProperties as Page);
        } else {
            delete newRouteProperties.description;
            dispatchSaveGlobals(newRouteProperties as GlobalProperties);
        }
        evt.preventDefault();
    };

    // make an array of links, minimum 5, always at least one extra empty link to fill out
    const editableLinks = [
        ...(routeProperties.links || []),
        ...Array(Math.max(5, (routeProperties.links?.length || 0) + 1) - (routeProperties.links?.length || 0))
            .fill({ visibleText: '', route: '', templateLocation: 'general' })
    ];

    // make an array of forms, minimum 5, always at least one extra empty form to fill out
    const editableForms = [
        ...(routeProperties.forms || []),
        ...Array(Math.max(5, (routeProperties.forms?.length || 0) + 1) - (routeProperties.forms?.length || 0))
            .fill({ submitText: '', handlerName: '', templateLocation: 'general' })
    ];


    return <form onSubmit={handleFormSubmit}>
        <section>
            {
                currentRoute !== null && <div className="fieldgroup">
                    <label>
                        <strong>Description:</strong>
                        <br />
                        <textarea name="description" id="description" defaultValue={routeProperties?.description}></textarea>
                    </label>
                </div>
            }
            <div>
                <strong>Links:</strong>
                {
                    editableLinks.map((link, index) => {
                        const {visibleText, route, ...additionalLinkProps} = link;
                        return (
                            <div key={`link_${index}`} className="fieldgroup">
                                <label>
                                    <span>Visible Text</span>
                                    <input type="text" name="visibleText" id={`visibleText_${index}`} defaultValue={visibleText} />
                                </label>
                                <label>
                                    <span>Route</span>
                                    <input type="text" name="route" id={`route_${index}`} defaultValue={route} />
                                </label>
                                <input type="hidden" name="additionalLinkProps" id={`additionalLinkProps_${index}`} value={JSON.stringify(additionalLinkProps)} />
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <strong>Forms</strong>
                {
                    editableForms.map((form, index) => {
                        const {submitText, handlerName, ...additionalFormProps} = form;
                        return (
                            <div key={`form_${index}`} className="formgroup">
                                <label>
                                    <span>Submit Text:</span>
                                    <input type="text" name="submitText" id={`submitText_${index}`} defaultValue={submitText} />
                                </label>
                                <label>
                                    <span>Handler Name (onSubmit)</span>
                                    <input type="text" name="handlerName" id={`handlerLane_${index}`} defaultValue={handlerName} />
                                </label>
                                <input type="hidden" name="additionalFormProps" id={`additionalFormProps_${index}`} value={JSON.stringify(additionalFormProps ?? {})} />
                                {
                                    submitText.length > 0 && <button type="button" onClick={() => dispatchSetCurrentFormIndex(index)}>Edit Form</button>
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className="buttons">
                {
                    isEditing && <button type="button" onClick={() => dispatchSetIsEditing(false)}>Cancel</button>
                }
                <button type="submit">Apply</button>
            </div>
        </section>
    </form>

};