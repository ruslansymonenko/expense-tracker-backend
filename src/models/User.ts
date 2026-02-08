import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  HasMany,
  PrimaryKey,
  Default,
  Unique,
  AllowNull,
} from "sequelize-typescript";
import { Category } from "./Category";
import { Expense } from "./Expense";

@Table({
  tableName: "users",
  timestamps: true,
  updatedAt: false,
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @HasMany(() => Category)
  categories!: Category[];

  @HasMany(() => Expense)
  expenses!: Expense[];
}
