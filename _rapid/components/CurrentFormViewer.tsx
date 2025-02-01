import React, { ReactElement, SyntheticEvent } from 'react';
import { Form, FormField } from '../data/types';
import useRapid from '../hooks/useRapid';
import Link from 'next/link';
import makeTemplateHTML from '../prototype/libs/makeTemplateHTML';

interface CurrentFormViewerProps {
    currentForm: Form;
}

export default function CurrentFormViewer({currentForm}: CurrentFormViewerProps): ReactElement {
    const { currentRoute, currentFormIndex, dispatchSetCurrentFormIndex } = useRapid();

    const description = `<h2>Current Form: ${currentForm.handlerName ?? `Form # ${currentFormIndex}`}</h2>
            <p>
                ${currentForm.description}
            </p>`;

    const allLinks = {general: currentForm.redirectRoute ? [{route: currentForm.redirectRoute, visibleText: `Redirect to ${currentForm.redirectRoute}`}] : []};

    const allForms = {general: currentForm.redirectRoute ? [] : [{
        submitText: 'Done',
        description: '',
        handlerName: '',
        method: 'GET',
        fields: [] as FormField[],
    } as Form]};

    const prototypeTemplate = makeTemplateHTML(description, allLinks, allForms, true);

    return <div dangerouslySetInnerHTML={{__html: prototypeTemplate}}
      onSubmit={(evt: SyntheticEvent) => {
        dispatchSetCurrentFormIndex(null)
        evt.preventDefault();
      }} />;
}