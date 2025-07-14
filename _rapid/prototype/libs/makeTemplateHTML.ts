import { Form, FormField, Link } from "next-rapid/data/types";

function makeTemplateHTML(description: string, allLinks: {[key: string]: Link[]}, allForms: {[key: string]: Form[]}, repeatsOnly: boolean = false): string {
    let prototypeTemplate = document.querySelector('#prototype_template template')?.innerHTML ?? '';
    
    // replace description placeholder with actual description
    prototypeTemplate = prototypeTemplate.replace('{{description}}', description);

    // use regex to find all values for rapid-link-block-start
    const allLinkBlocksRegex = /rapid-link-block-start="([^"]+)"/g;
    const allLinkBlocks = [...prototypeTemplate.matchAll(allLinkBlocksRegex)]
        .map(([, blockName]) => blockName);

    // loop through link block placeholders and remove if empty, or replace with actual links
    allLinkBlocks.forEach((blockName) => {
        const blockLinks = allLinks[blockName] ?? [];
        const linkBlock = new RegExp(`<!-- rapid-link-block-start="${blockName}" -->[\\s\\S]*?<!-- rapid-link-block-end="${blockName}" -->`);
        if (blockLinks.length === 0) {
            prototypeTemplate = prototypeTemplate.replace(linkBlock, '');
            return;
        }
        // find the substring between the link repeat start and end
        const linkRepeatStart = `<!-- rapid-link-repeat-start="${blockName}" -->`;
        const linkRepeatEnd = `<!-- rapid-link-repeat-end="${blockName}" -->`;
        const linkRepeat = prototypeTemplate.substring(
            prototypeTemplate.indexOf(linkRepeatStart) + linkRepeatStart.length,
            prototypeTemplate.indexOf(linkRepeatEnd)
        );
        // replace the link repeat placeholder with the actual links
        prototypeTemplate = prototypeTemplate
            .replace((repeatsOnly ? linkBlock : linkRepeat), blockLinks.map((link: Link) => linkRepeat
                .replace('{{route}}', link.route)
                .replace('{{visibleText}}', link.visibleText)
            ).join(''));
    });

    // use regex to find all values for rapid-form-block-start
    const allFormBlocksRegex = /rapid-form-block-start="([^"]+)"/g;
    const allFormBlocks = [...prototypeTemplate.matchAll(allFormBlocksRegex)]
        .map(([, blockName]) => blockName);

    // loop through form block placeholders and remove if empty, or replace with actual forms
    allFormBlocks.forEach((blockName) => {
        const blockForms = allForms[blockName] ?? [];
        const formBlock = new RegExp(`<!-- rapid-form-block-start="${blockName}" -->[\\s\\S]*?<!-- rapid-form-block-end="${blockName}" -->`);
        if (blockForms.length === 0) {
            prototypeTemplate = prototypeTemplate.replace(formBlock, '');
            return;
        }
        // find the substring between the form repeat start and end
        const formRepeatStart = `<!-- rapid-form-repeat-start="${blockName}" -->`;
        const formRepeatEnd = `<!-- rapid-form-repeat-end="${blockName}" -->`;
        const formRepeat = prototypeTemplate.substring(
            prototypeTemplate.indexOf(formRepeatStart) + formRepeatStart.length,
            prototypeTemplate.indexOf(formRepeatEnd)
        );

        // collect field placeholders into variables if found
        const fieldTypes: {[key: string]: string} = {'hidden': '', 'input': '', 'textarea': '', 'select': '', 'checkbox': ''};
        Object.keys(fieldTypes).forEach((fieldType) => {
            const fieldRepeatStart = `<!-- rapid-field-${fieldType}-start="${blockName}" -->`;
            const fieldRepeatEnd = `<!-- rapid-field-${fieldType}-end="${blockName}" -->`;
            if (prototypeTemplate.includes(fieldRepeatStart) && prototypeTemplate.includes(fieldRepeatEnd)) {
                fieldTypes[fieldType] = prototypeTemplate.substring(
                    prototypeTemplate.indexOf(fieldRepeatStart) + fieldRepeatStart.length,
                    prototypeTemplate.indexOf(fieldRepeatEnd)
                );
            }
        });

        // replace the form repeat placeholder with the actual forms
        prototypeTemplate = prototypeTemplate
            .replace((repeatsOnly ? formBlock : formRepeat), blockForms.map((form: Form) => formRepeat
                .replace(new RegExp(`<!-- rapid-field-start="${blockName}" -->[\\s\\S]*?<!-- rapid-field-end="${blockName}" -->`), (form.fields ?? []).map((field: FormField) => {
                    let fieldTemplate;
                    switch (field.inputType) {
                        case 'hidden':
                            fieldTemplate = fieldTypes.hidden;
                            break;
                        case 'textarea':
                            fieldTemplate = fieldTypes.textarea;
                            break;
                        case 'select':
                            fieldTemplate = fieldTypes.select;
                            break;
                        case 'checkbox':
                        case 'radio':
                            fieldTemplate = fieldTypes.checkbox;
                            break;
                        default:
                            fieldTemplate = fieldTypes.input;
                    }
                    return fieldTemplate
                        .replace(/{{name}}/g, field.name)
                        .replace(/{{labelText}}/g, field.labelText)
                        .replace(/{{inputType}}/g, field.inputType)
                        .replace(`data-rapid-field-attributes="${blockName}"`, field.additionalAttributes)
                        .replace('{{options}}', field.options.map((option) => `<option value="${option}">${option}</option>`).join(''))
                }).join(''))
                .replace(`data-rapid-form-attributes="${blockName}"`, `data-index="${form.index}" ${(form.currentRoute ? '' : 'data-global')}`)
                .replace('{{submitText}}', form.submitText)
            ).join(''));
    });

    return prototypeTemplate;
}

export default makeTemplateHTML;