const request = require('supertest');
const express = require('express');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const marsRoverRoute = require('../routes/marsRoversRoute'); // Adjust the path to your route file

const app = express();
app.use(express.json());
app.use('/', marsRoverRoute);

// Initialize Axios Mock Adapter
const mock = new MockAdapter(axios);
const NASA_API_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const API_KEY = 'ly3ZsHwJJl2fjlQQNPXXmi2jY2ULT5ny57Xz7igq';

describe('Mars Rover Photos API', () => {

  // Reset the mock adapter after each test
  afterEach(() => {
    mock.reset();
  });

  it('should return photos for a valid sol request', async () => {
    const mockResponse = { photos: [{ id: 1, img_src: 'https://example.com/photo1.jpg' }] };

    // Mock Axios request for the valid sol
    const queryParams = `sol=1000&page=1&api_key=${API_KEY}`;
    mock.onGet(`${NASA_API_BASE_URL}/curiosity/photos?${queryParams}`).reply(200, mockResponse);

    const response = await request(app).get('/curiosity/photos').query({ sol: 1000, page: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return a validation error if sol is missing', async () => {
    const response = await request(app).get('/curiosity/photos').query({ camera: 'mast' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Sol is required.');
  });

  it('should return a validation error for an invalid camera', async () => {
    const response = await request(app).get('/curiosity/photos').query({ sol: 1000, camera: 'invalid' });
  
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('"camera" must be one of [fhaz, rhaz, mast, chemcam, mahli, mardi, navcam, pancam, minites, array]');
  });
  

  it('should return a validation error if sol is negative', async () => {
    const response = await request(app).get('/curiosity/photos').query({ sol: -5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Sol must be greater than or equal to 0.');
  });

  it('should return an error if the API request fails', async () => {
    const queryParams = `sol=1000&page=1&api_key=${API_KEY}`;
    mock.onGet(`${NASA_API_BASE_URL}/curiosity/photos?${queryParams}`).reply(500);

    const response = await request(app).get('/curiosity/photos').query({ sol: 1000 });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch photos from the NASA Mars Rover API.');
  });

});
