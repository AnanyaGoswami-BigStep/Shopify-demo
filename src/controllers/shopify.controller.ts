import { NextFunction, Request, Response } from 'express';
import ShopifyService from '@/services/shopify.service';

class ShopifyController {
  public ShopifyService = new ShopifyService();

  public shopifyauth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('inside fucked up');
      const shopify = await this.ShopifyService.shopifyauth();

      res.status(200).json({ data: shopify, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default ShopifyController;
