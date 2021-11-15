const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

const mockData = {
    "d953e5fb-a585-4d6b-92d3-ee90697398a0":
        {"author": "J.K.Rowling",
        "title": "Harry Potter and the Philosopher's Stone"},
    "d953e5fb-a585-4d6b-92d3-ee90697398a1":
        {"author": "Svetlin Nakov",
        "title": "C# Fundamentals"}
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
    this.timeout(10000);

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

    it('Loads and displays all books', async () => {
        await page.route('**/jsonstore/collections/books*', (route) => {
            route.fulfill(json(mockData));
        });

        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');
        await page.waitForSelector('text=Harry Potter');
        const rows = await page.$$eval('tr', (rows) => rows.map(r => r.textContent.trim()));

        expect(rows[1]).to.contain('Harry Potter');
        expect(rows[1]).to.contain('Rowling');
        expect(rows[2]).to.contain('C# Fundamentals');
        expect(rows[2]).to.contain('Nakov');
    });
    it('Creates a book', async () => {
        await page.goto('http://localhost:5500');

        await page.fill('form#createForm >> input[name="title"]', 'Title');
        await page.fill('form#createForm >> input[name="author"]', 'Author');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'POST'),
            page.click('form#createForm >> text=Submit')
        ]);

        const data = JSON.parse(request.postData());

        expect(data.title).to.equal('Title');
        expect(data.author).to.equal('Author');
    });
    it('Edits a book', async () => {
        await page.route('**/jsonstore/collections/books*', (route) => {
            route.fulfill(json(mockData));
        });
        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');
        await page.click('text=Edit');
        const visible = await page.isVisible('form#editForm');
        expect(visible).to.be.true;

        await page.fill('form#editForm >> input[name="title"]', 'New title');
        await page.fill('form#editForm >> input[name="author"]', 'New author');

        const [request] = await Promise.all([
            page.waitForRequest(request => request.method() == 'PUT'),
            page.click('form#editForm >> text=Save')
        ]);

        const data = JSON.parse(request.postData());

        expect(data.title).to.equal('New title');
        expect(data.author).to.equal('New author');
        
        page.waitForTimeout(10000);
    });
    it('Deletes a book', async () => {
        await page.route('**/jsonstore/collections/books*', (route) => {
            route.fulfill(json(mockData));
        });
        await page.goto('http://localhost:5500');

        await page.click('text=Load All Books');
        await page.click('text=Delete');

        //Doesn't accept the dialog window.
        await page.on('dialog', dialog => dialog.accept());

        await page.waitForRequest(request => request.method() == 'DELETE');
    });
})