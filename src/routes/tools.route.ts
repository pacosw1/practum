import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateEntryExitDto } from '@/dtos/process.dto';
import ToolsController from '@/controllers/tools.controller';

class ToolsRoute implements Routes {
  public path = '/tools';
  public router = Router();
  public controller = new ToolsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.getAll);
    // this.router.get(`${this.path}/:id(\\d+)`, this.controller.getGivenId);
    this.router.post(`${this.path}`, validationMiddleware(CreateEntryExitDto, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateEntryExitDto, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id(\\d+)`, this.controller.delete);
  }
}

export default ToolsRoute;
