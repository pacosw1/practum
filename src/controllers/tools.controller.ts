import { NextFunction, Request, Response } from 'express';
import { Tool } from '@prisma/client';
import { CreateEntryExitDto } from '@/dtos/process.dto';
import ToolsService from '@/services/tools.service';

class ToolsController {
  public service = new ToolsService();

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groups: Tool[] = await this.service.getAll();

      res.status(200).json({ data: groups, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  // public getGivenId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   try {
  //     const id = Number(req.params.id);
  //     const findArea: Tool = await this.service.getGivenId(id);

  //     res.status(200).json({ data: findArea, message: 'findOne' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateEntryExitDto = req.body;
      const createData: Tool = await this.service.create(data);

      res.status(201).json({ data: createData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: CreateEntryExitDto = req.body;
      const groupData: Tool = await this.service.update(id, data);

      res.status(200).json({ data: groupData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleteData: Tool = await this.service.delete(id);

      res.status(200).json({ data: deleteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ToolsController;
