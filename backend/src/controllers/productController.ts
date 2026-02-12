import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.js';
import { ErrorResponse } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search as string, 'i')] } },
      ];
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice as string);
    }

    if (req.query.isFeatured === 'true') {
      filter.isFeatured = true;
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products,
    });
  }
);

export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const createProduct = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const product = await Product.create({
      ...req.body,
      vendor: req.user?._id,
    });

    res.status(201).json({
      success: true,
      product,
    });
  }
);

export const updateProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
);

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
