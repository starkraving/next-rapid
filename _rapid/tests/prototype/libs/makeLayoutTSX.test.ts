import makeLayoutTSX from "../../../_rapid/prototype/libs/makeLayoutTSX";
import { GlobalProperties } from "../../../_rapid/data/types";

describe('makeLayoutTSX', () => {
    // Test case 1: Basic template with no special rapid comments
    test('should return template content with children placeholder if no rapid-route comments', () => {
        const templateHTML = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <template>
                        <div>
                            <h1>Welcome</h1>
                            {children}
                        </div>
                    </template>
                </body>
            </html>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                        <div>
                            <h1>Welcome</h1>
                            {children}
                        </div>
                    `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 2: Template with rapid-route comments
    test('should replace rapid-route comments with children placeholder', () => {
        const templateHTML = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <template>
                        <div>
                            <!-- rapid-route-start -->
                            Original Content
                            <!-- rapid-route-end -->
                        </div>
                    </template>
                </body>
            </html>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                        <div>
                            {children}
                        </div>
                    `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 3: Template without <template> tags
    test('should return {children} if no template tags are found', () => {
        const templateHTML = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <div>
                        <h1>Welcome</h1>
                    </div>
                </body>
            </html>
        `;
        const globalData: GlobalProperties = { links: [] };
        expect(makeLayoutTSX(templateHTML, globalData)).toBe('{children}');
    });

    // Test case 4: Template with link blocks and no links in globalData
    test('should remove link blocks if no corresponding links in globalData', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-link-block-start="nav" -->
                    <ul>
                        <!-- rapid-link-repeat-start="nav" -->
                        <li><a href="{{route}}">{{visibleText}}</a></li>
                        <!-- rapid-link-repeat-end="nav" -->
                    </ul>
                    <!-- rapid-link-block-end="nav" -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                <div>
                    
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 5: Template with link blocks and links in globalData
    test('should process link blocks with links from globalData', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-link-block-start="nav" -->
                    <ul>
                        <!-- rapid-link-repeat-start="nav" -->
                        <li><a href="{{route}}">{{visibleText}}</a></li>
                        <!-- rapid-link-repeat-end="nav" -->
                    </ul>
                    <!-- rapid-link-block-end="nav" -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/home', visibleText: 'Home', templateLocation: 'nav' },
                { route: '/about', visibleText: 'About', templateLocation: 'nav' },
            ],
        };
        const expected = `
                <div>
                    <ul>
                        <li><Link href="/home">Home</Link></li><li><Link href="/about">About</Link></li>
                    </ul>
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 6: Final cleanup - class to className, for to htmlFor
    test('should replace class with className and for with htmlFor', () => {
        const templateHTML = `
            <template>
                <div class="container">
                    <label for="name">Name</label>
                </div>
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                <div className="container">
                    <label htmlFor="name">Name</label>
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 7: Final cleanup - remove rapid comments
    test('should remove all rapid comments', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-some-comment -->
                    Hello
                    <!-- rapid-another-comment -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                <div>
                    
                    Hello
                    
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 8: Mixed content with rapid-route and link blocks
    test('should handle mixed content with rapid-route and link blocks', () => {
        const templateHTML = `
            <template>
                <header>
                    <!-- rapid-link-block-start="header-nav" -->
                    <nav>
                        <!-- rapid-link-repeat-start="header-nav" -->
                        <a href="{{route}}">{{visibleText}}</a>
                        <!-- rapid-link-repeat-end="header-nav" -->
                    </nav>
                    <!-- rapid-link-block-end="header-nav" -->
                </header>
                <main>
                    <!-- rapid-route-start -->
                    Default Main Content
                    <!-- rapid-route-end -->
                </main>
                <footer>
                    <!-- rapid-link-block-start="footer-nav" -->
                    <nav>
                        <!-- rapid-link-repeat-start="footer-nav" -->
                        <a href="{{route}}">{{visibleText}}</a>
                        <!-- rapid-link-repeat-end="footer-nav" -->
                    </nav>
                    <!-- rapid-link-block-end="footer-nav" -->
                </footer>
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/h1', visibleText: 'Header Link 1', templateLocation: 'header-nav' },
                { route: '/f1', visibleText: 'Footer Link 1', templateLocation: 'footer-nav' },
            ],
        };
        const expected = `
                <header>
                    <nav>
                        <Link href="/h1">Header Link 1</Link>
                    </nav>
                </header>
                <main>
                    {children}
                </main>
                <footer>
                    <nav>
                        <Link href="/f1">Footer Link 1</Link>
                    </nav>
                </footer>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 9: No links for a specific block, but other blocks have links
    test('should remove a link block if no links for it, even if others exist', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-link-block-start="nav1" -->
                    <!-- rapid-link-repeat-start="nav1" -->
                    <a href="{{route}}">{{visibleText}}</a>
                    <!-- rapid-link-repeat-end="nav1" -->
                    <!-- rapid-link-block-end="nav1" -->

                    <!-- rapid-link-block-start="nav2" -->
                    <!-- rapid-link-repeat-start="nav2" -->
                    <a href="{{route}}">{{visibleText}}</a>
                    <!-- rapid-link-repeat-end="nav2" -->
                    <!-- rapid-link-block-end="nav2" -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/nav2-link', visibleText: 'Nav2 Link', templateLocation: 'nav2' },
            ],
        };
        const expected = `
                <div>
                    

                    <Link href="/nav2-link">Nav2 Link</Link>
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 10: Link block with no repeat comments
    test('should not process link block if repeat comments are missing', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-link-block-start="nav" -->
                    <ul>
                        <li><a href="/static">Static Link</a></li>
                    </ul>
                    <!-- rapid-link-block-end="nav" -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/home', visibleText: 'Home', templateLocation: 'nav' },
            ],
        };
        const expected = `
                <div>
                    <ul>
                        <li><Link href="/static">Static Link</Link></li>
                    </ul>
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 11: Empty template tag content
    test('should handle empty template tag content', () => {
        const templateHTML = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <template></template>
                </body>
            </html>
        `;
        const globalData: GlobalProperties = { links: [] };
        expect(makeLayoutTSX(templateHTML, globalData)).toBe('');
    });

    // Test case 12: Template with multiple rapid-route comments (only first pair should be processed)
    test('should only process the first pair of rapid-route comments', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-route-start -->
                    Content 1
                    <!-- rapid-route-end -->
                    <span>Separator</span>
                    <!-- rapid-route-start -->
                    Content 2
                    <!-- rapid-route-end -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                <div>
                    {children}
                    <span>Separator</span>
                    <!-- rapid-route-start -->
                    Content 2
                    <!-- rapid-route-end -->
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 13: Template with self-closing template tag (should return {children})
    test('should return {children} if template tag is self-closing', () => {
        const templateHTML = `
            <html>
                <head><title>Test</title></head>
                <body>
                    <template />
                </body>
            </html>
        `;
        const globalData: GlobalProperties = { links: [] };
        expect(makeLayoutTSX(templateHTML, globalData)).toBe('{children}');
    });

    // Test case 14: Template with attributes on template tag
    test('should correctly parse template tag with attributes', () => {
        const templateHTML = `
            <template data-layout="main">
                <div>Hello</div>
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                <div>Hello</div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 15: Link processing with special characters in visibleText
    test('should handle special characters in visibleText for links', () => {
        const templateHTML = `
            <template>
                <!-- rapid-link-block-start="nav" -->
                <!-- rapid-link-repeat-start="nav" -->
                <a href="{{route}}">{{visibleText}}</a>
                <!-- rapid-link-repeat-end="nav" -->
                <!-- rapid-link-block-end="nav" -->
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/search', visibleText: 'Search & Find', templateLocation: 'nav' },
            ],
        };
        const expected = `
                <Link href="/search">Search & Find</Link>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 16: No links in globalData, but link blocks exist (should remove blocks)
    test('should remove link blocks if globalData.links is undefined or empty', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-link-block-start="nav" -->
                    <ul>
                        <!-- rapid-link-repeat-start="nav" -->
                        <li><a href="{{route}}">{{visibleText}}</a></li>
                        <!-- rapid-link-repeat-end="nav" -->
                    </ul>
                    <!-- rapid-link-block-end="nav" -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = { links: undefined };
        const expected = `
                <div>
                    
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);

        const globalDataEmpty: GlobalProperties = { links: [] };
        expect(makeLayoutTSX(templateHTML, globalDataEmpty)).toBe(expected);
    });

    // Test case 17: Ensure console.log calls are not in the final output
    test('should not include console.log statements in the final output', () => {
        const templateHTML = `
            <template>
                <div>Hello</div>
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const result = makeLayoutTSX(templateHTML, globalData);
        expect(result).not.toContain('console.log');
    });

    // Test case 18: Handling multiple link blocks with different templateLocations
    test('should handle multiple link blocks with different templateLocations', () => {
        const templateHTML = `
            <template>
                <nav>
                    <!-- rapid-link-block-start="main-nav" -->
                    <!-- rapid-link-repeat-start="main-nav" -->
                    <a href="{{route}}">{{visibleText}}</a>
                    <!-- rapid-link-repeat-end="main-nav" -->
                    <!-- rapid-link-block-end="main-nav" -->
                </nav>
                <footer>
                    <!-- rapid-link-block-start="footer-nav" -->
                    <!-- rapid-link-repeat-start="footer-nav" -->
                    <a href="{{route}}">{{visibleText}}</a>
                    <!-- rapid-link-repeat-end="footer-nav" -->
                    <!-- rapid-link-block-end="footer-nav" -->
                </footer>
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/home', visibleText: 'Home', templateLocation: 'main-nav' },
                { route: '/contact', visibleText: 'Contact', templateLocation: 'footer-nav' },
            ],
        };
        const expected = `
                <nav>
                    <Link href="/home">Home</Link>
                </nav>
                <footer>
                    <Link href="/contact">Contact</Link>
                </footer>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 19: Link block with no repeat comments, but with other content
    test('should keep other content in link block if repeat comments are missing', () => {
        const templateHTML = `
            <template>
                <div>
                    <!-- rapid-link-block-start="nav" -->
                    <ul>
                        <li>Static Item</li>
                        <li><a href="/another">Another Link</a></li>
                    </ul>
                    <!-- rapid-link-block-end="nav" -->
                </div>
            </template>
        `;
        const globalData: GlobalProperties = {
            links: [
                { route: '/dynamic', visibleText: 'Dynamic', templateLocation: 'nav' },
            ],
        };
        const expected = `
                <div>
                    <ul>
                        <li>Static Item</li>
                        <li><Link href="/another">Another Link</Link></li>
                    </ul>
                </div>
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });

    // Test case 20: Template with only rapid-route comments and no other content
    test('should correctly handle template with only rapid-route comments', () => {
        const templateHTML = `
            <template>
                <!-- rapid-route-start -->
                <!-- rapid-route-end -->
            </template>
        `;
        const globalData: GlobalProperties = { links: [] };
        const expected = `
                {children}
            `;
        expect(makeLayoutTSX(templateHTML, globalData)).toBe(expected);
    });
});
