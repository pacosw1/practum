import { hash } from 'bcrypt';
import { Area, PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateAreaDto } from '@/dtos/areas.dto';

class AreaService {
  public areas = new PrismaClient().area;

  public async getAllAreas(): Promise<Area[]> {
    const allAreas: Area[] = await this.areas.findMany();
    return allAreas;
  }

  public async getAreaGivenId(id: number): Promise<Area> {
    if (isEmpty(id)) throw new HttpException(400, 'id is empty');

    const findArea: Area = await this.areas.findUnique({ where: { id: id } });
    if (!findArea) throw new HttpException(409, "Area doesn't exist");

    return findArea;
  }

  public async createArea(areaData: CreateAreaDto): Promise<Area> {
    if (isEmpty(areaData)) throw new HttpException(400, 'userData is empty');

    const findArea: Area = await this.areas.findUnique({ where: { name: areaData.name } });
    if (findArea) throw new HttpException(409, `Area with title ${areaData.name} already exists`);

    const createAreaData: Area = await this.areas.create({ data: { ...areaData } });
    return createAreaData;
  }

  public async updateArea(id: number, data: CreateAreaDto): Promise<Area> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    const findArea: Area = await this.areas.findUnique({ where: { id: id } });
    if (!findArea) throw new HttpException(409, "User doesn't exist");

    const newArea = await this.areas.update({ where: { id: id }, data: { ...data } });
    return newArea;
  }

  public async deleteArea(id: number): Promise<Area> {
    if (isEmpty(id)) throw new HttpException(400, "User doesn't existId");

    const findArea: Area = await this.areas.findUnique({ where: { id: id } });
    if (!findArea) throw new HttpException(409, "User doesn't exist");

    const deleteAreaData = await this.areas.delete({ where: { id: id } });
    return deleteAreaData;
  }
}

export default AreaService;
