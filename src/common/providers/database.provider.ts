import { Client } from 'pg';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => {
            const client = new Client({
                host: 'localhost',
                port: 5432,
                user: 'postgres',
                password: '594594',
                database: 'alp_db',
            });
            await client.connect();
            return client;
        }

    }];