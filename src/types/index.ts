import { User as UserModel } from "../models/User";
import { Category as CategoryModel } from "../models/Category";
import { Expense as ExpenseModel } from "../models/Expense";

export type User = UserModel;
export type Category = CategoryModel;
export type Expense = ExpenseModel;

export interface CategoryDTO {
  id: string;
  name: string;
  icon: string;
  color: string;
  userId: string;
  createdAt: Date;
}

export interface ExpenseDTO {
  id: string;
  title: string;
  amount: number;
  categoryId: string;
  date: Date;
  userId: string;
  category?: string;
  createdAt: Date;
}
