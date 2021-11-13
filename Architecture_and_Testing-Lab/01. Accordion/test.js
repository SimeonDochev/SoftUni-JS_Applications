const { chromium } = require('playwright-chromium');
const { expect } = require('chai');

let browser, page;

describe('E2E tests', async function() {
    this.timeout(5000);
    before(async () => {
        browser = await chromium.launch({ handless: false, slowMo: 500 });
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

    it('load static page', async () => {
        await page.goto('http://localhost:5500');
    
        const content = await page.textContent('.accordion .head span');
        expect(content).to.contains('Scalable Vector Graphics');
    });
    
    it('toggles content', async () => {
        await page.goto('http://localhost:5500');
    
        await page.click('#main>.accordion:first-child >> text=More');
        await page.waitForSelector('#main>.accordion:first-child >> .extra p');
        const visible = await page.isVisible('#main>.accordion:first-child >> .extra p');
        expect(visible).to.be.true;
    });
    
    it('toggles content', async () => {
        await page.goto('http://localhost:5500');
    
        await page.click('#main>.accordion:first-child >> text=More');
        await page.waitForSelector('#main>.accordion:first-child >> .extra p');
        await page.click('#main>.accordion:first-child >> text=Less');
    
        const visible = await page.isVisible('#main>.accordion:first-child >> .extra p');
        expect(visible).to.be.false;
    });
})