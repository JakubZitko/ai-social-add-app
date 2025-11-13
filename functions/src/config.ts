import { defineString } from 'firebase-functions/params';

// Define environment parameters
export const openaiApiKey = defineString('OPENAI_API_KEY');
export const elevenLabsApiKey = defineString('ELEVENLABS_API_KEY');
export const syncLabsApiKey = defineString('SYNCLABS_API_KEY');

// API endpoints
export const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
export const SYNCLABS_API_URL = 'https://api.synclabs.so/v1';
export const OPENAI_API_URL = 'https://api.openai.com/v1';

// Configuration constants
export const MAX_SCRIPT_LENGTH = 1500;
export const VIDEO_GENERATION_TIMEOUT = 300000; // 5 minutes
export const AUDIO_GENERATION_TIMEOUT = 60000; // 1 minute
