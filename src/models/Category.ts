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
  HasMany,
} from "sequelize-typescript";
import { User } from "./User";
import { Expense } from "./Expense";

@Table({
  tableName: "categories",
  timestamps: true,
  updatedAt: false,
})
export class Category extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  icon!: string;

  @AllowNull(false)
  @Column(DataType.STRING(7))
  color!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID, field: "user_id" })
  userId!: string;

  @CreatedAt
  @Column({ field: "created_at" })
  createdAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => Expense)
  expenses!: Expense[];
}
