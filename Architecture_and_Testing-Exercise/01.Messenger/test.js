const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const mockData = {
    "-LxHVtajG3N1sU714pVj":
        {"author": "Spami",
        "content": "Hello, are you there?"},
    "-LxIDxC-GotWtf4eHwV8":
        {"author": "Garry",
        "content": "Yep, whats up :?"},
    "-LxIDxPfhsNipDrOQ5g_":
        {"author": "Spami",
        "content":"How are you? Long time no see? :)"},
    "-LxIE-dM_msaz1O9MouM":
        {"author": "George",
        "content": "Hello, guys! :))"},
    "-LxLgX_nOIiuvbwmxt8w":
        {"author": "Spami",
        "content": "Hello, George nice to see you! :)))"}
};

function json(data) {
    return {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
}

describe('Tests', async function() {
    this.timeout(5000);

    let browser, page;

    before(async () => {
        browser = await chromium.launch({headless: false, slowMo: 500});
    });
    after(async () => {
        await browser.close();
    });
    beforeEach(async () => {
        page = await browser.newPage();
    });
    afterEach(async () => {
        await page.close();
    });

    it('Loads messeges on refresh', async () => {
        await page.route('**/jsonstore/messenger*', (route) => {
            route.fulfill(json(mockData));
        });

        await page.goto('http://localhost:5500');

        const [response] = await Promise.all([
            page.waitForResponse(response => response.url() === 'http://localhost:3030/jsonstore/messenger' && response.status() === 200),
            await page.click('text=Refresh')
        ]);

        const data = await response.json();
        expect(data).to.deep.eq(mockData);
    });
    
    it('Sends a message with proper request', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('input#author', 'Author');
        await page.fill('input#content', 'Message content');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('input#submit')
        ]);

        const data = JSON.parse(request.postData());
        expect(data).to.deep.eq({ author: 'Author', content: 'Message content' });
    })
})