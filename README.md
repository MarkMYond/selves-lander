# Frontend

This is the frontend application.

## Development Server

```bash
# Start the development server on localhost:3000
npm run dev
```

## Build

```bash
# Build the application for production
npm run build
```

## Wiki Navigation

The wiki navigation is generated from Payload CMS content and stored as a static JSON file for better performance.

### Generate Wiki Navigation

```bash
# Generate the wiki navigation JSON file
npm run generate:wiki-nav
```

This will fetch all categories and wiki pages from Payload CMS and generate a JSON file in the public directory.

The navigation is also automatically regenerated whenever:

1. A wiki page is created or updated
2. A wiki page is deleted

This ensures the navigation is always up-to-date without needing to dynamically generate it on each request, resulting in faster page loads.

<!-- Trigger deploy -->
<!-- Trigger deploy again -->
<!-- Force refresh deploy -->
<!-- Trigger build with latest colleague changes -->
