// Dynamic JSON-LD API route for room pages
export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;

  // TODO: Replace with real data fetching logic
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': `Room: ${slug}`,
    'description': `Description for room ${slug}`,
    // ...add more fields as needed
  };

  event.node.res.setHeader('Content-Type', 'application/ld+json');
  return data;
});
