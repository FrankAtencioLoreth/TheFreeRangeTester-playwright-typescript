import { expect, test } from '@playwright/test';

//CMD: npx playwright test --grep=@navigation --headless=true --project=chromium
test.describe('the free range tester tests navigation set', async () => {

    const sections = [
        { name: 'Academia', url: '/academia', title: 'Academia' },
        { name: 'Cursos', url: '/cursos', title: 'Cursos' },
        { name: 'Mentorías', url: '/mentoria-1-1-con-pato', title: 'Mentoría personalizada de avance de carrera para testers de software' },
        { name: 'Recursos', url: '/recursos', title: 'Recursos' },
        { name: 'Udemy', url: '/udemy', title: 'Udemy' },
        { name: 'Blog', url: '/blog', title: 'Free Range Testers' },
    ];

    for(const sect of sections) {

        test.beforeEach('Before each', async ({page}) => {
            await test.step('Navigating to main page', async () => {
                await page.goto('/');
            });
        });

        test(`Validate navigation of ${sect.name} section`, 
            {
                tag: ['@navigation', '@regression'],
                annotation: {
                    type: 'Issue', 
                    description: 'Test'
                }
            },
            async ({ page }) => {

            await test.step('I am in freerangetesters.com', async () => {
                await expect(page).toHaveTitle('Free Range Testers');
            });
    
            await test.step(`Doing click on ${sect.name} button`, async () => {
                await page.locator('#page_header').getByRole('link',{name: sect.name, exact: true}).click();
            });
    
            await test.step(`I am redirect to ${sect.title} page`, async () => {
                await page.waitForURL(`**${sect.url}`);
                await expect(page).toHaveTitle(`${sect.title}`)
            });
    
        });

        test.afterEach('After each', async ({page}) => {
            await page.close();
        });
    }

});