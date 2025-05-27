import { test, expect } from '@playwright/test';

test.describe('Locators in Playwright', async () => {

    test.beforeEach('Before each', async ({page}) => {
        await test.step('Navigating to main page', async () => {
            await page.goto('https://thefreerangetester.github.io/sandbox-automation-testing/');
        });
    });

    test('Click action', async ({page, browserName}) => {
        test.skip(browserName === 'chromium', 'Dont still works on chrome')
        const button = await page
        .getByRole('button', { name: 'Hacé click para generar un ID dinámico y mostrar el elemento oculto' });
        button.click();

        await expect(page.getByText('OMG, aparezco después de 3 segundos de haber hecho click en el botón 👻.')).toBeVisible();

    });

    test('Fill action', async ({page}) => {
        const text = 'Hello World!';
        const element = page.getByPlaceholder('Ingresá texto');
        await expect(element, "The element isn't editable").toBeEditable();
        await element.fill(text);
        await expect(element).toHaveValue(text); 
    });

    test('Type action', async ({page}) => {
        await page
        .getByPlaceholder('Ingresá texto')
        .type('Hello World!');

        await page
        .getByPlaceholder('Ingresá texto').press('Enter')
    });

    test('Radio buttons', async ({page}) => {
        const element = page.getByLabel('No');
        await element.check();
        await expect(element, "The element hasn't checked").toBeChecked();
    });

    test('Checkboxes', async ({page}) => {
        const checkbox = await page
        .getByLabel('Pizza 🍕');

        await checkbox.check();
        await expect(checkbox).toBeChecked();

        await checkbox.check();
        await checkbox.uncheck();
        await expect(checkbox).not.toBeChecked();

    });

    test('Selects', async ({page}) => {
        const sports = ['Fútbol','Tennis','Basketball'];
        //Validate select's options
        for(let sport of sports) {
            const element = await page.$(`select#formBasicSelect > option:is(:text("${sport}"))`);

            if(element) {
                console.log(`The element ${sport} does present`);
            } else {
                throw new Error(`The element ${sport} does not present`);
            }
        }
    });
 
    test('Selects - Days of week', async ({page}) => {
        await page.getByRole('button', {name: 'Día de la semana'}).click();
        await page.getByRole('link', {name: 'Martes'}).click();
    });

    test('Upload file', async ({page}) => {
        await page.getByLabel('upload').setInputFiles('path/filename');
    });

    test('Static table', async ({page}) => {
        const nameValues = await page.$$eval(
            'h2:has-text("Tabla estática") + table tbody tr td:nth-child(2)', elements => elements.map(e => e.textContent)
        );
        const expectedValues = ['Messi', 'Ronaldo', 'Mbappe'];
        
        expect(nameValues).toEqual(expectedValues);
    });

    test('Dynamic table', async ({page}) => {
        const initialValues = await page.$$eval(
            'h2:has-text("Tabla dinámica") + table tbody tr td', elements => elements.map(e => e.textContent)
        );

        await page.reload();

        const postReloadValues = await page.$$eval(
            'h2:has-text("Tabla dinámica") + table tbody tr td:nth-child(2)', elements => elements.map(e => e.textContent)
        );

        expect(initialValues).not.toEqual(postReloadValues);
    });

    test('Upload multiple files', async ({page}) => {
        await page.getByLabel('upload').setInputFiles(
            ['path/filename', 'path/filename_2', 'path/filename_3']
        );
    });

    test('Drag and drop', async ({page}) => {
        await page.getByLabel('dragFrom')
        .dragTo(page.getByLabel('DragTo'));
    });

    test.only('Soft asertions', async ({page}) => {
        await expect.soft(page.getByText('Pizza 🍕'), 'No se encontró el elemento').toBeVisible();
        await expect.soft(page.getByText('Hamburguesa 🍔'), 'No se encontró el elemento').toBeVisible();
        await expect.soft(page.getByText('Pasta 🍝'), 'No se encontró el elemento').toBeVisible();
        await expect.soft(page.getByText('Helado 🍧'), 'No se encontró el elemento').toBeVisible();
        await expect.soft(page.getByText('Torta 🍰'), 'No se encontró el elemento').toBeVisible();
    });

    test('Popup validation', async ({page}) => {
        await page.getByRole('button', {name: 'Motrar popup'}).click();
        await expect(page.getByText('¿Viste? ¡Apareció un Pop-up!')).toHaveText('¿Viste? ¡Apareció un Pop-up!');
        await page.getByRole('button', {name: 'Cerrar'}).click();
    });

    test.afterEach('After each', async ({page}) => {
        await test.info().attach('screenshots', {
            body: await page.screenshot(),
            contentType: 'image/png'
        });
        await page.close();
    });

});