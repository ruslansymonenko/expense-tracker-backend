import { Router, Response } from "express";
import { Category } from "../models";
import { AuthRequest, authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const categories = await Category.findAll({
      where: { userId },
      order: [["name", "ASC"]],
      attributes: ["id", "name", "icon", "color", "userId", "createdAt"],
    });

    res.json({ data: categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    const userId = req.userId;

    if (!name || !icon || !color) {
      return res
        .status(400)
        .json({ error: "Name, icon, and color are required" });
    }

    const category = await Category.create({
      name,
      icon,
      color,
      userId: userId!,
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name, icon, color } = req.body;
    const userId = req.userId;

    const category = await Category.findOne({
      where: {
        id: req.params.id,
        userId,
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.update({ name, icon, color });

    res.json(category);
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
      const userId = req.userId;

      const category = await Category.findOne({
        where: {
          id: req.params.id,
          userId,
        },
      });

      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      await category.destroy();

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Delete category error:", error);
      res.status(500).json({ error: "Failed to delete category" });
    }
  },
);

export default router;
