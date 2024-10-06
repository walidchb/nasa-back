const request = require('supertest');
const express = require('express');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const apodRoute = require('../routes/apodRoute'); 

const app = express();
app.use(express.json());
app.use('/', apodRoute);

const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = 'ly3ZsHwJJl2fjlQQNPXXmi2jY2ULT5ny57Xz7igq';
const mock = new MockAdapter(axios);

describe('GET /apod', () => {

  
  afterEach(() => {
    mock.reset();
  });

  it('should return APOD data for a valid date', async () => {
    const mockResponse = { date: '2022-09-30', title: 'APOD Image' };

    mock.onGet(NASA_API_BASE_URL).reply(200, mockResponse);

    const response = await request(app).get('/apod').query({ date: '2022-09-30', api_key: API_KEY });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return a validation error if an invalid date is provided', async () => {
    const response = await request(app).get('/apod').query({ date: 'invalid-date', api_key: API_KEY });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Date must be in YYYY-MM-DD format.');
  });

  it('should return an error if API request fails', async () => {
    mock.onGet(NASA_API_BASE_URL).reply(500, { msg: 'Internal Server Error' });

    const response = await request(app).get('/apod').query({ date: '2022-09-30', api_key: API_KEY });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal Server Error');
  });

  it('should return APOD data when count is provided', async () => {
    const mockResponse = [{ title: 'APOD 1' }, { title: 'APOD 2' }];

    mock.onGet(NASA_API_BASE_URL).reply(200, mockResponse);

    const response = await request(app).get('/apod').query({ count: 2, api_key: API_KEY });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should use the default API key if none is provided', async () => {
    const mockResponse = { title: 'APOD Image' };

    mock.onGet(NASA_API_BASE_URL).reply(200, mockResponse);

    const response = await request(app).get('/apod').query({ date: '2022-09-30' });  
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });
});
