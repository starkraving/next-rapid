import React, { ReactElement } from 'react';
import useRapid from '../hooks/useRapid';

export const ViewFormActions = (): ReactElement => {
    const {dispatchSetIsEditing} = useRapid();

    return <button type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Form</button>
};

export const ViewRouteActions = (): ReactElement => {
    const {dispatchSetIsEditing, dispatchEditGlobals} = useRapid();

    return <>
        <button type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Route</button>
        <button type="button" onClick={() => dispatchEditGlobals()}>Edit Globals</button>
    </>
}

const ContextualActions = (): ReactElement => {
    const {routeProperties, isEditing, routeFound, currentFormIndex} = useRapid();
    const currentForm = routeFound && currentFormIndex !== null && routeProperties.forms[currentFormIndex]
    ? routeProperties.forms[currentFormIndex]
    : null;
    return <aside>
        {
          currentForm
            ? !isEditing && <ViewFormActions /> || null
            : routeFound && !isEditing && <ViewRouteActions /> || null
        }
      </aside>
};

export default ContextualActions;