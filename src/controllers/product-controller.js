const prisma = require("../config/prisma");
const createError = require("../utils/createError");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createImage = async (images, productId, next) => {
  try {
    if (!images) {
      return;
    }
    const imageData = images.map((image) => ({
      productId: productId,
      imageUrl: image.url,
      public_id: image.public_id || `default_public_id_${Date.now()}`,
    }));

    const newImages = await prisma.productImage.createMany({
      data: imageData, // ส่งข้อมูลรูปภาพที่เตรียมไว้
    });
    return newImages;
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //CPU
module.exports.createProductCPU = async (req, res, next) => {
  try {
    // console.log(req.body)
    const {
      name,
      description,
      price,
      categoryId,
      model,
      socket,
      cores,
      threads,
      baseClock,
      boostClock,
      stock,
    } = req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("CPU", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductCPU created successfully",
      data: {
        product,
        cpu,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //Monitor
module.exports.createProductMonitor = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      model,
      size,
      resolution,
      refreshRate,
      panelType,
      stock,
    } = req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("Monitor", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductMonitor created successfully",
      data: {
        product,
        monitor,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //CPUCooler
module.exports.createProductCPUCooler = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      model,
      socket,
      radiator,
      type,
      stock,
    } = req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("CPUCooler", images)
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductCPUCooler created successfully",
      data: {
        product,
        cpuCooler,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //PowerSupply
module.exports.createProductPowerSupply = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, model, wattage, stock } =
      req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("PowerSupply", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductPowerSupply created successfully",
      data: {
        product,
        powerSupply,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //Case
module.exports.createProductCase = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, model, size, stock } =
      req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("Case", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductCase created successfully",
      data: {
        product,
        caseItem,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //GPU
module.exports.createProductGPU = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, model, vram, power, stock } =
      req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("GPU", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductGPU created successfully",
      data: {
        product,
        gpu,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.createProductMemory = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      model,
      memory,
      busSpeed,
      type,
      stock,
    } = req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("Memory", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductMemory created successfully",
      data: {
        product,
        itemMemory,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //Motherboard
module.exports.createProductMotherboard = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      model,
      socket,
      chipset,
      stock,
    } = req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("Motherboard", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductMotherboard created successfully",
      data: {
        product,
        motherboard,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //Drive
module.exports.createProductDrive = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      categoryId,
      model,
      size,
      type,
      speed,
      format,
      stock,
    } = req.body.form;
    const images = req.body?.image.images;
    // console.log("------------------------------------------------")
    // console.log("Drive", images )
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);

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
      message: "ProductDrive created successfully",
      data: {
        product,
        drive,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST //Accessory
module.exports.createProductAccessory = async (req, res, next) => {
  try {
    const { name, description, price, categoryId, accessoriesType, stock } =
      req.body.form;
    const images = req.body?.image.images;
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // สร้าง Product
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        stock: +stock,
        categoryId: +categoryId,
        stock: +stock,
      },
    });

    const newImages = await createImage(images, product.id, next);
    //  สร้าง Accessory
    const accessory = await prisma.accessory.create({
      data: {
        name: name,
        description: description,
        accessoriesType: accessoriesType,
        productId: product.id,
      },
    });

    res.json({
      message: "ProductAccessory created successfully",
      data: {
        product,
        accessory,
        image: newImages,
      },
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// ---------------------------------------------//

// method GET ดูสินค้าทั้งหมด
module.exports.listProducts = async (req, res, next) => {
  try {
    // code
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        ProductCategory: true,
        ProductImages: true,
      },
    });
    res.json(products);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method GET ดูสินค้าตาม id
module.exports.readProduct = async (req, res, next) => {
  try {
    // code
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        ProductCategory: true,
        ProductImages: true,
        CPU: true,
        Monitor: true,
        CPUCooler: true,
        PowerSupply: true,
        Case: true,
        GPU: true,
        Memory: true,
        Motherboard: true,
        Drive: true,
        Accessory: true,
      },
    });
    res.json(product);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method PUT อัพเดตสินค้า
module.exports.updateProduct = async (req, res, next) => {
  try {
    // console.log('req.body', req.body)
    const { id } = req.params;
    const { name, stock, description, price, categoryId } = req.body.form;
    const bodyInfo = req.body.form;
    const reqImage = req.body.image;
    const role = req.user.role;
    console.log("body!!!!!!", req.body);
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    if (reqImage) {
      reqImage.forEach(async (item) => {
        const findImage = await prisma.productImage.findFirst({
          where: {
            public_id: item.public_id,
          },
        });
        if (!findImage) {
          const newImage = await prisma.productImage.create({
            data: {
              public_id: item.public_id,
              imageUrl: item.secure_url,
              productId: +id,
            },
          });
        }
      });
    }
    // code
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId),
        stock: +stock,
        // ProductImage: ProductImage
      },
    });
    delete bodyInfo.description;
    delete bodyInfo.price;
    delete bodyInfo.stock;
    delete bodyInfo.categoryId;
    // console.log('categoryId', categoryId)
    switch (String(categoryId)) {
      case "1": // CPU
        const CPU = await prisma.cPU.findFirst({
          where: {
            productId: +id,
          },
        });
        const { cores, threads, baseClock, boostClock, ...restCPU } = bodyInfo;
        const updateCPU = await prisma.cPU.update({
          where: {
            id: CPU.id,
          },
          data: {
            ...restCPU,
            cores: +cores,
            threads: +threads,
            baseClock: +baseClock,
            boostClock: +boostClock,
          },
        });
        // console.log("CPU")
        break;
      case "2": // Monitor
        const Monitor = await prisma.monitor.findFirst({
          where: {
            productId: +id,
          },
        });
        const { size, refreshRate, ...restMonitor } = bodyInfo;
        const updateMonitor = await prisma.monitor.update({
          where: {
            id: Monitor.id,
          },
          data: {
            ...restMonitor,
            size: +size,
            refreshRate: +refreshRate,
          },
        });
        // console.log("Monitor")
        break;
      case "3": // CPU Cooler
        const CPUCooler = await prisma.cPUCooler.findFirst({
          where: {
            productId: +id,
          },
        });
        const { radiator, ...restCPUCooler } = bodyInfo;
        const updateCPUCooler = await prisma.cPUCooler.update({
          where: {
            id: CPUCooler.id,
          },
          data: {
            ...restCPUCooler,
            radiator: +radiator,
          },
        });
        // console.log("CPU Cooler")
        break;
      case "4": // Power Supply
        const PowerSupply = await prisma.powerSupply.findFirst({
          where: {
            productId: +id,
          },
        });
        const { wattage, ...restPowerSupply } = bodyInfo;
        const updatePowerSupply = await prisma.powerSupply.update({
          where: {
            id: PowerSupply.id,
          },
          data: {
            ...restPowerSupply,
            wattage: +wattage,
          },
        });
        // console.log("Power Supply")
        break;
      case "5": // Case
        // console.log('bodyInfo', bodyInfo)
        const itemCase = await prisma.case.findFirst({
          where: {
            productId: +id,
          },
        });
        const updateCase = await prisma.case.update({
          where: {
            id: itemCase.id,
          },
          data: bodyInfo,
        });
        // console.log("Case")
        break;
      case "6": // GPU
        const GPU = await prisma.gPU.findFirst({
          where: {
            productId: +id,
          },
        });
        const { vram, power, ...restGPU } = bodyInfo;
        const updateGPU = await prisma.gPU.update({
          where: {
            id: GPU.id,
          },
          data: {
            ...restGPU,
            vram: +vram,
            power: +power,
          },
        });
        // console.log("GPU")
        break;
      case "7": // Memory
        const Memory = await prisma.memory.findFirst({
          where: {
            productId: +id,
          },
        });
        const { memory, busSpeed, ...restMemory } = bodyInfo;
        const updateMemory = await prisma.memory.update({
          where: {
            id: Memory.id,
          },
          data: {
            ...restMemory,
            memory: +memory,
            busSpeed: +busSpeed,
          },
        });
        // console.log("Memory")
        break;
      case "8": // Motherboard
        const Motherboard = await prisma.motherboard.findFirst({
          where: {
            productId: +id,
          },
        });
        const updateMotherboard = await prisma.motherboard.update({
          where: {
            id: Motherboard.id,
          },
          data: bodyInfo,
        });
        // console.log("Motherboard")
        break;
      case "9": // Drive
        const Drive = await prisma.drive.findFirst({
          where: {
            productId: +id,
          },
        });
        const updateDrive = await prisma.drive.update({
          where: {
            id: Drive.id,
          },
          data: bodyInfo,
        });
        // console.log("Drive");
        break;
      case "10": // Accessory
        const Accessory = await prisma.accessory.findFirst({
          where: {
            productId: +id,
          },
        });
        const updateAccessory = await prisma.accessory.update({
          where: {
            id: Accessory.id,
          },
          data: bodyInfo,
        });
      // console.log("Accessory");
    }

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method DELETE ลบสินค้า
module.exports.removeProduct = async (req, res, next) => {
  try {
    // code
    const { id } = req.params;
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    // step 1 ค้นหาสินค้า include images

    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        ProductImages: true,
      },
    });
    if (!product) {
      return res.status(400).json({ message: "Product not found!!!" });
    }
    // console.log('-------------------------------------------------------')
    // console.log(product)

    // step 2 Promise ลบแบบ รอ!
    const deletedImage = product.ProductImages.map(
      (image) =>
        
        { if(!image.public_id){
           return 
          }
          return new Promise((resolve, reject) => {
          // ลบจาก cloud
         
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        })}
    );
    await Promise.all(deletedImage);

    // step 3 ลบสินค้า
    console.log(product, "product");
    const deletedProduct = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Product removed successfully",
      data: deletedProduct,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// method POST ดูสินค้าบางรายการ
module.exports.listByProduct = async (req, res, next) => {
  try {
    // code
    const { categoryId } = req.body;
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: Number(categoryId),
      },
      include: {
        ProductCategory: true,
      },
    });

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
    next(err);
  }
};

// method POST ค้นหาสินค้า (!!!ยังไม่เสร็จ)
module.exports.searchFiltersProduct = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "ADMIN" && role !== "USER") {
      return createError(403, "forbidden");
    }
    // code
    res.send("Hello searchFilters Product");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// ---------------------------------------------//

module.exports.createImages = async (req, res, next) => {
  try {
    const role = req.user.role;
    // console.log(req.body)
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: "Teach_Heaven",
    });
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }

    res.send(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.removeImage = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    const { public_id } = req.body;
    // console.log(public_id)
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove Image Success!!!");
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports.deleteProductImage = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role !== "ADMIN") {
      return createError(403, "forbidden");
    }
    const { public_id } = req.body;
    console.log(public_id);
    const image = await prisma.productImage.findFirst({
      where: {
        public_id: public_id,
      },
    });
    if (image) {
      // return createError(400,"Image not found")

      const deleteImage = await prisma.productImage.delete({
        where: {
          id: image.id,
        },
      });
    }
    res.status(200).json({ message: "Remove Image Success!!!" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
