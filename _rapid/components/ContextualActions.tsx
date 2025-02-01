import React, { ReactElement } from 'react';
import useRapid from '../hooks/useRapid';

export const ViewFormActions = (): ReactElement => {
    const {dispatchSetIsEditing} = useRapid();

    return <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Form</button>
};

export const ViewRouteActions = (): ReactElement => {
    const {dispatchSetIsEditing, dispatchEditGlobals} = useRapid();

    return <>
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Route</button>
        <button className="rounded-md border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-white hover:bg-gray-600 hover:border-slate-800 focus:bg-gray-600 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button" onClick={() => dispatchEditGlobals()}>Edit Globals</button>
    </>
}

export const ViewRouteInstructions = () => (
    <>
        <p className="text-small"> 
            Define links that will go to other routes in the app. Then after you
            apply your changes, you can click on the link to visit that route.
            If it doesn't exist, you can create it in a new route form.
        </p>
    </>
);

const ContextualActions = (): ReactElement => {
    const {routeProperties, isEditing, routeFound, currentFormIndex} = useRapid();
    const currentForm = routeFound && currentFormIndex !== null && routeProperties.forms[currentFormIndex]
    ? routeProperties.forms[currentFormIndex]
    : null;
    return <aside className="flex-initial p-4 min-h-screen bg-gray-800 text-white w-[190px] format">
        <h2 className="text-white pb-2 border-b border-solid border-white flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
            </svg>
            Next Rapid
        </h2>
        <div className="flex flex-col gap-4 mt-4">
            {
            currentForm
                ? !isEditing && <ViewFormActions /> || null
                : routeFound && !isEditing && <ViewRouteActions /> || <ViewRouteInstructions />
            }
        </div>
      </aside>
};

export default ContextualActions;