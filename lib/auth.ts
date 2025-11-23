import { NextRequest } from 'next/server';

const SECRET_API_KEY = "DEV_SECRET_KEY_123";

/**
 * Checks if the request is authenticated by verifying the 'x-api-key' header.
 * The hardcoded key is 'DEV_SECRET_KEY_123'.
 * @param request The incoming NextRequest object.
 * @returns True if the API key is valid, false otherwise.
 */
export function isAuthenticated(request: NextRequest): boolean {
    const apiKey = request.headers.get('x-api-key');

    return apiKey === SECRET_API_KEY;
}