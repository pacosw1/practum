import { Area, PrismaClient, Output } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateEntryExitDto, CreateProcessDto, GetFilteredProcessesDto } from '@/dtos/process.dto';

class OutputService {
  public exits = new PrismaClient().output;

  public async getAll(): Promise<Output[]> {
    const all: Output[] = await this.exits.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return all;
  }

  public async create(data: CreateEntryExitDto): Promise<Output> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');

    const findEntry: Output = await this.exits.findUnique({ where: { name: data.name } });
    if (findEntry) throw new HttpException(409, `Output with title ${data.name} already exists`);

    const createEntry: Output = await this.exits.create({ data: { ...data } });
    return createEntry;
  }

  public async update(id: number, data: CreateEntryExitDto): Promise<Output> {
    if (isEmpty(data)) throw new HttpException(400, 'data is empty');

    const findEntry: Output = await this.exits.findUnique({ where: { id: id } });
    if (!findEntry) throw new HttpException(409, "Output doesn't exist");

    const newEntry = await this.exits.update({ where: { id: id }, data: { ...data } });
    return newEntry;
  }

  public async delete(id: number): Promise<Output> {
    if (isEmpty(id)) throw new HttpException(400, "Output doesn't exist");

    const findEntry: Output = await this.exits.findUnique({ where: { id: id } });
    if (!findEntry) throw new HttpException(409, "Output doesn't exist");

    const deleteEntry = await this.exits.delete({ where: { id: id } });
    return deleteEntry;
  }
}

export default OutputService;
