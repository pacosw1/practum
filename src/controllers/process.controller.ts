import { NextFunction, Request, Response } from 'express';
import ProcessService from '@/services/process.service';
import { Entry, Process, EntriesOnProcess } from '@prisma/client';
import { CreateProcessDto } from '@/dtos/process.dto';

class ProcessController {
  public service = new ProcessService();

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const areas: Process[] = await this.service.getAll();

      res.status(200).json({ data: areas, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getGivenAreaAndGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { groupId, areaId } = req.params;
      const processes: Process[] = await this.service.getGivenAreaAndGroup(Number(areaId), Number(groupId));

      res.status(200).json({ data: processes, message: 'findFiltered' });
    } catch (error) {
      next(error);
    }
  };

  public getGivenId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const findArea = await this.service.getGivenId(id);

      res.status(200).json({ data: findArea, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateProcessDto = req.body;
      const createAreaData: Process = await this.service.create(data);

      res.status(201).json({ data: createAreaData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: CreateProcessDto = req.body;
      const updateUserData: Process = await this.service.update(id, data);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleteUserData: Process = await this.service.delete(id);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default ProcessController;
