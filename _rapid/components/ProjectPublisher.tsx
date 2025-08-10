import React, { SyntheticEvent, useEffect, useRef } from 'react';
import useRapid from '../hooks/useRapid';
import makeRouteTSX from '../prototype/libs/makeRouteTSX';
import Prism from 'prismjs';

const sortRoutesForTreeView = (a: string, b: string): number => {
    // The root route should always be first.
    if (a === '/') return -1;
    if (b === '/') return 1;

    // Split routes into their segments and remove empty strings from leading slash
    const partsA = a.split('/').filter(Boolean);
    const partsB = b.split('/').filter(Boolean);

    const shortestLength = Math.min(partsA.length, partsB.length);

    // Compare each segment of the paths
    for (let i = 0; i < shortestLength; i++) {
        const comparison = partsA[i].localeCompare(partsB[i]);
        if (comparison !== 0) {
        return comparison;
        }
    }

    // If one path is a prefix of the other, the shorter one comes first.
    return partsA.length - partsB.length;
};

const formatRouteForDisplay = (route: string): string => {
    return route.replace(/:(\w+)/g, '[$1]');
};
    
export default function ProjectPublisher() {
    const { allRoutes, selectedRoutes, dispatchSetSelectedRoutes } = useRapid();
    const [routeCode, setRouteCode] = React.useState<string|null>(null);
    const codeContainerRef = useRef<HTMLPreElement>(null);
    const templateHTML = document.querySelector('#prototype_template template')?.innerHTML ?? '';

    useEffect(() => {
        // only set up the code highlighting if the routeCode is set
        if (!routeCode) {
            return;
        }
        Prism.highlightAll();
    }, [routeCode]);

    const handleRoutePreview = (evt: SyntheticEvent<HTMLButtonElement>) => {
        const route = evt.currentTarget.value;
        const routeContent = allRoutes[route];
        if (routeContent) {
            const routeTSX = makeRouteTSX(templateHTML, route, routeContent);
            setRouteCode(routeTSX);
        }
        evt.stopPropagation();
    };

    const resetRoutePreview = () => {
        if (codeContainerRef.current) {
            codeContainerRef.current.scrollTo(0, 0);
        }
        setRouteCode(null);
    };

    return (
        <>
            <section className="bg-white p-6 pt-1 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
                <h2 className="mb-2">Publish Files</h2>
                
                <ul className="list-none">
                    {Object.keys(allRoutes).sort(sortRoutesForTreeView).map((route, index) => (
                        <li key={index} className="mb-2">
                            <label>
                                <input
                                    type="checkbox"
                                    name="selectedRoute"
                                    value={route}
                                    defaultChecked={selectedRoutes.includes(route)}
                                    onChange={(evt) => {
                                        const selectedRoute = evt.currentTarget.value;
                                        dispatchSetSelectedRoutes(selectedRoute);
                                    }}
                                    className="hidden"
                                />
                                <span className="text-gray-700 flex gap-2 items-top">
                                    {
                                        selectedRoutes.includes(route) ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M176,56H80a72,72,0,0,0,0,144h96a72,72,0,0,0,0-144Zm0,112a40,40,0,1,1,40-40A40,40,0,0,1,176,168Z"></path></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M176,56H80a72,72,0,0,0,0,144h96a72,72,0,0,0,0-144Zm0,128H80A56,56,0,0,1,80,72h96a56,56,0,0,1,0,112ZM80,88a40,40,0,1,0,40,40A40,40,0,0,0,80,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,80,152Z"></path></svg>
                                        )
                                    }
                                    <span className="flex-col flex items-start gap-2 mb-1">
                                        {formatRouteForDisplay(route)}
                                        <button className="bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-500 text-xs rounded py-1 px-2 flex gap-1 items-center"
                                            type="button"
                                            popoverTarget="dialog"
                                            value={route}
                                            onClick={handleRoutePreview}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                                                <path fill-rule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clip-rule="evenodd" />
                                            </svg>
                                            Preview
                                        </button>
                                    </span>
                                </span>
                            </label>
                        </li>
                    ))}
                </ul>
            </section>
            <dialog id="dialog" popover="manual" className="p-6 w-full max-w-6xl h-5/6 rounded-lg shadow-xl backdrop:bg-black/50 m-auto">
                <button 
                    popoverTarget="dialog"
                    popoverTargetAction="hide"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    onClick={resetRoutePreview}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="overflow-y-auto h-full">
                    <pre className="bg-gray-900 text-white p-4 rounded-md min-h-full !mt-0" ref={codeContainerRef}><code className="language-js">{routeCode}</code></pre>
                </div>
            </dialog>
        </>
    );
}