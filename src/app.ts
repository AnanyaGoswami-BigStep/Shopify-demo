import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, CookieNotFound } from '@shopify/shopify-api';

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: 'b49a4695c63d915257b18ee3cc059d03',
  apiSecretKey: 'bcecd3171ed8b69f3fd07f509fa048c1',
  scopes: ['read_products'],
  hostName: 'bf69-110-235-229-230.ngrok-free.app',
  apiVersion: ApiVersion.Unstable,
  isEmbeddedApp: true,
  /* isCustomStoreApp: true, */
});

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.shopifystuff();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    connect(dbConnection.url);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private shopifystuff() {
    console.log(shopify, 'hii in app');
    this.app.get('/api/auth', async (req, res) => {
      console.log('inside app.get thing', req.query);
      await shopify.auth.begin({
        shop: shopify.utils.sanitizeShop(req.query.shop as string, true),
        callbackPath: '/api/auth/callback',
        isOnline: true,
        rawRequest: req,
        rawResponse: res,
      });
    });
    this.app.get('/api/auth/callback', async (req, res) => {
      try {
        console.log('inside call back', req, res);
        const callback = await shopify.auth.callback({
          rawRequest: req,
          rawResponse: res,
        });
        console.log(callback, 'callback');

        res.redirect('https://xbots.techouts.com/');
      } catch (e) {
        if (e instanceof CookieNotFound) {
          console.log(e, 'error');
          res.redirect('https://xbots.techouts.com/');
        }
      }
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
