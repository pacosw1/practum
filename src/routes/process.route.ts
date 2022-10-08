import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import ProcessController from '@/controllers/process.controller';
import { CreateProcessDto } from '@/dtos/process.dto';
import authMiddleware from '@middlewares/auth.middleware';


class ProcessRoute implements Routes {
  public path = '/process';
  public router = Router();
  public controller = new ProcessController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.getAll);
    this.router.get(`${this.path}/:id(\\d+)`, this.controller.getGivenId);
    this.router.get(`${this.path}/filter/:areaId&:groupId`, this.controller.getGivenAreaAndGroup);
    this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateProcessDto, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id(\\d+)`, authMiddleware, validationMiddleware(CreateProcessDto, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.controller.delete);
  }
}

export default ProcessRoute;
