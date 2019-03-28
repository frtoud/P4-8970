const mongoose = require('mongoose');
const FormsFactory = require('../factories/FormsFactory');
const FormsManager = require('../../managers/formsManager');
const Forms = mongoose.model('Forms');
// const Users = mongoose.model('Users');
process.env.TEST_SUITE = 'spacetime-forms-test';
// describe('Forms', () => {
        // describe('CREATE', () => {
        //     let formsFactory = new FormsFactory();
        //     beforeEach(async () => {
        //         formFactory.makeForms(50);
        //     });
        //     afterEach(() => {
        //         formsFactory.clearForms(50);
        //     });
        // test('can create a form', async () => {
        //     await new Forms({
        //         name: 'Sol',
        //         type: 'white_star',
        //         loc: [10, 10],
        //     }).save();
        //     const form = await Forms.findOne({ name: 'Sol' });
        //     expect(form.name).toEqual('Sol');
        // });
        // test('can create random forms', async () => {
        //     const fetchedForms = await Forms.find({});
        //     expect(fetchedForms.length).toEqual(50);
        // });
    // });
    describe('READ forms', () => {
        beforeEach(async () => {
            let formsFactory;
            formsFactory = await formFactory.makeForms(50);
        });
        afterEach(() => {
            let formsFactory = new FormsFactory();
            formsFactory.clearForms(50);
        });
        test('test 1', async () => {
            const formsManager = new FormsManager();
            const allForms = await formsManager.getAllForms();
            expect(allForms.map(form => form.id)).toContain(form.id);
        });
        // test('target form can find nearest forms within specified range', async () => {
        //     const noForms = await forms[0].findWithinRange(0);
        //     const someForms = await forms[0].findWithinRange(50);
        //     expect(forms.length).toEqual(50);
        //     expect(noForms.length).toEqual(0);
        //     expect(someForms.length).toBeGreaterThan(0);
        //     expect(someForms.length).toBeLessThan(50);
        // });
    });
    // describe('DELETE', () => {
    //     let forms;
    //     beforeEach(async () => {
    //         const newForms = await factory.makeForms(2);
    //         await Promise.all(newForms.map(form => form.addCelestials(5)));
    //         forms = await Forms.find({});
    //     });
    //     test('should delete form and associated celestials', async () => {
    //         await forms[0].remove();
    //         const remainingForms = await Forms.find({});
    //         const remainingCelestials = await Celestial.find({});
    //         expect(remainingForms.length).toEqual(1);
    //         expect(remainingCelestials.length).toEqual(5);
    //     });
    // });
