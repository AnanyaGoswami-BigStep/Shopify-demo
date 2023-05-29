import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion } from '@shopify/shopify-api';
import express from 'express';

class ShopifyService {
  public async shopifyauth() {
    console.log('service');
    const app = express();

    const shopify = shopifyApi({
      // The next 4 values are typically read from environment variables for added security
      apiKey: '72b6d974062d288e9dde9a51d1e17217',
      apiSecretKey: '1384fc0954a66b98006fd7eca0e72799',
      scopes: ['read_products'],
      hostName: 'https://bf69-110-235-229-230.ngrok-free.app',
      apiVersion: ApiVersion.Unstable,
      isEmbeddedApp: true,
    });

    console.log(shopify);

    app.get('/auth', async (req, res) => {
      // The library will automatically redirect the user
      await shopify.auth.begin({
        shop: shopify.utils.sanitizeShop(req.query.shop as string, true),
        callbackPath: '/auth/callback',
        isOnline: false,
        rawRequest: req,
        rawResponse: res,
      });
    });
    /* 
    Shopify.Context.initialize({
      API_KEY: '72b6d974062d288e9dde9a51d1e17217',
      API_SECRET_KEY: '1384fc0954a66b98006fd7eca0e72799',
      SCOPES: [
        'read_analytics',
        'write_assigned_fulfillment_orders',
        'read_assigned_fulfillment_orders',
        'read_customer_events',
        'write_custom_pixels',
        'read_custom_pixels',
        'write_customers',
        'read_customers',
      ],
      API_VERSION: ApiVersion.Unstable,
      IS_EMBEDDED_APP: true,
      SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
    }); */

    /* app.get('/install', async (req, res) => {
      const { shop } = req.query;

      if (shop) {
        const state = Shopify.Utils.generateNonce();
        const installUrl = await Shopify.Auth.beginAuth(req, res, shop, '/auth/callback', state);
        res.redirect(installUrl);
      } else {
        res.send('Missing "shop" query parameter.');
      }
    }); */

    /* app.get('/auth/callback', async (req, res) => {
      const { shop, hmac, code, state } = req.query;

      // Verify the request
      const isValidRequest = await Shopify.Auth.validateAuthCallback(req, res, shop, hmac, code, state);

      if (isValidRequest) {
        const accessToken = await Shopify.Auth.accessToken(req, res);

        // Store the accessToken for future API requests
        console.log('Access Token:', accessToken);

        res.send('Authentication successful! You can now make API requests.');
      } else {
        res.send('Authentication failed. Please try again.');
      }
    }); */
  }
}

export default ShopifyService;
