import {beforeAll, afterEach,  afterAll} from 'vitest';
import { server } from "./test/mocks/server";
import 'whatwg-fetch';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
