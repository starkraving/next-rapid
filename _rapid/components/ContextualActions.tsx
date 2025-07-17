import React, { ReactElement } from 'react';
import useRapid from '../hooks/useRapid';
import match from '../libs/match';

export const ViewFormActions = (): ReactElement => {
    const {dispatchSetIsEditing} = useRapid();

    return <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Form</button>
};

export const ViewRouteActions = (): ReactElement => {
    const {dispatchSetIsEditing, dispatchEditGlobals, dispatchSetIsPreviewing, dispatchSetIsPublishing} = useRapid();

    return <>
        {/* Authoring Actions */}
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Route</button>
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchEditGlobals()}>Edit Globals</button>
        
        {/* Add spacing */}
        <div className="my-6"></div>

        {/* Code Actions */}
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsPreviewing(true)}>Preview Code</button>
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsPublishing(true)}>Publish Project</button>
    </>
};

export const PreviewRouteActions = (): ReactElement => {
    const {isPublishing, dispatchSetIsPreviewing, dispatchSetIsPublishing} = useRapid();

    return <>
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsPreviewing(false)}>Exit Preview</button>
        {
            ! isPublishing &&
                <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsPublishing(true)}>Publish Route</button>
        }
    </>
};

export const PublishActions = (): ReactElement => {
    const {dispatchSetIsPublishing} = useRapid();

    return <>
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsPublishing(false)}>Cancel</button>
        <p className="text-small"> 
            Select the routes you want to publish as actual files in the project.
            After you select the routes, click the "Publish" button to generate the files.
        </p>
        <p className="text-small">
            NOTE: This will overwrite any existing files with the same name.
        </p>
    </>
};

export const ViewRouteInstructions = (): ReactElement => (
    <>
        <p className="text-small"> 
            Define links that will go to other routes in the app. Then after you
            apply your changes, you can click on the link to visit that route.
            If it doesn't exist, you can create it in a new route form.
        </p>
        <p className="text-small">
            You can also define forms that will be used to perform actions on
            the page, or submit data to the server. After you apply your changes,
            you can click on the form to simulate submitting data.
            You can then edit the form action to customize it or specify inputs.
        </p>
    </>
);

export const ViewFormInstructions = (): ReactElement => (
    <>
        <p className="text-small">
            Define the metadata for the form, such as the submit text, form method, etc.
        </p>
        <p className="text-small">
            You can also define the inputs that will be used in the form. You can specify
            the type of input, the label text, and any additional attributes as a string.
        </p>
    </>
);
const ContextualActionsWrapper = (): ReactElement => {
    const {routeProperties, isEditing, isPreviewing, isPublishing, routeFound, currentFormIndex} = useRapid();
    const currentForm = routeFound && currentFormIndex !== null && routeProperties.forms[currentFormIndex]
    ? routeProperties.forms[currentFormIndex]
    : null;

const ContextualActions = () =>
    match([
        [currentForm !== null && !isEditing, () => <ViewFormActions />],
        [currentForm !== null && !!isEditing, () => <ViewFormInstructions />],
        [!routeFound || !!isEditing, () => <ViewRouteInstructions />],
        [!!isPublishing, () => <PublishActions />],
        [!!isPreviewing, () => <PreviewRouteActions />],
        [true, () => <ViewRouteActions />],
    ]);

    return <aside className="flex-initial p-4 min-h-screen bg-gray-800 text-white w-[190px] format">
        <h2 className="text-white pb-2 border-b border-solid border-white flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
            </svg>
            Next Rapid
        </h2>
        <div className="flex flex-col gap-4 mt-4">
            <ContextualActions />
        </div>
      </aside>
};

export default ContextualActionsWrapper;