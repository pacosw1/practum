import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateGroupDto } from '@/dtos/groups.dto';
import GroupsController from '@/controllers/groups.controller';

class GroupsRoute implements Routes {
  public path = '/groups';
  public router = Router();
  public controller = new GroupsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.getAll);
    this.router.get(`${this.path}/:id(\\d+)`, this.controller.getGivenId);
    this.router.post(`${this.path}`, validationMiddleware(CreateGroupDto, 'body'), this.controller.create);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateGroupDto, 'body', true), this.controller.update);
    this.router.delete(`${this.path}/:id(\\d+)`, this.controller.delete);
  }
}

export default GroupsRoute;
