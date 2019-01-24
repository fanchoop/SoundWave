const mongoDbConnection = require('../Connection');

test('mongodb connection', () => {
    expect(mongoDbConnection).not.toThrow();
});
