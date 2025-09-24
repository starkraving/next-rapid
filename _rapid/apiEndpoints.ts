import { JSONFileSyncPreset } from "lowdb/node";
import path from "path";
import fs from "fs";
import defaultProject from "./data/default.json";
import { NextApiRequest, NextApiResponse } from "next";
import { Page, Project, GlobalProperties } from "./data/types";
import makeRouteTSX from "./prototype/libs/makeRouteTSX";
import makeLayoutTSX from "./prototype/libs/makeLayoutTSX";

let publishJob = {
    status: 'idle', // idle, processing, complete, error
    progress: 0,
    message: ''
};

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const {slug} = req.query;
    if (!slug || !Array.isArray(slug)) {
        return resp.status(400).json({ error: 'Invalid slug format' });
      }
    const action = slug.join('/');
    const db = JSONFileSyncPreset<Project>(path.join(process.cwd(), 'project.json'), defaultProject);

    
    switch (action) {
        case 'project':
            if (req.method === 'GET') {
                resp.status(200).json({project: db.data as Project});
            } else {
                const {currentRoute, routeProperties}: {currentRoute: string | null, routeProperties: Page} = req.body;
                try {
                    if (currentRoute) {
                        db.data.routes = {
                            ...db.data.routes,
                            [currentRoute]: routeProperties
                        };
                    } else {
                        db.data.global = routeProperties as GlobalProperties;
                    }
                    await db.write();
                    resp.status(200).json({success: true});
                } catch(err) {
                    resp.status(500).json({success: false, message: err});
                }
            }
            break;
        
        case 'publish':
            if (req.method === 'GET') {
                return resp.status(200).json(publishJob);
            }

            if (req.method === 'POST') {
                const { selectedRoutes, updateLayout } = req.body;
                publishJob = { status: 'processing', progress: 0, message: 'Starting publish process...' };

                resp.status(202).json({ success: true, message: 'Publish process initiated.' });

                // --- Run the build process asynchronously ---
                (async () => {
                    try {
                        const projectPath = path.join(process.cwd(), 'project.json');
                        const projectData = fs.existsSync(projectPath) ? JSON.parse(fs.readFileSync(projectPath, 'utf-8')) : defaultProject;

                        const templatePath = path.join(process.cwd(), '_rapid', 'prototype', 'template.html');
                        const defaultTemplatePath = path.join(process.cwd(), '_rapid', 'prototype', 'template.default.html');
                        let templateHtml = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf-8') : fs.readFileSync(defaultTemplatePath, 'utf-8');
                        const templateContentMatch = templateHtml.match(/<template[^>]*>([\s\S]*)<\/template>/i);
                        templateHtml = templateContentMatch ? templateContentMatch[1] : templateHtml;
                        
                        const tempPublishDir = path.join(process.cwd(), '.rapid_temp_publish');
                        const appDir = path.join(process.cwd(), 'app');

                        // Clean up previous temp directory if it exists
                        if (fs.existsSync(tempPublishDir)) {
                            await fs.promises.rm(tempPublishDir, { recursive: true, force: true });
                        }
                        await fs.promises.mkdir(tempPublishDir, { recursive: true });

                        if (updateLayout) {
                            // Generate and update layout.tsx
                            publishJob.message = 'Generating app/layout.tsx...';
                            const layoutFilePath = path.join(tempPublishDir, 'layout.tsx');
                            const originalLayoutPath = path.join(appDir, 'layout.tsx');
                            let originalLayoutContent = await fs.promises.readFile(originalLayoutPath, 'utf-8');
                            
                            const [imports, formHandlers, newBodyContent] = makeLayoutTSX(templateHtml, projectData.global);

                            originalLayoutContent = imports + formHandlers + originalLayoutContent;
                            const newLayoutContent = originalLayoutContent.replace(/(<body[^>]*>)[\s\S]*(<\/body>)/gi, `$1${newBodyContent}$2`);
                            
                            await fs.promises.writeFile(layoutFilePath, newLayoutContent);
                        }

                        for (let i = 0; i < selectedRoutes.length; i++) {
                            const currentRoute = selectedRoutes[i];
                            const routeObject = projectData.routes[currentRoute];
                            const convertedPath = currentRoute.replace(/:(\w+)/g, '[$1]');

                            if (!routeObject) {
                                console.warn(`Route properties not found for ${currentRoute}, skipping...`);
                                continue;
                            }
                            
                            const targetPath = path.join(tempPublishDir, convertedPath, 'page.tsx');

                            publishJob.message = `Generating ${convertedPath}...`;
                            
                            const tsxContent = makeRouteTSX(templateHtml, currentRoute, routeObject);

                            await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
                            await fs.promises.writeFile(targetPath, tsxContent);

                            publishJob.progress = ((i + 1) / selectedRoutes.length) * 100;

                            // Add a 1-second delay to make the progress visible
                            await new Promise(resolve => setTimeout(resolve, 500));
                        }

                        publishJob.message = 'Moving files to app directory...';
                        await fs.promises.cp(tempPublishDir, appDir, { recursive: true, force: true });
                        
                        publishJob.status = 'complete';
                        publishJob.message = 'Publish process completed successfully.';

                    } catch (error: any) {
                        publishJob.status = 'error';
                        publishJob.message = `Error during publish: ${error.message}`;
                    } finally {
                        // Clean up the temporary directory
                        const tempPublishDir = path.join(process.cwd(), '.rapid_temp_publish');
                        if (fs.existsSync(tempPublishDir)) {
                            await fs.promises.rm(tempPublishDir, { recursive: true, force: true });
                        }
                    }
                })();
            }
            break;

        default:
            resp.status(404).json({error: 'API endpoint not found'});
    }

    
}
