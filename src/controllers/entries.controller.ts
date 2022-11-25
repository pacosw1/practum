import { NextFunction, Request, Response } from 'express';
import { Entry } from '@prisma/client';
import GroupService from '@/services/groups.service';
import { CreateGroupDto } from '@/dtos/groups.dto';
import EntryService from '@/services/entry.service';
import { CreateEntryExitDto } from '@/dtos/process.dto';

class EntriesController {
  public service = new EntryService();

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const groups: Entry[] = await this.service.getAll();

      res.status(200).json({ data: groups, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  //   public getGivenId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const id = Number(req.params.id);
  //       const findArea: Entry = await this.service(id);

  //       res.status(200).json({ data: findArea, message: 'findOne' });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateEntryExitDto = req.body;
      const createData: Entry = await this.service.create(data);

      res.status(201).json({ data: createData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data: CreateEntryExitDto = req.body;
      const groupData: Entry = await this.service.update(id, data);

      res.status(200).json({ data: groupData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleteData: Entry = await this.service.delete(id);

      res.status(200).json({ data: deleteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default EntriesController;
