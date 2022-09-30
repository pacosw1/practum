import { Area, PrismaClient, Process } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateProcessDto, GetFilteredProcessesDto } from '@/dtos/process.dto';

class ProcessService {
  public processes = new PrismaClient().process;

  public async getAll(): Promise<Process[]> {
    const all: Process[] = await this.processes.findMany();
    return all;
  }

  public async getGivenAreaAndGroup(areaId: number, groupId: number): Promise<Process[]> {
    const filteredProcess: Process[] = await this.processes.findMany({ where: { areaId: areaId, groupId: groupId } });
    return filteredProcess;
  }

  public async getGivenId(id: number): Promise<Process> {
    if (isEmpty(id)) throw new HttpException(400, 'id is empty');

    const findProcess: Process = await this.processes.findUnique({ where: { id: id } });
    if (!findProcess) throw new HttpException(409, "Area doesn't exist");

    return findProcess;
  }

  public async create(data: CreateProcessDto): Promise<Process> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    data.areaId = Number(data.areaId)
    data.groupId = Number(data.groupId)

    const findProcess: Process = await this.processes.findUnique({ where: { name: data.name } });
    if (findProcess) throw new HttpException(409, `Process with title ${data.name} already exists`);

    const createData: Process = await this.processes.create({ data: { ...data } });
    return createData;
  }

  public async update(id: number, data: CreateProcessDto): Promise<Process> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    const findProcess: Process = await this.processes.findUnique({ where: { id: id } });
    if (!findProcess) throw new HttpException(409, "User doesn't exist");

    const newProcess = await this.processes.update({ where: { id: id }, data: { ...data } });
    return newProcess;
  }

  public async delete(id: number): Promise<Process> {
    if (isEmpty(id)) throw new HttpException(400, "User doesn't existId");

    const findProcess: Process = await this.processes.findUnique({ where: { id: id } });
    if (!findProcess) throw new HttpException(409, "User doesn't exist");

    const deleteProcess = await this.processes.delete({ where: { id: id } });
    return deleteProcess;
  }
}

export default ProcessService;
