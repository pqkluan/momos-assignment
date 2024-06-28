# Momos Assignment - Server

This is the server for the Momos assignment. It is a simple REST API server that provides the following endpoints:

- `/` - The only working endpoint, wrapper for Notion database query, accept query parameters for filtering and sorting.
- All other endpoints will return a 404 error.

The reason we need a server is that Notion API does not support CORS, so we need to make the request from the server.

## Installation

Install the dependencies:

```bash
npm install
```

## Usage

Start the server:

```bash
npm start
```
