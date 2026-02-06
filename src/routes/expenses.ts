import { Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/database";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const [expenses] = await pool.query<RowDataPacket[]>(
      `SELECT 
        e.id, 
        e.title, 
        e.amount, 
        e.date, 
        e.user_id as userId,
        e.category_id as categoryId,
        c.name as category
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.user_id = ?
       ORDER BY e.date DESC`,
      [userId],
    );

    res.json({
      data: expenses,
      meta: { count: expenses.length },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const [expenses] = await pool.query<RowDataPacket[]>(
      `SELECT 
        e.id, 
        e.title, 
        e.amount, 
        e.date, 
        e.user_id as userId,
        e.category_id as categoryId,
        c.name as category
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.id = ? AND e.user_id = ?`,
      [req.params.id, req.userId],
    );

    if (expenses.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(expenses[0]);
  } catch (error) {
    console.error("Get expense error:", error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, amount, categoryId, date } = req.body;
    const userId = req.userId;

    if (!title || !amount || !categoryId || !date) {
      return res
        .status(400)
        .json({ error: "Title, amount, categoryId, and date are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }

    const [categories] = await pool.query<RowDataPacket[]>(
      "SELECT id, name FROM categories WHERE id = ?",
      [categoryId],
    );

    if (categories.length === 0) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const expenseId = uuidv4();
    await pool.query(
      "INSERT INTO expenses (id, title, amount, category_id, date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [expenseId, title, amount, categoryId, date, userId],
    );

    const [newExpense] = await pool.query<RowDataPacket[]>(
      `SELECT 
        e.id, 
        e.title, 
        e.amount, 
        e.date, 
        e.user_id as userId,
        e.category_id as categoryId,
        c.name as category
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.id = ?`,
      [expenseId],
    );

    res.status(201).json(newExpense[0]);
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, amount, categoryId, date } = req.body;

    await pool.query(
      "UPDATE expenses SET title = ?, amount = ?, category_id = ?, date = ? WHERE id = ? AND user_id = ?",
      [title, amount, categoryId, date, req.params.id, req.userId],
    );

    const [updatedExpense] = await pool.query<RowDataPacket[]>(
      `SELECT 
        e.id, 
        e.title, 
        e.amount, 
        e.date, 
        e.user_id as userId,
        e.category_id as categoryId,
        c.name as category
       FROM expenses e
       JOIN categories c ON e.category_id = c.id
       WHERE e.id = ? AND e.user_id = ?`,
      [req.params.id, req.userId],
    );

    if (updatedExpense.length === 0) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(updatedExpense[0]);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const [result]: any = await pool.query(
        "DELETE FROM expenses WHERE id = ? AND user_id = ?",
        [req.params.id, req.userId],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Expense not found" });
      }

      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error("Delete expense error:", error);
      res.status(500).json({ error: "Failed to delete expense" });
    }
  },
);

export default router;
