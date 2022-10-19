import { Area, PrismaClient, Process, Entry, EntriesOnProcess } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateEntryExitDto, CreateProcessDto, GetFilteredProcessesDto } from '@/dtos/process.dto';

class EntryService {
  public entries = new PrismaClient().entry;

  public async getAll(): Promise<Entry[]> {
    const all: Entry[] = await this.entries.findMany();
    return all;
  }

  public async create(data: CreateEntryExitDto): Promise<Entry> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    const findEntry: Entry = await this.entries.findUnique({ where: { name: data.name } });
    if (findEntry) throw new HttpException(409, `Process with title ${data.name} already exists`);

    const createEntry: Entry = await this.entries.create({ data: { ...data } });
    return createEntry;
  }



  public async update(id: number, data: CreateEntryExitDto): Promise<Entry> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    const findEntry: Entry = await this.entries.findUnique({ where: { id: id } });
    if (!findEntry) throw new HttpException(409, "Entry doesn't exist");

    const newEntry = await this.entries.update({ where: { id: id }, data: { ...data } });
    return newEntry;
  }

  public async delete(id: number): Promise<Entry> {
    if (isEmpty(id)) throw new HttpException(400, "User doesn't existId");

    const findEntry: Entry = await this.entries.findUnique({ where: { id: id } });
    if (!findEntry) throw new HttpException(409, "User doesn't exist");

    const deleteEntry = await this.entries.delete({ where: { id: id } });
    return deleteEntry;
  }

}

export default EntryService;
