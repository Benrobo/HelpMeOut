const ENV = require("../config/env");

const swagger = `
openapi: 3.0.0
info:
  title: HelpMeOut API
  description: API for streaming and managing video data.
  version: 1.0.0
servers:
  - url: ${ENV.apiUrl}/api
paths:
  /video/stream:
    post:
      summary: Upload video data for streaming
      tags: 
        - Streaming chunks from client
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                blob:
                  type: string
                  format: binary
                  description: The video data blob.
                videoId:
                  type: string
                  description: The video identifier.
      responses:
        '200':
          description: Video data uploaded successfully.

  /stream/end/{videoId}:
    get:
      summary: End video stream
      tags:
        - End recorded stream chunk
      parameters:
        - name: videoId
          in: path
          required: true
          schema:
            type: string
          description: The video identifier.
      responses:
        '200':
          description: Video stream ended successfully.

  /video/get/{id}:
    get:
      summary: Get video data by ID
      tags:
        - Get video data by id
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: The video identifier.
      responses:
        '200':
          description: Video data retrieved successfully.
  /videos:
    get:
      tags:
        - Get all videos
      summary: Get all videos
      responses:
        '200':
          description: List of videos retrieved successfully.

`;
module.exports = swagger;
