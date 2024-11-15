const prisma = require("../config/prisma");
const createError = require("../utils/createError");

const getProductPart = async (categoryId, filter) => {
  const { drive, cpu, motherboard, memory, cooler } = filter;
  console.log("filter", filter);
  // console.log("filter", filter);
  switch (categoryId) {
    case 1: // CPU
      console.log("motherboard", motherboard);
      const getCPU = await prisma.product.findMany({
        where: {
          categoryId: 1,
        },
        include: {
          ProductImages: true,
          CPU: true,
        },
      });
      const filteredCPU = getCPU.filter((item) => {
        if (motherboard) {
          return item.CPU[0].socket === motherboard.socket;
        }
        return 1;
      });
      const filteredCPU2 = filteredCPU.filter((item) => {
        if (cooler) {
          const cpuSocket = item.CPU[0].socket.split("V2").join("");
          return cooler.socket.includes(cpuSocket);
        }
        return 1;
      });
      return filteredCPU2;
    case 2: // Monitor
      return await prisma.product.findMany({
        where: {
          categoryId: 2,
        },
        include: {
          ProductImages: true,
          Monitor: true,
        },
      });
    case 3: // CPU Cooler
      const getCPUCooler = await prisma.product.findMany({
        where: {
          categoryId: 3,
        },
        include: {
          ProductImages: true,
          CPUCooler: true,
        },
      });
      const filteredCPUCooler = getCPUCooler.filter((item) => {
        // console.log("item", item.CPUCooler[0].socket);
        const socketList = item.CPUCooler[0].socket.split(",");
        // console.log("socketList", socketList);
        if (cpu) {
          const cpuSocket = cpu.socket.split("V2").join("");
          return socketList.includes(cpuSocket);
        }
        return 1;
      });

      const filteredCPUCooler2 = filteredCPUCooler.filter((item) => {
        // console.log("item", item.CPUCooler[0].socket);
        const socketList = item.CPUCooler[0].socket.split(",");
        // console.log("socketList", socketList);
        if (motherboard) {
          const motherboardSocket = motherboard.socket.split("V2").join("");
          return socketList.includes(motherboardSocket);
        }
        return 1;
      });

      return filteredCPUCooler2;
    case 4: // Power Supply
      return await prisma.product.findMany({
        where: {
          categoryId: 4,
        },
        include: {
          ProductImages: true,
          PowerSupply: true,
        },
      });
    case 5: // Case
      return await prisma.product.findMany({
        where: {
          categoryId: 5,
        },
        include: {
          ProductImages: true,
          Case: true,
        },
      });
    case 6: // GPU
      return await prisma.product.findMany({
        where: {
          categoryId: 6,
        },
        include: {
          ProductImages: true,
          GPU: true,
        },
      });
    case 7: // Memory
      const getMemory = await prisma.product.findMany({
        where: {
          categoryId: 7,
        },
        include: {
          ProductImages: true,
          Memory: true,
        },
      });
      const filterMemory = getMemory.filter((item) => {
        // console.log(item.Memory[0].type);
        if (motherboard) {
          return item.Memory[0].type === motherboard.type;
        }
        return 1;
      });
      return filterMemory;
    case 8: // Motherboard
      const getMB = await prisma.product.findMany({
        where: {
          categoryId: 8,
        },
        include: {
          ProductImages: true,
          Motherboard: true,
        },
      });
      const filterMB_CPU = getMB.filter((item) => {
        // console.log(item.Motherboard[0].socket);
        // console.log(cpu);
        if (cpu) {
          return cpu.socket === item.Motherboard[0].socket;
        } else {
          return 1;
        }
      });
      const filterMB_Memory = filterMB_CPU.filter((item) => {
        const name = item.name;
        const regex = /(DDR\d+)/;
        const match = name.match(regex);
        if (memory) {
          return match[0] === memory.type;
        }
        return 1;
      });
      const filterMB_Coolter = filterMB_Memory.filter((item) => {
        if (cooler) {
          const cpuSocket = item.Motherboard[0].socket.split("V2").join("");
          return cooler.socket.includes(cpuSocket);
        }
        return 1;
      });
      return filterMB_Coolter;
    case 9: // Drive
      return await prisma.product.findMany({
        where: {
          categoryId: 9,
          Drive: {
            some: drive,
          },
        },
        include: {
          ProductImages: true,
          Drive: true,
        },
      });
    case 10: // Accessory
      return await prisma.product.findMany({
        where: {
          categoryId: 10,
          Accessory: {
            some: {
              accessoriesType: filter.accessoriesType,
            },
          },
        },
        include: {
          ProductImages: true,
          Accessory: true,
        },
      });
    default: // Accessory
      if (categoryId >= 11) {
        return await prisma.product.findMany({
          where: {
            categoryId: +categoryId,
          },
          include: {
            ProductImages: true,
          },
        });
      }
      return createError(400, "Invalid categoryId");
  }
};

module.exports.getProductByCategoryId = async (req, res, next) => {
  try {
    const categoryId = +req.params.categoryId;
    // console.log("body");
    // console.log(req.body);
    const filter = req.body;
    console.log("sdasdasdsa", filter);
    const products = await getProductPart(categoryId, filter);
    res.json({
      message: "Get Product By CategoryId Success",
      products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.createPCBuild = async (req, res, next) => {
  try {
    console.log("call Create PC Build");
    const {
      cpu,
      cooler,
      motherboard,
      memory,
      gpu,
      powerSupply,
      drive,
      ssd,
      PCCase,
      monitor,
      totalPrice,
    } = req.body;
    const useId = req.user.id;
    console.log(req.body);
    //check each part is not null or undefined. if null or undefined skip create build on that part
    const build = await prisma.pCBuild.create({
      data: {
        cpuId: cpu?.id ? parseInt(cpu.CPU[0].id) : null,
        cpuCoolerId: cooler?.id ? parseInt(cooler.CPUCooler[0].id) : null,
        motherboardId: motherboard?.id
          ? parseInt(motherboard.Motherboard[0].id)
          : null,
        memoryId: memory?.id ? parseInt(memory.Memory[0].id) : null,
        gpuId: gpu?.id ? parseInt(gpu.GPU[0].id) : null,
        powerSupplyId: powerSupply?.id
          ? parseInt(powerSupply.PowerSupply[0].id)
          : null,
        driveId: drive?.id ? parseInt(drive.Drive[0].id) : null,
        ssdId: ssd?.id ? parseInt(ssd.Drive[0].id) : null,
        caseId: PCCase?.id ? parseInt(PCCase.Case[0].id) : null,
        monitorId: monitor?.id ? parseInt(monitor.Monitor[0].id) : null,
        totalPrice: parseFloat(totalPrice),
        userId: parseInt(useId),
      },
    });
    res.json({
      message: "Create Build Success",
      build,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getPCBuildList = async (req, res, next) => {
  try {
    console.log("call Get PC Build List");
    const userId = req.user.id;
    //list all build that user created include product detail
    const build = await prisma.pCBuild.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        cpu: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        cpuCooler: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        motherboard: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        memory: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        gpu: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        powerSupply: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        drive: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        ssd: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        case: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
        monitor: {
          include: {
            product: {
              include: {
                ProductImages: true,
              },
            },
          },
        },
      },
    });
    res.json({
      message: "Get Build Success",
      build,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
