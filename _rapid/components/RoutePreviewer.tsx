import React, { useEffect } from 'react';
import useRapid from '../hooks/useRapid';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import { Page } from '../data/types';

interface RoutePreviewerProps {
    currentRoute: string | null;
    routeProperties: Page;
}

const RoutePreviewer = ({currentRoute, routeProperties}: RoutePreviewerProps) => {
    const code = `
    import React from 'react';

    const Component = () => {
        return (
            <div>
                Preview!
            </div>
        );
    };

    export default Component;
    `;

    useEffect(() => {
        Prism.highlightAll();
    }, [code]);
    return (
        <section className="bg-white p-6 pt-1 rounded-md shadow-md mt-6 max-w-screen-xl mx-auto format">
            <h2 className="mb-2">{`Route: ${currentRoute} Code Preview`}</h2>
            
            <pre>
                <code className="language-js">{code}</code>
            </pre>
        </section>
    );
}

export default RoutePreviewer;