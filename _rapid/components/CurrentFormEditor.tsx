import React, { ReactElement, SyntheticEvent } from 'react';
import { Form, FormField } from '../data/types';
import useRapid from '../hooks/useRapid';

interface CurrentFormEditorProps {
    currentForm: Form;
};

export default function CurrentFormEditor({currentForm}: CurrentFormEditorProps): ReactElement {
    const { currentRoute, routeProperties, currentFormIndex, dispatchSaveRoute, dispatchSetIsEditing } = useRapid();
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
        <section className="bg-white p-6 pt-1 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
            <h2 className="mb-2">{currentRoute ? `${currentRoute} -- Form` : 'Global Form'}</h2>
            <div className="mb-3"><label><span className="block text-sm font-medium text-gray-700">Description</span><textarea name="description" defaultValue={currentForm?.description} required className="w-full border rounded-md p-2 mt-1" /></label></div>
            <div className="mb-3 flex items-center space-x-2">
                <div className="flex-1"><label><span className="block text-sm font-medium text-gray-700">Handler Name (eg onSubmit="[handlerName]")</span><input type="text" name="handlerName" defaultValue={currentForm?.handlerName} required className="w-full border rounded-md p-2 mt-1" /></label></div>
                <div className="flex-1"><label><span className="block text-sm font-medium text-gray-700">Submit Button Text</span><input type="text" name="submitText" defaultValue={currentForm?.submitText} required className="w-full border rounded-md p-2 mt-1" /></label></div>
                <div className="flex-1">
                    <label><span className="block text-sm font-medium text-gray-700">Form Method</span>
                        <select name="method" defaultValue={currentForm?.method ?? "POST"} required className="w-full border rounded-md p-2 pt-3 pb-3 mt-1">
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </label>
                </div>
            </div>
            <div className="mb-3 flex items-center space-x-2">
                <div className="flex-1"><label><span className="block text-sm font-medium text-gray-700">Redirect to (optional route after form submit)</span><input type="text" name="redirectRoute" defaultValue={currentForm?.redirectRoute} className="w-full border rounded-md p-2 mt-1" /></label></div>
                <div className="flex-1"><label><span className="block text-sm font-medium text-gray-700">API endpoint (optional route for AJAX data)</span><input type="text" name="apiRoute" defaultValue={currentForm?.apiRoute} className="w-full border rounded-md p-2 mt-1" /></label></div>
            </div>
            <input type="hidden" name="templateLocation" value={currentForm?.templateLocation ?? 'general'} />
        </section>
        <section className="bg-white p-6 pt-1 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
            <h3 className="mb-2">Form Inputs:</h3>
            <div className="space-y-4">
                {
                    editableInputs.map((input: FormField, index: number) => (
                        <div key={`innput_${index}`} className="flex items-center space-x-2">
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Name</span>
                                <input type="text" name="name" defaultValue={input?.name} className="w-full border rounded-md p-2 mt-1" />
                            </label>
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Input Type</span>
                                <select name="inputType" defaultValue={input?.inputType} className="w-full border rounded-md p-2 pt-3 pb-3 mt-1">
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
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Label Text</span>
                                <input type="text" name="labelText" defaultValue={input?.labelText} className="w-full border rounded-md p-2 mt-1" />
                            </label>
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Select Options</span>
                                <input type="text" name="options" placeholder="Comma separated" defaultValue={input?.options ?? [].join(',')} className="w-full border rounded-md p-2 mt-1" />
                            </label>
                            <label className="flex-1">
                                <span className="block text-sm font-medium text-gray-700">Add'l Attributes</span>
                                <input type="text" name="additionalAttributes" defaultValue={input?.additionalAttributes} className="w-full border rounded-md p-2 mt-1" />
                            </label>
                        </div>
                    ))
                }
            </div>
        </section>

        {/* ================= Action Buttons ================== */}
        <section className="mt-6 flex justify-end space-x-2 max-w-screen-xl mx-auto pb-6">
            <button type="button" onClick={() => dispatchSetIsEditing(false)} className="px-4 py-2 border rounded-md text-gray-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-md">Save</button>
        </section>
    </form>;
}