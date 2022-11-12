import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import AreasController from '@/controllers/areas.controller';
import { CreateAreaDto } from '@/dtos/areas.dto';
import authMiddleware from '@/middlewares/auth.middleware';

class AreasRoute implements Routes {
  public path = '/areas';
  public router = Router();
  public controller = new AreasController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.getAreas);
    this.router.get(`${this.path}/:id(\\d+)`, this.controller.getAreaGivenId);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateAreaDto, 'body'), this.controller.createArea);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateAreaDto, 'body', true), this.controller.updateArea);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.controller.deleteArea);
  }
}

export default AreasRoute;
