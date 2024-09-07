const config = require('./config');

describe('Config', () => {
    beforeEach(() => {
        // Clear DATABASE_URL environment variable before each test
        delete process.env.DATABASE_URL;
    });

    it('should have a SECRET_KEY', () => {
        expect(config.SECRET_KEY).toBeDefined();
    });

    it('should have a PORT', () => {
        expect(config.PORT).toBeDefined();
    });

    it('should have a BCRYPT_WORK_FACTOR', () => {
        expect(config.BCRYPT_WORK_FACTOR).toBeDefined();
    });

    describe('getDatabaseUri', () => {
        it('should return mm_test for test environment', () => {
            process.env.NODE_ENV = 'test';
            expect(config.getDatabaseUri()).toBe('mm_test');
        });

        it('should return DATABASE_URL for production environment', () => {
            process.env.NODE_ENV = 'production';
            process.env.DATABASE_URL = 'postgresql://username:password@localhost:5432/moneymanager';
            expect(config.getDatabaseUri()).toBe(process.env.DATABASE_URL);
        });

        it('should return default URI for development environment', () => {
            process.env.NODE_ENV = 'development';
            expect(config.getDatabaseUri()).toBe('moneymanager');
        });
    });
});