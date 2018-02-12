/*
 * @name DMV Appt
 *
 */
const puppeteer = require('puppeteer')
const screenshot = '/tmp/screenshot.png'

console.log('Booking script started');
function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
}

booked = false;
async function loop() {
        while(!booked){
                //console.log('Timeout Called');
                bookAppt();
                await sleep(process.env.SLEEP);
        }
}

async function bookAppt(){
        const browser = await puppeteer.launch({
                                args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        try{
                const page = await browser.newPage()
                await page.setViewport({ width: 1280, height: 800 })
                await page.goto('https://www.dmv.ca.gov/wasapp/foa/clear.do?goTo=officeVisit&localeName=en', {waitUntil: 'networkidle2'})

                await page.select('select', process.env.OFFICE_CODE)

                await page.click('#one_task');
                await page.click('#taskCID');
                await page.type('#first_name',process.env.FIRST_NAME, {delay: 20});
                await page.type('#last_name',process.env.LAST_NAME, {delay: 20});
                await page.type('#areaCode',process.env.AREACODE, {delay: 20});
                await page.type('#telPrefix',process.env.TELPREFIX, {delay: 20});
                await page.type('#telSuffix',process.env.TELSUFFIX, {delay: 20});

                // Submit the form.
                //await page.screenshot({path: screenshot,fullPage: true });
                page.click('input.btn-primary');
                await page.waitForNavigation({waitUntil: ['networkidle2', 'load', 'domcontentloaded']})

                //console.log(await page.url());
                //await page.screenshot({path: screenshot,fullPage: true });
                const nextAvailableTime = await page.evaluate(() => document.querySelector('#formId_1 > div > div.r-table.col-xs-12 > table > tbody > tr > td:nth-child(3) > p:nth-child(2) > strong').textContent)
                atIndex = nextAvailableTime.indexOf("at");
                availableDate = new Date(nextAvailableTime.substring(1,atIndex));

                //YYYY-MM-DD
                targetDate = new Date(process.env.TARGET_DATE);
                //console.log(availableDate);
                if(targetDate.getTime() > availableDate.getTime()){
                        console.log('Ready to book for '+ nextAvailableTime);
                        //Click on Continue
                        page.click('#app_content > div > a.btn-primary');
                        await page.waitForNavigation({ waitUntil: ['networkidle2', 'load', 'domcontentloaded'] });
                        //await page.screenshot({path: screenshot,fullPage: true });

                        //Provide Email
                        await page.click('#email_method');
                        await page.type('#notify_email','rajesh.guptan@gmail.com',{delay: 20});
                        await page.type('#notify_email_confirm','rajesh.guptan@gmail.com',{delay: 20});
                        page.click('#app_content > form > fieldset > div.col-xs-12.form-group.button-group.xs-expand.centered > input');
                        await page.waitForNavigation({ waitUntil: ['networkidle2', 'load', 'domcontentloaded'] });

                        //Final Confirmation
                        page.click('#ApptForm > fieldset > div.col-xs-12.form-group.button-group.xs-expand.centered > input');
                        await page.waitForNavigation({ waitUntil: ['networkidle2', 'load', 'domcontentloaded'] });
                        //await page.screenshot({path: screenshot,fullPage: true });
                        //console.log('See screenshot: ' + screenshot);
                        booked=true;
                        console.log('Booking Completed');
                } else {
                        console.log(nextAvailableTime.trim() +' after Target Date '+targetDate);
                }
        } catch (err) {
                console.error(err)
        }
        await browser.close()
}

loop();
