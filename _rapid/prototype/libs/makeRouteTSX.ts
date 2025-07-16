import { Form, FormField, Link, Page } from "next-rapid/data/types";

function makeRouteTSX(
    templateHTML: string,
    currentRoute: string,
    routeProperties: Page
): string {
    const { description, links = [], forms = [], isStatic = false } = routeProperties;
    const nl = '\n';
    const imports = new Set<string>(isStatic ? [`use client;${nl}`] : [])
        .add('import React from "react";')
    const componentName = 'PageComponent';

    // collect route parameters from currentRoute, treating "/:parameter" as a parameter
    const routeParams = currentRoute
        .split('/')
        .filter(part => part.startsWith(':'))
        .map(part => part.replace(':', ''));

    // convert the flat array of links into an object with templateLocation as keys
    const allLinks = links
        .reduce((collector: { [key: string]: Link[] }, link: Link) => {
                if (link.templateLocation === undefined) {
                    return collector;
                }
                if (!(link.templateLocation in collector)) {
                    collector[link.templateLocation] = [];
                }
                collector[link.templateLocation].push(link);
                return collector;
            }, {}
        );
        
    // convert the flat array of forms into an object with templateLocation as keys
    const allForms = forms
        .map((form: Form, index: number) => ({ ...form, index, currentRoute }))
        .reduce((collector: { [key: string]: Form[] }, form: Form) => {
            if (form.templateLocation) {
                (collector[form.templateLocation] = collector[form.templateLocation] || []).push(form);
            } return collector;
        }, {});

    // build the list of form handler functions
    const formHandlers = forms.filter(form => form.handlerName.length && !form.apiRoute?.length)
        .map(form => {
            if (isStatic) {
                let redirect = '';
                if (form.redirectRoute && form.redirectRoute.length) {
                    const needsTemplateLiteral = form.redirectRoute.split('/').some(param => form.redirectRoute?.includes(`:${param}`));
                    const todoComment = needsTemplateLiteral ? `    // TODO: Ensure dynamic parameters are correctly inserted into the redirect route${nl}` : '';

                    redirect = `${todoComment}    router.push('${form.redirectRoute}');${nl}`;
                    imports.add('import type { FormEvent } from "react";');
                    imports.add('import { useRouter } from "next/navigation";');
                }
                return `  async function ${form.handlerName}(event: FormEvent) {${nl}    // TODO: Implement form handler for ${form.handlerName}${nl}${redirect}    event.preventDefault();${nl}  }`;
            } else {
                let redirect = '';
                if (form.redirectRoute && form.redirectRoute.length) {
                    const needsTemplateLiteral = form.redirectRoute.split('/').some(param => form.redirectRoute?.includes(`:${param}`));
                    const todoComment = needsTemplateLiteral ? `  // TODO: Ensure dynamic parameters are correctly inserted into the redirect route${nl}` : '';

                    redirect = `${todoComment}  redirect('${form.redirectRoute}');${nl}`;
                    imports.add('import { redirect } from "next/navigation";');
                }
                return `export async function ${form.handlerName}(formData: FormData) {${nl}  "use server";${nl}  // TODO: Implement form handler for ${form.handlerName}${nl}${redirect}}`;
            }
        })
        .join(nl + nl);
    
    let prototypeTemplate = templateHTML.substring(
        templateHTML.indexOf('<!-- rapid-route-start -->') + '<!-- rapid-route-start -->'.length,
        templateHTML.indexOf('<!-- rapid-route-end -->')
    );
    
    // add imports for links and forms if needed
    if (links.length > 0) {
        imports.add('import Link from "next/link";');
    }
    if (!isStatic && forms.length > 0) {
        imports.add('import { Form } from "next/form";');
    }

    // optionally add the declaration for static rendering
    if (isStatic) {
        imports.add(`${nl}export const dynamic = 'force-static';`);
    }
    
    let generateStaticParamsFunction = '';
    const hasRouteParams = routeParams.length > 0;

    if (isStatic && hasRouteParams) {
        // dynamically create the TypeScript return type for the function signature.
        const returnType = `{ ${routeParams.map(p => `${p}: string`).join('; ')} }[]`;

        generateStaticParamsFunction = `${nl}export async function generateStaticParams(): Promise<${returnType}> {${nl}  // TODO: Implement generateStaticParams${nl}  return [];${nl}}${nl + nl}`;
    }

    // add any route parameters to the component template
    let pagePropsType  = '';
    let pageProps = '';
    let destructuredProps = '';
    if (hasRouteParams) {
        pagePropsType = `type ${componentName}Props = {${nl}  params: {${nl}`;
        pageProps = `{ params }: ${componentName}Props`;
        destructuredProps = `  const {${nl}`;
        routeParams.forEach(param => {
            pagePropsType += `    ${param}: string;${nl}`;
            destructuredProps += `    ${param},${nl}`;
        });
        pagePropsType += `  }${nl}};${nl}${nl}`;
        destructuredProps += `  } = params;${nl}${nl}`;
    }

    // replace description placeholder with actual description
    prototypeTemplate = prototypeTemplate.replace('{{description}}', description ?? '');

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
            .replace((linkRepeat), blockLinks.map((link: Link) => linkRepeat
                .replace('{{route}}', link.route)
                .replace('{{visibleText}}', link.visibleText)
                .replace('<a ', '<Link ')
                .replace('</a>', '</Link>')
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
            .replace((formRepeat), blockForms.map((form: Form) => formRepeat
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
                .replace(`data-rapid-form-attributes="${blockName}"`, `${isStatic ? 'onSubmit' : 'action'}=${form.apiRoute?.length ? `"${form.apiRoute}"` : `{${form.handlerName}}`}`)
                .replace('<form ', isStatic ? '<form ' : '<Form ')
                .replace('</form>', isStatic ? '</form>' : '</Form>')
                .replace('{{submitText}}', form.submitText)
            ).join(''));
    });

    // replace any remaining rapid- placeholders with empty strings
    prototypeTemplate = prototypeTemplate.replace(/<!-- rapid-[^>]+?-->/g, '')
    // replace html class and for attributes with React style
        .replace(/ class=/g, ' className=')
        .replace(/ for=/g, ' htmlFor=');
    
    return Array.from(imports).join(nl)
        + nl + nl
        + generateStaticParamsFunction
        + pagePropsType
        + (!isStatic && formHandlers.length > 0 ? formHandlers + nl + nl : '')
        + `export default function ${componentName}(${pageProps}) {${nl}${destructuredProps}`
        + (isStatic && formHandlers.length > 0 ? `  const router = useRouter();${nl}${nl}${formHandlers}${nl + nl}` : '')
        + `  return (`
        + prototypeTemplate
        + nl + `  );${nl}}`;
}

export default makeRouteTSX;