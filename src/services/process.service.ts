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
      where: { active: true },
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
          include: {
            entry: true,
          },
        },
        outputs: {
          include: {
            output: true,
          },
        },
        tools: {
          include: {
            tool: true,
          },
        },
      },
    });

    if (!findProcess || (findProcess && !findProcess.active)) throw new HttpException(409, "Area doesn't exist");

    return findProcess;
  }

  public async create(data: CreateProcessDto): Promise<Process> {
    if (isEmpty(data)) throw new HttpException(400, 'userData is empty');

    data.areaId = Number(data.areaId);
    data.groupId = Number(data.groupId);

    const findProcess: Process = await this.processes.findUnique({ where: { name: data.name } });
    if (findProcess || (findProcess && !findProcess.active)) throw new HttpException(409, `Process with title ${data.name} already exists`);

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

    const newTestOutputs = Array.from(
      data.newOutputs.map(newOutput => {
        return {
          isExit: true,
          output: {
            create: {
              ...newOutput,
            },
          },
        };
      }),
    );

    const testConnectOutputs = Array.from(
      data.existingOutputs.map(id => {
        return {
          entry: {
            isExit: true,
            connect: {
              id: id,
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
        create: [...newEntries, ...connectEntries, ...newTestOutputs, ...testConnectOutputs],
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
        // outputs: {
        //   include: {
        //     output: true,
        //   },
        // },
      },
    });

    if (!findProcess || (findProcess && !findProcess.active)) throw new HttpException(409, "User doesn't exist");

    const oldEntries = await new PrismaClient().entriesOnProcess.findMany({
      where: { processId: id, isExit: false },
    });

    const oldOutputs = await new PrismaClient().entriesOnProcess.findMany({
      where: { processId: id, isExit: true },
    });

    // let testOldOutputs = await new PrismaClient().entriesOnProcess.findMany({
    //   where: { processId: id, isExit: true },
    // });

    const oldTools = await new PrismaClient().toolsOnProcess.findMany({
      where: { processId: id },
    });

    //TODO make a function for this

    const old = new Set();
    const updated = new Set();
    const disconnectEntries = [];
    const connectEntries = [];

    for (const entry of data.existingEntries) {
      updated.add(entry);
    }

    for (const entry of oldEntries) {
      old.add(entry.entryId);

      if (!updated.has(entry.entryId)) {
        disconnectEntries.push(entry.entryId);
      }
    }

    for (const entry of data.existingEntries) {
      if (!old.has(entry)) {
        connectEntries.push({ entry: { connect: { id: entry } } });
      }
    }

    const oldOut = new Set();
    const updatedOut = new Set();
    const disconnectOutputs = [];
    const connectOutputs = [];

    for (const output of data.existingOutputs) {
      updated.add(output);
    }

    for (const output of oldOutputs) {
      old.add(output.entryId);

      if (!updatedOut.has(output.entryId)) {
        disconnectOutputs.push(output.entryId);
      }
    }

    for (const output of data.existingOutputs) {
      if (!oldOut.has(output)) {
        connectOutputs.push({ isExit: true, entry: { connect: { id: output } } });
      }
    }

    const oldToolSet = new Set();
    const updatedTools = new Set();
    const disconnectTools = [];
    const connectTools = [];

    for (const tool of data.existingTools) {
      updatedTools.add(tool);
    }

    for (const tool of oldTools) {
      oldToolSet.add(tool.toolId);

      if (!updatedTools.has(tool.toolId)) {
        disconnectTools.push(tool.toolId);
      }
    }

    for (const tool of data.existingTools) {
      if (!oldToolSet.has(tool)) {
        connectTools.push({ tool: { connect: { id: tool } } });
      }
    }

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

    const newOutputs = Array.from(
      data.newOutputs.map(newEntry => {
        return {
          isExit: true,
          entry: {
            create: {
              ...newEntry,
            },
          },
        };
      }),
    );

    data.areaId = Number(data.areaId);
    data.groupId = Number(data.groupId);

    const finalData = {
      name: data.name,
      areaId: data.areaId,
      groupId: data.groupId,
      entries: {
        create: [...newEntries, ...connectEntries, ...newOutputs, ...connectOutputs],
      },
      // outputs: {
      //   // create: [...newOutputs, ...connectOutputs],
      // },
      tools: {
        create: [...newTools, ...connectTools],
      },
    };

    const entryClient = new PrismaClient().entriesOnProcess;
    const outputClient = new PrismaClient().outputsOnProcess;
    const toolClient = new PrismaClient().toolsOnProcess;

    const deleteEntries = await entryClient.deleteMany({ where: { processId: id, entryId: { in: disconnectEntries } } });
    const deleteOutputs = await outputClient.deleteMany({ where: { processId: id, outputId: { in: disconnectOutputs } } });
    const deleteTools = await toolClient.deleteMany({ where: { processId: id, toolId: { in: disconnectTools } } });

    const newProcess = await this.processes.update({ where: { id: id }, data: { ...finalData } });
    return newProcess;
  }

  public async delete(id: number): Promise<Process> {
    if (isEmpty(id)) throw new HttpException(400, "User doesn't existId");

    const findProcess: Process = await this.processes.findUnique({ where: { id: id } });
    if (!findProcess) throw new HttpException(409, "User doesn't exist");

    const deleteProcess = await this.processes.update({ where: { id: id }, data: { ...findProcess, active: false } });
    return deleteProcess;
  }
}

export default ProcessService;
