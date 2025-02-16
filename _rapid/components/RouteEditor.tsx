import React, { ReactElement, SyntheticEvent } from "react";
import { Form, GlobalProperties, Link, Page } from "../data/types";
import useRapid from "../hooks/useRapid";

interface RouteEditorProps {
    routeProperties: Page | GlobalProperties
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
                templateLocation: currentRoute !== null ? 'general' : 'global'
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
        <section className="bg-white p-6 pt-1 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
            <h2 className="mb-2">{currentRoute ? `Route: ${currentRoute}` : 'Globals'}</h2>
            { currentRoute !== null && (
                <>
                    <label className="block text-sm font-medium text-gray-700">Page Description</label>
                    <textarea name="description" id="description" defaultValue={routeProperties?.description} className="w-full border rounded-md p-2 mt-1"></textarea>
                </>
            )}
        </section>

        {/* =============== Links Section ================== */}
        <section className="bg-white p-6 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
            <h3 className="mb-2">Links:</h3>

            <div className="space-y-4">
                {
                    editableLinks.map((link, index) => {
                        const {visibleText, route, ...additionalLinkProps} = link;
                        return (
                            <div key={`link_${index}`} className="flex items-center space-x-2">
                                <label className="flex-1">
                                    <span className="block text-sm font-medium text-gray-700">Visible Text</span>
                                    <input type="text" name="visibleText" id={`visibleText_${index}`} defaultValue={visibleText} className="w-full border rounded-md p-2 mt-1" />
                                </label>
                                <label className="flex-1">
                                    <span className="block text-sm font-medium text-gray-700">Link Address</span>
                                    <input type="text" name="route" id={`route_${index}`} defaultValue={route} className="w-full border rounded-md p-2 mt-1" />
                                </label>
                                <input type="hidden" name="additionalLinkProps" id={`additionalLinkProps_${index}`} value={JSON.stringify(additionalLinkProps)} />
                            </div>
                        )
                    })
                }
            </div>
        </section>
        <section className="bg-white p-6 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
            <h3>Forms</h3>
            {
                editableForms.map((form, index) => {
                    const {submitText, handlerName, ...additionalFormProps} = form;
                    return (
                        <div key={`form_${index}`} className="flex items-center space-x-2">
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Submit Text:</span>
                                <input type="text" name="submitText" id={`submitText_${index}`} defaultValue={submitText} className="w-full border rounded-md p-2 mt-1" />
                            </label>
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Handler Name (onSubmit)</span>
                                <input type="text" name="handlerName" id={`handlerLane_${index}`} defaultValue={handlerName} className="w-full border rounded-md p-2 mt-1" />
                            </label>
                            <input type="hidden" name="additionalFormProps" id={`additionalFormProps_${index}`} value={JSON.stringify(additionalFormProps ?? {})} />
                        </div>
                    )
                })
            }
        </section>
        {/* ================= Action Buttons ================== */}
        <section className="mt-6 flex justify-end space-x-2 max-w-screen-xl mx-auto pb-6">
            {
                isEditing && currentRoute && <button className="px-4 py-2 border rounded-md text-gray-700" type="button" onClick={() => dispatchSetIsEditing(false)}>Cancel</button>
            }
            {
                isEditing && !currentRoute && <button className="px-4 py-2 border rounded-md text-gray-700" type="button" onClick={() => window.location.reload()}>Cancel</button>
            }
            <button className="px-4 py-2 bg-gray-900 text-white rounded-md" type="submit">Apply</button>
        </section>
    </form>

};