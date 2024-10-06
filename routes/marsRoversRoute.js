const express = require('express');
const axios = require('axios');
const Joi = require('joi');  
const router = express.Router();
require('dotenv').config();



const NASA_API_BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";


const allowedCameras = [
  'fhaz', 'rhaz', 'mast', 'chemcam', 'mahli', 'mardi', 'navcam', 'pancam', 'minites'
];



const marsRoverQuerySchema = Joi.object({
  sol: Joi.number().integer().min(0).required().messages({
    'any.required': 'Sol is required.',
    'number.base': 'Sol must be a number.',
    'number.integer': 'Sol must be an integer.',
    'number.min': 'Sol must be greater than or equal to 0.'
  }),
  earth_date: Joi.date().iso().optional().messages({
    'date.format': 'Earth date must be in YYYY-MM-DD format.',
  }),
  camera: Joi.alternatives().try(
    Joi.string().valid(...allowedCameras),
    Joi.array().items(Joi.string().valid(...allowedCameras))
  ).optional().messages({
    'string.base': 'Camera must be a string.',
    'any.only': `Camera must be one of the following values: ${allowedCameras.join(', ')}.`,
    'array.includes': `Camera array must only contain the following values: ${allowedCameras.join(', ')}.`
  }),
  page: Joi.number().integer().min(1).optional().default(1).messages({
    'number.base': 'Page must be a number.',
    'number.integer': 'Page must be an integer.',
    'number.min': 'Page must be greater than or equal to 1.'
  }),
  api_key: Joi.string().default(API_KEY).messages({
    'string.base': 'API key must be a string.'
  })
})



const validateMarsRoverQuery = (req, res, next) => {
  const { error } = marsRoverQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};


const getMarsRoverPhotos = async (roverName, req, res) => {

  try {
    const { sol, earth_date, camera, page, api_key } = req.query;

    
    
    const cameraParam = Array.isArray(camera) ? camera : [camera];

    
    const params = {
      sol:sol||"",
      earth_date:earth_date||"",
      page:page||"",
      api_key: api_key || API_KEY,
    };

    const queryParams = new URLSearchParams(params);

    
    cameraParam.forEach(cam => queryParams.append('camera', cam));

    
    
    const response = await axios.get(`${NASA_API_BASE_URL}/${roverName}/photos?${queryParams.toString()}`);
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch photos from the NASA Mars Rover API.',
      details: error.message,
    });
  }
};




router.get('/curiosity/photos', validateMarsRoverQuery, (req, res) => {
  getMarsRoverPhotos('curiosity', req, res);
});


router.get('/opportunity/photos', validateMarsRoverQuery, (req, res) => {
  getMarsRoverPhotos('opportunity', req, res);
});


router.get('/spirit/photos', validateMarsRoverQuery, (req, res) => {
  getMarsRoverPhotos('spirit', req, res);
});

module.exports = router;

