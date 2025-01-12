import React, { ReactElement, SyntheticEvent } from 'react';
import { Form } from '../data/types';
import useRapid from '../hooks/useRapid';

interface FormViewerProps {
    form: Form,
    index: number,
};

export default function FormViewer({form, index}: FormViewerProps): ReactElement {
    const { dispatchSetCurrentFormIndex } = useRapid();
    const handleSubmit = (evt: SyntheticEvent) => {
        dispatchSetCurrentFormIndex(index);
        evt.preventDefault();
    }

    return (<form onSubmit={handleSubmit}>
        <button type="submit">{form.submitText}</button>
    </form>);
}