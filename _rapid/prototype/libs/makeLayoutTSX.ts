import { GlobalProperties, Link } from "../../data/types";

export default function makeLayoutTSX(templateHTML: string, globalData: GlobalProperties): string {
    console.log('makeLayoutTSX: templateHTML length:', templateHTML.length);
    console.log('makeLayoutTSX: globalData:', JSON.stringify(globalData, null, 2));

    const templateContentMatch = templateHTML.match(/<template[^>]*>([\s\S]*)<\/template>/i);
    console.log('makeLayoutTSX: templateContentMatch:', templateContentMatch ? 'found' : 'not found');
    if (!templateContentMatch) {
        return '{children}';
    }

    let layoutContent = templateContentMatch[1];
    console.log('makeLayoutTSX: layoutContent after template match length:', layoutContent.length);

    const routeStartComment = '<!-- rapid-route-start -->';
    const routeEndComment = '<!-- rapid-route-end -->';
    const routeStartIndex = layoutContent.indexOf(routeStartComment);
    const routeEndIndex = layoutContent.indexOf(routeEndComment);

    if (routeStartIndex !== -1 && routeEndIndex !== -1) {
        layoutContent = 
            layoutContent.substring(0, routeStartIndex) + 
            '{children}' + 
            layoutContent.substring(routeEndIndex + routeEndComment.length);
        console.log('makeLayoutTSX: layoutContent after children replacement length:', layoutContent.length);
    }

    // --- Link Processing (borrowed from makeTemplateHTML) ---
    const allLinks = (globalData.links || [])
        .reduce((collector: { [key: string]: Link[] }, link: Link) => {
            if (link.templateLocation === undefined) {
                return collector;
            }
            if (!(link.templateLocation in collector)) {
                collector[link.templateLocation] = [];
            }
            collector[link.templateLocation].push(link);
            return collector;
        }, {});

    const allLinkBlocksRegex = /rapid-link-block-start="([^"]+)"/g;
    const allLinkBlocks = [...layoutContent.matchAll(allLinkBlocksRegex)]
        .map(([, blockName]) => blockName);

    console.log('makeLayoutTSX: allLinkBlocks:', allLinkBlocks);

    allLinkBlocks.forEach((blockName) => {
        const blockLinks = allLinks[blockName] || [];
        const linkBlockRegex = new RegExp(`<!-- rapid-link-block-start="${blockName}" -->[\s\S]*?<!-- rapid-link-block-end="${blockName}" -->`);
        
        if (blockLinks.length === 0) {
            layoutContent = layoutContent.replace(linkBlockRegex, '');
            console.log(`makeLayoutTSX: Removed empty link block ${blockName}.`);
            return;
        }

        const linkRepeatStart = `<!-- rapid-link-repeat-start="${blockName}" -->`;
        const linkRepeatEnd = `<!-- rapid-link-repeat-end="${blockName}" -->`;
        
        const repeatStartIndex = layoutContent.indexOf(linkRepeatStart);
        const repeatEndIndex = layoutContent.indexOf(linkRepeatEnd);

        if (repeatStartIndex !== -1 && repeatEndIndex !== -1) {
            const linkRepeatTemplate = layoutContent.substring(repeatStartIndex + linkRepeatStart.length, repeatEndIndex);
            const linksHtml = blockLinks.map((link: Link) => 
                linkRepeatTemplate
                    .replace('{{route}}', link.route)
                    .replace('{{visibleText}}', link.visibleText)
                    .replace(/<a /g, '<Link ')
                    .replace(/<\/a>/g, '</Link>')
            ).join('');
            
            const entireBlock = layoutContent.substring(layoutContent.indexOf(`<!-- rapid-link-block-start="${blockName}" -->`), layoutContent.indexOf(`<!-- rapid-link-block-end="${blockName}" -->`) + `<!-- rapid-link-block-end="${blockName}" -->`.length);
            const newBlock = entireBlock.replace(linkRepeatStart + linkRepeatTemplate + linkRepeatEnd, linksHtml);

            layoutContent = layoutContent.replace(entireBlock, newBlock);
            console.log(`makeLayoutTSX: Processed link block ${blockName}.`);
        } else {
            console.log(`makeLayoutTSX: Link repeat comments not found for block ${blockName}.`);
        }
    });

    // --- Final Cleanup ---
    layoutContent = layoutContent
        .replace(/ class=/g, ' className=')
        .replace(/ for=/g, ' htmlFor=')
        .replace(/<!-- rapid-[^>]+?-->/g, '');

    console.log('makeLayoutTSX: Final layoutContent length:', layoutContent.length);
    return layoutContent;
}
