import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./User";
import { Category } from "./Category";

@Table({
  tableName: "expenses",
  timestamps: true,
  updatedAt: false,
})
export class Expense extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amount!: number;

  @ForeignKey(() => Category)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "category_id" })
  categoryId!: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  date!: Date;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "user_id" })
  userId!: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Category)
  category!: Category;
}
