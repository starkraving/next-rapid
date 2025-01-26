import React, { ReactElement } from 'react';
import { Form } from '../data/types';
import useRapid from '../hooks/useRapid';
import Link from 'next/link';

interface CurrentFormViewerProps {
    currentForm: Form;
}

export default function CurrentFormViewer({currentForm}: CurrentFormViewerProps): ReactElement {
    const { currentRoute, currentFormIndex, dispatchSetCurrentFormIndex } = useRapid();
    return (
        <div className="mx-auto max-w-screen-lg pl-4 pr-4 py-4 format">
            <h2>Current Form: {currentForm.handlerName ?? `Form # ${currentFormIndex}`}</h2>
            <p>
                {currentForm.description}
            </p>
            <p>
                {
                    currentForm.redirectRoute
                        && <Link href={currentForm.redirectRoute}>Redirect to {currentForm.redirectRoute}</Link>
                        || <button type="button" onClick={() => dispatchSetCurrentFormIndex(null)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Done</button>
                }
            </p>
        </div>
    )
}