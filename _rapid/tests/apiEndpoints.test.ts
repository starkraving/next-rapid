// Mock ESM-only dependencies
jest.mock('lowdb/node', () => ({
  JSONFileSyncPreset: jest.fn(() => ({
    data: { routes: {}, global: {} },
    write: jest.fn(),
  })),
}));
jest.mock('path', () => ({ join: jest.fn(() => '/mock/path/project.json') }));
jest.mock('../data/default.json', () => ({}), { virtual: true });

import handler from '../apiEndpoints';
import { NextApiRequest, NextApiResponse } from 'next';

describe('apiEndpoints handler', () => {
  it('returns 400 for invalid slug', async () => {
    const req = { query: { slug: undefined } } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const resp = { status } as unknown as NextApiResponse;
    await handler(req, resp);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Invalid slug format' });
  });
  it('returns 200 and project for GET /project', async () => {
    const req = {
      query: { slug: ['project'] },
      method: 'GET',
    } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const resp = { status } as unknown as NextApiResponse;
    await handler(req, resp);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ project: { routes: {}, global: {} } });
  });

  it('saves route and returns 200 for POST /project with currentRoute', async () => {
    const write = jest.fn();
    const dbMock = { data: { routes: {}, global: {} }, write };
    const JSONFileSyncPreset = require('lowdb/node').JSONFileSyncPreset;
    JSONFileSyncPreset.mockReturnValueOnce(dbMock);
    const req = {
      query: { slug: ['project'] },
      method: 'POST',
      body: { currentRoute: 'foo', routeProperties: { links: [], forms: [] } },
    } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const resp = { status } as unknown as NextApiResponse;
    await handler(req, resp);
    expect(dbMock.data.routes.foo).toEqual({ links: [], forms: [] });
    expect(write).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true });
  });

  it('saves global and returns 200 for POST /project with no currentRoute', async () => {
    const write = jest.fn();
    const dbMock = { data: { routes: {}, global: {} }, write };
    const JSONFileSyncPreset = require('lowdb/node').JSONFileSyncPreset;
    JSONFileSyncPreset.mockReturnValueOnce(dbMock);
    const req = {
      query: { slug: ['project'] },
      method: 'POST',
      body: { currentRoute: null, routeProperties: { links: [], forms: [] } },
    } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const resp = { status } as unknown as NextApiResponse;
    await handler(req, resp);
    expect(dbMock.data.global).toEqual({ links: [], forms: [] });
    expect(write).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ success: true });
  });

  it('returns 500 if db.write throws', async () => {
    const write = jest.fn().mockRejectedValue(new Error('fail'));
    const dbMock = { data: { routes: {}, global: {} }, write };
    const JSONFileSyncPreset = require('lowdb/node').JSONFileSyncPreset;
    JSONFileSyncPreset.mockReturnValueOnce(dbMock);
    const req = {
      query: { slug: ['project'] },
      method: 'POST',
      body: { currentRoute: null, routeProperties: { links: [], forms: [] } },
    } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const resp = { status } as unknown as NextApiResponse;
    await handler(req, resp);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ success: false, message: expect.any(Error) });
  });

  it('returns 404 for unknown action', async () => {
    const req = {
      query: { slug: ['unknown'] },
      method: 'GET',
    } as unknown as NextApiRequest;
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));
    const resp = { status } as unknown as NextApiResponse;
    await handler(req, resp);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: 'API endpoint not found' });
  });
});
