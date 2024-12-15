export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: `${window.location.origin}/callback`,
    audience: `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2`,
    scope: 'openid profile email',
    response_type: 'code',
    prompt: 'login'
  }
};