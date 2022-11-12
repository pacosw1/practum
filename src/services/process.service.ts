import { Area, EntriesOnProcess, OutputsOnProcess, PrismaClient, Process } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateProcessDto, GetFilteredProcessesDto } from '@/dtos/process.dto';

class ProcessService {
  public processes = new PrismaClient().process;

  public async getAll(): Promise<Process[]> {
    const all: Process[] = await this.processes.findMany({
      orderBy: {
        id: 'asc',
      },
    });
    return all;
  }

  public async getGivenAreaAndGroup(areaId: number, groupId: number): Promise<Process[]> {
    const filteredProcess: Process[] = await this.processes.findMany({ where: { areaId: areaId, groupId: groupId } });
    return filteredProcess;
  }

  public async getGivenId(id: number): Promise<
    Process & {
      entries: EntriesOnProcess[];
      outputs: OutputsOnProcess[];
    }
  > {
    if (isEmpty(id)) throw new HttpException(400, 'id is empty');

    const findProcess = await this.processes.findUnique({
      where: { id: id },
      include: {
        entries: {
          orderBy: {
            id: 'asc',
          },
          include: {
            entry: true,
          },
        },
        outputs: {
          orderBy: {
            id: 'asc',
          },
          include: {
            output: true,
          },
        },
        tools: {
          orderBy: {
            id: 'asc',
          },
          include: {
            tool: true,
          },
        },
      },
    });

    if (!findProcess) throw new HttpException(409, "Area doesn't exist");

    return findProcess;
  }

  public async create(data: CreateProcessDto): Promise<Process> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    data.areaId = Number(data.areaId);
    data.groupId = Number(data.groupId);

    const findProcess: Process = await this.processes.findUnique({ where: { name: data.name } });
    if (findProcess) throw new HttpException(409, `Process with title ${data.name} already exists`);

    const connectEntries = Array.from(
      data.existingEntries.map(id => {
        return {
          entry: {
            connect: {
              id: id,
            },
          },
        };
      }),
    );

    const newEntries = Array.from(
      data.newEntries.map(newEntry => {
        return {
          entry: {
            create: {
              ...newEntry,
            },
          },
        };
      }),
    );

    const connectOutputs = Array.from(
      data.existingOutputs.map(id => {
        return {
          output: {
            connect: {
              id: id,
            },
          },
        };
      }),
    );

    const newOutputs = Array.from(
      data.newOutputs.map(newOutput => {
        return {
          output: {
            create: {
              ...newOutput,
            },
          },
        };
      }),
    );

    const connectTools = Array.from(
      data.existingTools.map(id => {
        return {
          tool: {
            connect: {
              id: id,
            },
          },
        };
      }),
    );

    const newTools = Array.from(
      data.newTools.map(newTool => {
        return {
          tool: {
            create: {
              ...newTool,
            },
          },
        };
      }),
    );

    const finalData = {
      name: data.name,
      areaId: data.areaId,
      groupId: data.groupId,
      entries: {
        create: [...newEntries, ...connectEntries],
      },
      outputs: {
        create: [...newOutputs, ...connectOutputs],
      },
      tools: {
        create: [...newTools, ...connectTools],
      },
    };

    // @ts-ignore
    const createData: Process = await this.processes.create({ data: { ...finalData } });
    return createData;
  }

  public async update(id: number, data: CreateProcessDto): Promise<Process> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    const findProcess: Process = await this.processes.findUnique({
      where: { id: id },
      include: {
        entries: {
          include: {
            entry: true,
          },
        },
        outputs: {
          include: {
            output: true,
          },
        },
      },
    });

    if (!findProcess) throw new HttpException(409, "User doesn't exist");

    let oldEntries = await new PrismaClient().entriesOnProcess.findMany({
      where: { processId: id },
    });

    let oldOutputs = await new PrismaClient().outputsOnProcess.findMany({
      where: { processId: id },
    });

    let oldTools = await new PrismaClient().toolsOnProcess.findMany({
      where: { processId: id },
    });

    //TODO make a function for this

    let old = new Set();
    let updated = new Set();
    let disconnectEntries = [];
    let connectEntries = [];

    for (let entry of data.existingEntries) {
      updated.add(entry);
    }

    for (let entry of oldEntries) {
      old.add(entry.entryId);

      if (!updated.has(entry.entryId)) {
        disconnectEntries.push(entry.entryId);
      }
    }

    for (let entry of data.existingEntries) {
      if (!old.has(entry)) {
        connectEntries.push({ entry: { connect: { id: entry } } });
      }
    }

    let oldOut = new Set();
    let updatedOut = new Set();
    let disconnectOutputs = [];
    let connectOutputs = [];

    for (let output of data.existingOutputs) {
      updated.add(output);
    }

    for (let output of oldOutputs) {
      old.add(output.outputId);

      if (!updatedOut.has(output.outputId)) {
        disconnectOutputs.push(output.outputId);
      }
    }

    for (let output of data.existingOutputs) {
      if (!oldOut.has(output)) {
        connectOutputs.push({ output: { connect: { id: output } } });
      }
    }

    let oldToolSet = new Set();
    let updatedTools = new Set();
    let disconnectTools = [];
    let connectTools = [];

    for (let tool of data.existingTools) {
      updatedTools.add(tool);
    }

    for (let tool of oldTools) {
      oldToolSet.add(tool.toolId);

      if (!updatedTools.has(tool.toolId)) {
        disconnectTools.push(tool.toolId);
      }
    }

    for (let tool of data.existingTools) {
      if (!oldToolSet.has(tool)) {
        connectTools.push({ tool: { connect: { id: tool } } });
      }
    }

    let newTools = Array.from(
      data.newTools.map(newTool => {
        return {
          tool: {
            create: {
              ...newTool,
            },
          },
        };
      }),
    );

    let newEntries = Array.from(
      data.newEntries.map(newEntry => {
        return {
          entry: {
            create: {
              ...newEntry,
            },
          },
        };
      }),
    );

    let newOutputs = Array.from(
      data.newOutputs.map(newOutput => {
        return {
          output: {
            create: {
              ...newOutput,
            },
          },
        };
      }),
    );

    data.areaId = Number(data.areaId);
    data.groupId = Number(data.groupId);

    let finalData = {
      name: data.name,
      areaId: data.areaId,
      groupId: data.groupId,
      entries: {
        create: [...newEntries, ...connectEntries],
      },
      outputs: {
        create: [...newOutputs, ...connectOutputs],
      },
      tools: {
        create: [...newTools, ...connectTools],
      },
    };

    let entryClient = new PrismaClient().entriesOnProcess;
    let outputClient = new PrismaClient().outputsOnProcess;
    let toolClient = new PrismaClient().toolsOnProcess;

    let deleteEntries = await entryClient.deleteMany({ where: { processId: id, entryId: { in: disconnectEntries } } });
    let deleteOutputs = await outputClient.deleteMany({ where: { processId: id, outputId: { in: disconnectOutputs } } });
    let deleteTools = await toolClient.deleteMany({ where: { processId: id, toolId: { in: disconnectTools } } });

    const newProcess = await this.processes.update({ where: { id: id }, data: { ...finalData } });
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
