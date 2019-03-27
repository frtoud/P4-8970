const frisby = require('frisby');
const BASE_PATH_FORMS = 'http://formulaires.info.polymtl.ca/forms';

it('should be a teapot', function () {
    return frisby.get(BASE_PATH_FORMS + )
        .expect('status', 418);
});
