import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: mongoose.Types.ObjectId;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  stock: number;
  unit: string;
  weight?: number;
  sku: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  ratings: {
    average: number;
    count: number;
  };
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  vendor?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide a category'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please provide a unit (kg, liter, piece, etc.)'],
      default: 'piece',
    },
    weight: {
      type: Number,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    nutritionInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.isModified('slug')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

export default mongoose.model<IProduct>('Product', productSchema);
