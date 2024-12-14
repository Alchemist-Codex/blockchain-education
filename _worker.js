export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static assets directly
    if (url.pathname.startsWith('/assets/')) {
      return env.ASSETS.fetch(request);
    }

    // Handle API routes if needed
    if (url.pathname.startsWith('/api/')) {
      // Add your API handling logic here
      return new Response('API endpoint');
    }

    // Serve the SPA for all other routes
    try {
      let response = await env.ASSETS.fetch(request);
      
      // If the page is not found, serve index.html
      if (response.status === 404) {
        response = await env.ASSETS.fetch('/index.html');
      }
      
      return response;
    } catch (error) {
      return new Response('Error loading page', { status: 500 });
    }
  }
}; 