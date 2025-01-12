import React, { ReactElement, SyntheticEvent } from 'react';
import { Form, FormField } from '../data/types';
import useRapid from '../hooks/useRapid';

interface CurrentFormEditorProps {
    currentForm: Form;
};

export default function CurrentFormEditor({currentForm}: CurrentFormEditorProps): ReactElement {
    const { routeProperties, currentFormIndex, dispatchSaveRoute, dispatchSetIsEditing } = useRapid();
    const handleSubmit = (evt: SyntheticEvent) => {
        if (currentFormIndex === null) return;

        const formData = new FormData(evt.target as HTMLFormElement);
        const newForm = {
            handlerName: formData.get('handlerName')?.toString(),
            description: formData.get('description')?.toString(),
            submitText: formData.get('submitText')?.toString(),
            method: formData.get('method')?.toString(),
            redirectRoute: formData.get('redirectRoute')?.toString(),
            apiRoute: formData.get('apiRoute')?.toString(),
            templateLocation: formData.get('templateLocation')?.toString(),
            fields: ((formData: FormData): FormField[] => {
                const arName = formData.getAll('name');
                const arInputType = formData.getAll('inputType');
                const arLabelText = formData.getAll('labelText');
                const arOptions = formData.getAll('options');
                const arAdditionalAttributes = formData.getAll('additionalAttributes');
                return arName
                    .map((value: FormDataEntryValue, index: number) => ({
                        name: value.toString(),
                        inputType: arInputType[index].toString(),
                        labelText: arLabelText[index].toString(),
                        options: arOptions[index].toString().split(',').filter((value: string) => value.length > 0),
                        additionalAttributes: arAdditionalAttributes[index].toString()
                    } as FormField))
                    .filter((field: FormField) => field.name.length > 0)
            })(formData)
        } as Form;

        routeProperties.forms[currentFormIndex] = newForm;
        dispatchSaveRoute(routeProperties);
        dispatchSetIsEditing(false);

        evt.preventDefault();
    }

    // make an array of form inputs, minimum 5, always at least one extra empty input to fill out
    const editableInputs = [
        ...(currentForm.fields || []),
        ...Array(Math.max(5, (currentForm.fields?.length || 0) + 1) - (currentForm.fields?.length || 0))
            .fill({ name: '', inputType: '', labelText: '', options: '', additionalAttributes: '' })
    ];

    return <form onSubmit={handleSubmit}>
        <div><label><span>Handler Name</span><input type="text" name="handlerName" defaultValue={currentForm?.handlerName} required /></label></div>
        <div><label><span>Description</span><textarea name="description" defaultValue={currentForm?.description} required /></label></div>
        <div><label><span>Submit Button Text</span><input type="text" name="submitText" defaultValue={currentForm?.submitText} required /></label></div>
        <div>
            <label htmlFor=""><span>Form Method</span>
                <select name="method" defaultValue={currentForm?.method ?? "POST"} required>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
            </label>
        </div>
        <div><label><span>Redirect to (optional route)</span><input type="text" name="redirectRoute" defaultValue={currentForm?.redirectRoute} /></label></div>
        <div><label><span>API endpoint (optional route)</span><input type="text" name="apiRoute" defaultValue={currentForm?.apiRoute} /></label></div>
        <input type="hidden" name="templateLocation" value={currentForm?.templateLocation ?? 'general'} />

        <div className="inputs">
            {
                editableInputs.map((input: FormField, index: number) => (
                    <div key={`innput_${index}`}>
                        <label><span>Name</span><input type="text" name="name" defaultValue={input?.name} /></label>
                        <label>
                            <span>Input Type</span>
                            <select name="inputType" defaultValue={input?.inputType}>
                                <option value="text">text</option>
                                <option value="textarea">textarea</option>
                                <option value="radio">radio</option>
                                <option value="checkbox">checkbox</option>
                                <option value="select">select</option>
                                <option value="url">url</option>
                                <option value="email">email</option>
                                <option value="number">number</option>
                                <option value="color">color</option>
                                <option value="date">date</option>
                                <option value="hidden">hidden</option>
                            </select>
                        </label>
                        <label><span>Label Text</span><input type="text" name="labelText" defaultValue={input?.labelText} /></label>
                        <label><span>Select Options</span><input type="text" name="options" placeholder="Comma separated" defaultValue={input?.options ?? [].join(',')} /></label>
                        <label><span>Add'l Attributes</span><input type="text" name="additionalAttributes" defaultValue={input?.additionalAttributes} /></label>
                    </div>
                ))
            }
        </div>

        <div className="buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={() => dispatchSetIsEditing(false)}>Cancel</button>
        </div>
    </form>;
}