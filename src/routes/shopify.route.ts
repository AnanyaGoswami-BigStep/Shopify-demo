import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ShopifyController from '@/controllers/shopify.controller';

class ShopifyRoute implements Routes {
  public path = '/shopify';
  public router = Router();
  public ShopifyController = new ShopifyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.ShopifyController.shopifyauth);
  }
}

export default ShopifyRoute;
