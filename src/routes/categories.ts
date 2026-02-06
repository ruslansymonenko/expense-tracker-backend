import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/database";
import { AuthRequest, authMiddleware } from "../middleware/auth";
import { RowDataPacket } from "mysql2";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const [categories] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM categories ORDER BY name",
    );

    res.json({ data: categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const [categories] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ?",
      [req.params.id],
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, color } = req.body;

    if (!name || !icon || !color) {
      return res
        .status(400)
        .json({ error: "Name, icon, and color are required" });
    }

    const categoryId = uuidv4();
    await pool.query(
      "INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)",
      [categoryId, name, icon, color],
    );

    const [newCategory] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId],
    );

    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, color } = req.body;

    await pool.query(
      "UPDATE categories SET name = ?, icon = ?, color = ? WHERE id = ?",
      [name, icon, color, req.params.id],
    );

    const [updatedCategory] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM categories WHERE id = ?",
      [req.params.id],
    );

    if (updatedCategory.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory[0]);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    try {
      const [result]: any = await pool.query(
        "DELETE FROM categories WHERE id = ?",
        [req.params.id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
);

export default router;
