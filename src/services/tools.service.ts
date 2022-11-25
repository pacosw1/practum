import { PrismaClient, Tool } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateEntryExitDto } from '@/dtos/process.dto';

class ToolsService {
  public exits = new PrismaClient().tool;

  public async getAll(): Promise<Tool[]> {
    const all: Tool[] = await this.exits.findMany({
      orderBy: {
        id: 'asc',
      },
      where: { active: true },
    });
    return all;
  }

  public async create(data: CreateEntryExitDto): Promise<Tool> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');

    const findEntry: Tool = await this.exits.findUnique({ where: { name: data.name } });
    if (findEntry) throw new HttpException(409, `Tool with title ${data.name} already exists`);

    const createEntry: Tool = await this.exits.create({ data: { ...data } });
    return createEntry;
  }

  public async update(id: number, data: CreateEntryExitDto): Promise<Tool> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');

    const findEntry: Tool = await this.exits.findUnique({ where: { id: id } });
    if (!findEntry || (findEntry && !findEntry.active)) throw new HttpException(409, "Tool doesn't exist");

    const newEntry = await this.exits.update({ where: { id: id }, data: { ...data } });
    return newEntry;
  }

  public async delete(id: number): Promise<Tool> {
    if (isEmpty(id)) throw new HttpException(400, "Tool doesn't exist");

    const findEntry: Tool = await this.exits.findUnique({ where: { id: id } });
    if (!findEntry) throw new HttpException(409, "Tool doesn't exist");

    await new PrismaClient().toolsOnProcess.deleteMany({ where: { toolId: id } });

    const deleteEntry = await this.exits.update({
      where: { id: id },
      data: {
        ...findEntry,
        active: false,
      },
    });
    return deleteEntry;
  }
}

export default ToolsService;
