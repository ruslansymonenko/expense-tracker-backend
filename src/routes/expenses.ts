import { Router, Response } from "express";
import { Expense, Category } from "../models";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const expenses = await Expense.findAll({
      where: { userId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "icon", "color"],
        },
      ],
      order: [["date", "DESC"]],
    });

    const formattedExpenses = expenses.map((expense) => ({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      userId: expense.userId,
      categoryId: expense.categoryId,
      category: expense.category?.name,
    }));

    res.json({
      data: formattedExpenses,
      meta: { count: expenses.length },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "icon", "color"],
        },
      ],
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    const formattedExpense = {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      userId: expense.userId,
      categoryId: expense.categoryId,
      category: expense.category?.name,
    };

    res.json(formattedExpense);
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

    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    const expense = await Expense.create({
      title,
      amount,
      categoryId,
      date,
      userId: userId!,
    });

    await expense.reload({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "icon", "color"],
        },
      ],
    });

    const formattedExpense = {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      userId: expense.userId,
      categoryId: expense.categoryId,
      category: expense.category?.name,
    };

    res.status(201).json(formattedExpense);
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, amount, categoryId, date } = req.body;
    const userId = req.userId;

    const expense = await Expense.findOne({
      where: {
        id: req.params.id,
        userId,
      },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    if (categoryId) {
      const category = await Category.findOne({
        where: {
          id: categoryId,
          userId,
        },
      });

      if (!category) {
        return res.status(400).json({ error: "Invalid category" });
      }
    }

    await expense.update({ title, amount, categoryId, date });

    // Reload with category information
    await expense.reload({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name", "icon", "color"],
        },
      ],
    });

    const formattedExpense = {
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      userId: expense.userId,
      categoryId: expense.categoryId,
      category: expense.category?.name,
    };

    res.json(formattedExpense);
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
      const expense = await Expense.findOne({
        where: {
          id: req.params.id,
          userId: req.userId,
        },
      });

      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }

      await expense.destroy();

      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error("Delete expense error:", error);
      res.status(500).json({ error: "Failed to delete expense" });
    }
  },
);

export default router;
