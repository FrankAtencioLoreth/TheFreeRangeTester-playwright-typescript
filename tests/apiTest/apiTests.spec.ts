import { test, expect } from '@playwright/test';

const REPOSITORY = 'repository-api-test';
const USER = 'FrankAtencioLoreth';
const PATH = `/repos/${USER}/${REPOSITORY}/issues`;

test.describe('Api tests', async () => {

    test.beforeAll(async ({ request }) => {

        const response = await request.post('user/repos', {
            data: {
                name: REPOSITORY
            }
        });
        
        expect(response.status()).toBe(201);

    });

    test('The user can create an Issue in the github repository', async({ request }) => {
        const newIssue = await request.post(PATH, {
            data: {
                title: '[BUG] - Report',
                body: 'Bug description'
            }
        });
        
        expect(newIssue.status()).toBe(201);

        const issues = await request.get(PATH);
        expect(issues.ok()).toBeTruthy();
        expect(await issues.json()).toContainEqual(expect.objectContaining({
            title: '[BUG] - Report',
            body: 'Bug description'
        }));
    });

    test('The user can create an Feature in the github repository', async({ request }) => {
        const newIssue = await request.post(PATH, {
            data: {
                title: '[Feature] - New feature',
                body: 'feature description'
            }
        });
        
        expect(newIssue.status()).toBe(201);

        const issues = await request.get(PATH);
        expect(issues.ok()).toBeTruthy();
        expect(await issues.json()).toContainEqual(expect.objectContaining({
            title: '[Feature] - New feature',
            body: 'feature description'
        }));
    });

    test.afterAll(async ({ request }) => {
        const response = await request.delete(`/repost/${USER}/${REPOSITORY}`);
        expect(response.status()).toBe(201);
    });

});

