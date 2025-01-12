import { JSONFileSyncPreset } from "lowdb/node";
import path from "path";
import defaultProject from "./data/default.json";
import { NextApiRequest, NextApiResponse } from "next";
import { Page, Project } from "./data/types";

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const {slug} = req.query;
    if (!slug || !Array.isArray(slug)) {
        return resp.status(400).json({ error: 'Invalid slug format' });
      }
    const [action, ...parameters] = slug;
    const db = JSONFileSyncPreset(path.join(process.cwd(), 'project.json'), defaultProject);

    
    switch (action) {
        case 'project':
            if (req.method === 'GET') {
                resp.status(200).json({project: db.data as Project});
            } else {
                const {currentRoute, routeProperties}: {currentRoute: string, routeProperties: Page} = req.body;
                try {
                    db.data.routes = {
                        ...db.data.routes,
                        [currentRoute]: routeProperties
                    };
                    await db.write();
                    resp.status(200).json({success: true});
                } catch(err) {
                    resp.status(500).json({success: false, message: err});
                }
            }
            break;

        default:
            resp.status(404).json({error: 'API endpoint not found'});
    }

    
}