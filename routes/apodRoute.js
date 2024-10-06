const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


const Joi = require('joi');

const NASA_API_BASE_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = process.env.NASA_API_KEY || "DEMO_KEY";

const today = new Date().toISOString().slice(0, 10);


const apodQuerySchema = Joi.object({
    date: Joi.date().iso().messages({
      'date.format': 'Date must be in YYYY-MM-DD format.',
    }),
    
    start_date: Joi.date().iso().messages({
      'date.format': 'Start date must be in YYYY-MM-DD format.',
    }),
    
    end_date: Joi.date().iso().messages({
      'date.format': 'End date must be in YYYY-MM-DD format.',
    }),
    
    count: Joi.number().integer().min(1).messages({
      'number.base': 'Count must be a number.',
      'number.integer': 'Count must be an integer.',
      'number.min': 'Count must be at least 1.'
    }),
    
    thumbs: Joi.boolean().default(false).messages({
      'boolean.base': 'Thumbs must be a boolean (true or false).'
    }),
    
    api_key: Joi.string().default('DEMO_KEY').messages({
      'string.base': 'API key must be a string.'
    })
  })
  .oxor('date', 'start_date')  
  .with('end_date', 'start_date')  
  .without('count', ['date', 'start_date', 'end_date']);  



const validateApodQuery = (req, res, next) => {
  const { error } = apodQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const getApod = async (req, res) => {
  
    try {
      
      const { date, start_date, end_date, count, thumbs, api_key } = req.query;
  
      
      const params = {
        api_key: api_key || API_KEY,  
        thumbs: thumbs || false,      
      };
  
      
      if (count) {
        params.count = count;
      } else {
        
        if (date) {
          params.date = date;
        }
        if (start_date) {
          params.start_date = start_date;
          
          if (end_date) {
            params.end_date = end_date || today;
          }
        }
      }
  
      
      const response = await axios.get(NASA_API_BASE_URL, { params });
  
      
      res.json(response.data);
    } catch (error) {
      
      
      if (error.response && error.response.data) {
        res.status(error.response.status).json({
          error: error.response.data.msg || 'Error occurred while fetching APOD data',
        });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
  
  


router.get('/apod', validateApodQuery, getApod);

module.exports = router;