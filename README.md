# Translation NestJS API

Translation API is a RESTful API built with NestJS that provides access to word translations.

## Table of Contents

- [Getting Started](#getting-started)

- [Prerequisites](#prerequisites)

- [Installation](#installation)

- [Configuration](#configuration)

- [Usage](#usage)

- [Endpoints](#endpoints)

- [Error Handling](#error-handling)

- [Documentation](#documentation)

## Getting Started

### Prerequisites

Before you start using the API, make sure you have the following prerequisites installed:

- Node.js (version >= 16.14.0)

- npm (Node Package Manager) or yarn

### Installation

1. Clone the repository:

```bash

git clone https://github.com/your/repo.git

```

**Install dependencies:**

    cd your-api-directory

    npm install

**Configuration**

Copy the _.env.example_ file to .env and configure the environment variables needed for your NestJS API. Make sure to set values for:

- DATABASE_URL: URL to your database.
- (Add any other configuration variables specific to your API)

# Usage

# **Endpoints**

Your NestJS API provides the following endpoints:

- **POST** /translation/api/v1/create: Create a new translation.

- **GET** /translation/api/v1/translate/:word: Find a translation by word and language.

- **PATCH** /translation/api/v1/update/:id: Update an existing translation.

- **DELETE** /translation/api/v1/delete/:id: Delete a translation.

## POST /translation/api/v1/create

This endpoint allows you to create a new translation.

# Example Request:

    POST /translation/api/v1/create

    Content-Type: application/json


    {

    "word": "example_word",

    "language_code": "en",

    "translation": "example_translation"

    }

## GET /translation/api/v1/translate/:word

This endpoint allows you to find a translation by word and language.

Example Request:

    GET /translation/api/v1/translate/example_word?lang=en

## PATCH /translation/api/v1/update/:id

This endpoint allows you to update an existing translation.

# Example Request:

    PATCH /translation/api/v1/update/123

    Content-Type: application/json


    {

    "word": "updated_word",

    "language_code": "en",

    "translation": "updated_translation"

    }

## DELETE /translation/api/v1/delete/:id

This endpoint allows you to delete a translation by ID.

Example Request:

    DELETE /translation/api/v1/delete/123

# Error Handling

The API may return error responses with relevant HTTP status codes and error messages. For details on error responses, refer to the Error Handling section.

# **Documentation**

The API documentation is available via Swagger at:

    http://your-api-url/docs

You can explore the available endpoints, see example requests and responses, and test the API interactively using Swagger.

Happy Coding👩‍💻
