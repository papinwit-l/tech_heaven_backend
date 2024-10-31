const prisma = require("../config/prisma");

// method POST //CPU
exports.createProductCPU = async (req, res) => {
  const {name, description, price, categoryId, model, socket, cores, threads, baseClock, boostClock} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง CPU
    const cpu = await prisma.CPU.create({
      data: {
        name: name,
        model: model,
        socket: socket,
        cores: +cores,
        threads: +threads,
        baseClock: parseFloat(baseClock),
        boostClock: parseFloat(boostClock),
        description: description,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductCPU created successfully",
      data: {
        product,
        cpu,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //Monitor
exports.createProductMonitor = async (req, res) => {
  const {name, description, price, categoryId, model, size, resolution, refreshRate, panelType} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Monitor
    const monitor = await prisma.Monitor.create({
      data: {
        name: name,
        model: model,
        size: +size,
        resolution: resolution,
        refreshRate: +refreshRate,
        panelType: panelType,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductMonitor created successfully",
      data: {
        product,
        monitor,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //CPUCooler
exports.createProductCPUCooler = async (req, res) => {
  const {name, description, price, categoryId, model, socket, radiator, type} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง CPUCooler
    const cpuCooler = await prisma.CPUCooler.create({
      data: {
        name: name,
        model: model,
        socket: socket,
        radiator: +radiator,
        type: type,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductCPUCooler created successfully",
      data: {
        product,
        cpuCooler,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //PowerSupply
exports.createProductPowerSupply = async (req, res) => {
  const {name, description, price, categoryId, model, wattage} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง PowerSupply
    const powerSupply = await prisma.PowerSupply.create({
      data: {
        name: name,
        model: model,
        wattage: +wattage,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductPowerSupply created successfully",
      data: {
        product,
        powerSupply,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //Case
exports.createProductCase = async (req, res) => {
  const {name, description, price, categoryId, model, size} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Case
    const caseItem = await prisma.Case.create({
      data: {
        name: name,
        model: model,
        size: size,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductCase created successfully",
      data: {
        product,
        caseItem,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //GPU
exports.createProductGPU = async (req, res) => {
  const {name, description, price, categoryId, model} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง GPU
    const gpu = await prisma.GPU.create({
      data: {
        name: name,
        model: model,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductGPU created successfully",
      data: {
        product,
        caseItem,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProductMemory = async (req, res) => {
  const {name, description, price, categoryId, model, memory, busSpeed, type} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Memory
    const itemMemory = await prisma.Memory.create({
      data: {
        name: name,
        model: model,
        memory: +memory,
        busSpeed: +busSpeed,
        type: type,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductMemory created successfully",
      data: {
        product,
        itemMemory,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //Motherboard
exports.createProductMotherboard = async (req, res) => {
  const {name, description, price, categoryId, model, socket, chipset} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Motherboard
    const motherboard = await prisma.Motherboard.create({
      data: {
        name: name,
        model: model,
        socket: socket,
        chipset: chipset,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductMotherboard created successfully",
      data: {
        product,
        motherboard,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST //Drive
exports.createProductDrive = async (req, res) => {
  const {name, description, price, categoryId, model, size, type, speed} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.Product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    //  สร้าง Drive
    const drive = await prisma.Drive.create({
      data: {
        name: name,
        model: model,
        size: size,
        type: type,
        speed: speed,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductDrive created successfully",
      data: {
        product,
        drive,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ดูสินค้ารวม
exports.listProducts = async (req, res) => {
  try {
    // code
    const { count } = req.params
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt : "desc"},
      include: {
        productCategory: true
      }
    })
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// อัพเดตสินค้า
exports.updateProduct = async (req, res) => {
  try {
    // code
    res.send("Hello update Product");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ลบสินค้า
exports.removeProduct = async (req, res) => {
  try {
    // code
    const {id} = req.params
    await prisma.product.delete({
      where: {
        id: Number(id)
      }
    })
    res.send("Hello Remove Product");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ดูสินค้าบางรายการ
exports.listByProduct = async (req, res) => {
  try {
    // code
    res.send("Hello Listby Product");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ค้นหาสินค้า
exports.searchFiltersProduct = async (req, res) => {
  try {
    // code
    res.send("Hello searchFilters Product");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
