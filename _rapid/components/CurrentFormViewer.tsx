import React, { ReactElement } from 'react';
import { Form } from '../data/types';
import useRapid from '../hooks/useRapid';
import Link from 'next/link';

interface CurrentFormViewerProps {
    currentForm: Form;
}

export default function CurrentFormViewer({currentForm}: CurrentFormViewerProps): ReactElement {
    const { currentRoute, currentFormIndex, dispatchSetCurrentFormIndex, dispatchSetIsEditing } = useRapid();
    return (
        <div>
            <h2>Current Form: {currentForm.handlerName ?? `Form # ${currentFormIndex}`}</h2>
            <p>
                {currentForm.description}
            </p>
            <p>
                {
                    currentForm.redirectRoute
                        && <Link href={currentForm.redirectRoute}>Redirect to {currentForm.redirectRoute}</Link>
                        || <button type="button" onClick={() => dispatchSetCurrentFormIndex(null)}>Done</button>
                }
                <button type="button" onClick={() => dispatchSetIsEditing(true)}>Edit Form</button>
            </p>
        </div>
    )
}