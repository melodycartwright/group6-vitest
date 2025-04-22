import {beforeAll, afterEach, afterEach, afterAll} from 'vitest';
import { server } from './mocks/server';
import 'whatwg-fetch';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
