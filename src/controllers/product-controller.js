const prisma = require("../config/prisma");

// method POST //CPU
exports.createProductCPU = async (req, res) => {
  const {name, description, price, categoryId, model, socket, cores, threads, baseClock, boostClock} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง CPU
    const cpu = await prisma.cPU.create({
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
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Monitor
    const monitor = await prisma.monitor.create({
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
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง CPUCooler
    const cpuCooler = await prisma.cPUCooler.create({
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
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง PowerSupply
    const powerSupply = await prisma.powerSupply.create({
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
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Case
    const caseItem = await prisma.case.create({
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
  const {name, description, price, categoryId, model, vram, power} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง GPU
    const gpu = await prisma.gPU.create({
      data: {
        name: name,
        model: model,
        vram: +vram,
        power: +power,
        productId: product.id,
      },
    });

    res.json({
      message:
        "ProductGPU created successfully",
      data: {
        product,
        gpu,
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
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Memory
    const itemMemory = await prisma.memory.create({
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
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    // สร้าง Motherboard
    const motherboard = await prisma.motherboard.create({
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
  const {name, description, price, categoryId, model, size, type, speed, format} = req.body;

  try {
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: +categoryId,
      },
    });

    //  สร้าง Drive
    const drive = await prisma.drive.create({
      data: {
        name: name,
        model: model,
        size: size,
        type: type,
        speed: speed,
        format: format,
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


// ---------------------------------------------//


// method GET ดูสินค้าระบุจำนวน
exports.listProducts = async (req, res) => {
  try {
    // code
    const { count } = req.params
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt : "desc"},
      include: {
        ProductCategory: true
      }
    })
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method PUT อัพเดตสินค้า
exports.updateProduct = async (req, res) => {
  const { id } = req.params
  const { name, description, price, categoryId } = req.body
  try {
    // code
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
      },
    })

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method DELETE ลบสินค้า
exports.removeProduct = async (req, res) => {
  try {
    // code
    const {id} = req.params
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(id)
      }
    })

    res.json({
      message: "Product removed successfully",
      data: deletedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// method POST ดูสินค้าบางรายการ
exports.listByProduct = async (req, res) => {
  try {
    // code
    const { categoryId } = req.body

    const products = await prisma.product.findMany({
      where: {
        categoryId: Number(categoryId),
      },
      include: {
        ProductCategory: true,
      }
    })

  // ตรวจสอบว่ามีผลิตภัณฑ์หรือไม่
  if (products.length === 0) {
    return res.status(404).json({ message: "No products found" });
  }
  res.json({
    message: "Products retrieved successfully",
    data: products,
  });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


// method POST ค้นหาสินค้า (!!!ยังไม่เสร็จ)
exports.searchFiltersProduct = async (req, res) => {
  try {
    // code
    res.send("Hello searchFilters Product");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
