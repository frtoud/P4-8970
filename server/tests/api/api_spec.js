const frisby = require('frisby');
const BASE_PATH_FORMS = 'http://formulaires.info.polymtl.ca/forms';

it('should be return status 200', function () {
    return frisby.get(BASE_PATH_FORMS)
        .expect('status', 200);
});
