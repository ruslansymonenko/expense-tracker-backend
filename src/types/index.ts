export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category_id: string;
  date: string;
  user_id: string;
}

export interface ExpenseResponse extends Expense {
  category: string;
  categoryId: string;
}
