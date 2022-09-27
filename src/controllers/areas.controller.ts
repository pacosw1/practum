import { NextFunction, Request, Response } from 'express';
import { Area } from '@prisma/client';
import AreaService from '@/services/area.service';
import { CreateAreaDto } from '@/dtos/areas.dto';

class AreasController {
  public service = new AreaService();

  public getAreas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const areas: Area[] = await this.service.getAllAreas();

      res.status(200).json({ data: areas, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getAreaGivenId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const findArea: Area = await this.service.getAreaGivenId(id);

      res.status(200).json({ data: findArea, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createArea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateAreaDto = req.body;
      const createAreaData: Area = await this.service.createArea(data);

      res.status(201).json({ data: createAreaData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateArea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: CreateAreaDto = req.body;
      const updateUserData: Area = await this.service.updateArea(id, data);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteArea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleteUserData: Area = await this.service.deleteArea(id);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default AreasController;
