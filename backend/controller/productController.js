import uploadOnCloudinary from "../config/cloudinary.js";
import Product from "../model/productModel.js";
import {
  computeProductEmbeddingFromText,
  getVisualSearchModelId,
} from "../services/visualEmbeddingService.js";

export const addProduct = async (req, res) => {
  try {
    const vendorId = req.vendorId || req.body.vendorId;
    let { name, description, price, category, subCategory, sizes, bestseller } =
      req.body;

    let image1 = await uploadOnCloudinary(req.files.image1[0].path);
    let image2 = await uploadOnCloudinary(req.files.image2[0].path);
    let image3 = await uploadOnCloudinary(req.files.image3[0].path);
    let image4 = await uploadOnCloudinary(req.files.image4[0].path);

    let productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
      date: Date.now(),
      image1,
      image2,
      image3,
      image4,
      vendorId,
    };

    // Visual Search embedding (best-effort; does not block product creation if HF is unavailable)
    try {
      const modelId = getVisualSearchModelId();
      const productText = `${name}. Category: ${category} / ${subCategory}. ${description}`;
      const { embedding, dim } = await computeProductEmbeddingFromText(productText);
      productData.visualEmbedding = embedding;
      productData.visualEmbeddingDim = dim;
      productData.visualEmbeddingModel = modelId;
      productData.visualEmbeddingUpdatedAt = new Date();
    } catch (e) {
      console.warn("[VISUAL-INDEX] addProduct embedding skipped:", e.message);
    }

    const product = await Product.create(productData);

    return res.status(201).json(product);
  } catch (error) {
    console.log("AddProduct error");
    return res.status(500).json({ message: `AddProduct error ${error}` });
  }
};

export const listProduct = async (req, res) => {
  try {
    const product = await Product.find({});
    return res.status(200).json(product);
  } catch (error) {
    console.log("ListProduct error");
    return res.status(500).json({ message: `ListProduct error ${error}` });
  }
};

export const vendorProducts = async (req, res) => {
  try {
    const vendorId = req.vendorId || req.body.vendorId;
    const product = await Product.find({ vendorId });
    return res.status(200).json({ success: true, products: product });
  } catch (error) {
    console.log("VendorProduct error");
    return res.status(500).json({ message: `VendorProduct error ${error}` });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const vendorId = req.vendorId || req.body.vendorId;
    let { id } = req.body;
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.vendorId !== vendorId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized to delete this product",
        });
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log("RemoveProduct error");
    return res.status(500).json({ message: `RemoveProduct error ${error}` });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const vendorId = req.vendorId || req.body.vendorId;
    const {
      id,
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Product ID is missing from request body",
        });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({
          success: false,
          message: `Product with ID ${id} not found in database`,
        });
    }

    if (product.vendorId !== vendorId) {
      return res
        .status(401)
        .json({
          success: false,
          message: `Unauthorized: Product belongs to vendor ${product.vendorId}, but you are vendor ${vendorId}`,
        });
    }

    const updateData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true" ? true : false,
    };

    if (req.files) {
      if (req.files.image1)
        updateData.image1 = await uploadOnCloudinary(req.files.image1[0].path);
      if (req.files.image2)
        updateData.image2 = await uploadOnCloudinary(req.files.image2[0].path);
      if (req.files.image3)
        updateData.image3 = await uploadOnCloudinary(req.files.image3[0].path);
      if (req.files.image4)
        updateData.image4 = await uploadOnCloudinary(req.files.image4[0].path);
    }

    // Recompute visual embedding if primary text changed or missing
    try {
      const shouldRecompute =
        Boolean(name || description || category || subCategory) ||
        !Array.isArray(product.visualEmbedding) ||
        product.visualEmbedding.length === 0;
      if (shouldRecompute) {
        const modelId = getVisualSearchModelId();
        const merged = {
          name: name ?? product.name,
          description: description ?? product.description,
          category: category ?? product.category,
          subCategory: subCategory ?? product.subCategory,
        };
        const productText = `${merged.name}. Category: ${merged.category} / ${merged.subCategory}. ${merged.description}`;
        const { embedding, dim } = await computeProductEmbeddingFromText(productText);
        updateData.visualEmbedding = embedding;
        updateData.visualEmbeddingDim = dim;
        updateData.visualEmbeddingModel = modelId;
        updateData.visualEmbeddingUpdatedAt = new Date();
      }
    } catch (e) {
      console.warn(
        "[VISUAL-INDEX] updateProduct embedding skipped:",
        e.message,
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.log("UpdateProduct error", error);
    return res
      .status(500)
      .json({ success: false, message: `UpdateProduct error ${error}` });
  }
};
