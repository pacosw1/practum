import { Group, PrismaClient } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateGroupDto } from '@/dtos/groups.dto';

class GroupService {
  public groups = new PrismaClient().group;

  public async getAll(): Promise<Group[]> {
    const allGroups: Group[] = await this.groups.findMany({
      where: { active: true },
      orderBy: {
        order: 'asc',
      },
    });
    return allGroups;
  }

  public async getGivenId(id: number): Promise<Group> {
    if (isEmpty(id)) throw new HttpException(400, 'id is empty');

    const findGroup: Group = await this.groups.findUnique({ where: { id: id } });
    if (!findGroup || (findGroup && !findGroup.active)) throw new HttpException(409, "Group doesn't exist");

    return findGroup;
  }

  public async create(data: CreateGroupDto): Promise<Group> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');

    const findGroup: Group = await this.groups.findUnique({ where: { name: data.name } });
    if (findGroup) throw new HttpException(409, `Group with title ${data.name} already exists`);

    const count = await this.groups.count({ where: { active: true } });

    const createdata: Group = await this.groups.create({ data: { ...data, order: count + 1 } });
    return createdata;
  }

  public async update(id: number, data: CreateGroupDto): Promise<Group> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');

    const findGroup: Group = await this.groups.findUnique({ where: { id: id } });
    if (!findGroup || (findGroup && !findGroup.active)) throw new HttpException(409, "Group doesn't exist");

    const newGroup = await this.groups.update({ where: { id: id }, data: { ...data } });
    return newGroup;
  }

  public async delete(id: number): Promise<Group> {
    if (isEmpty(id)) throw new HttpException(400, "Group doesn't existId");

    const findGroup: Group = await this.groups.findUnique({ where: { id: id } });
    if (!findGroup) throw new HttpException(409, "Group doesn't exist");

    const deleteGroup = await this.groups.update({
      where: { id: id },
      data: {
        ...findGroup,
        active: false,
      },
    });
    return deleteGroup;
  }
}

export default GroupService;
