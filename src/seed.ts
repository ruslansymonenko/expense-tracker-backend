import "reflect-metadata";
import bcrypt from "bcryptjs";
import { initDatabase, sequelize } from "./config/database";
import { User, Category, Expense } from "./models";

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await initDatabase();

    await Expense.destroy({ where: {}, force: true });
    await Category.destroy({ where: {}, force: true });
    await User.destroy({ where: {}, force: true });
    console.log("✅ Cleared existing data");

    const testUser = await User.create({
      email: "test@test.com",
      name: "Test User",
      password: await bcrypt.hash("123456", 10),
    });

    const demoUser = await User.create({
      email: "demo@example.com",
      name: "Demo User",
      password: await bcrypt.hash("demo123", 10),
    });
    console.log("✅ Seeded users");

    const categoriesData = [
      { name: "Food", icon: "fast-food", color: "#f59e0b" },
      { name: "Transport", icon: "car", color: "#3b82f6" },
      { name: "Entertainment", icon: "game-controller", color: "#8b5cf6" },
      { name: "Shopping", icon: "cart", color: "#ec4899" },
      { name: "Bills", icon: "receipt", color: "#ef4444" },
      { name: "Health", icon: "medical", color: "#10b981" },
      { name: "Education", icon: "school", color: "#06b6d4" },
      { name: "Other", icon: "ellipsis-horizontal", color: "#6b7280" },
    ];

    const testUserCategories = await Promise.all(
      categoriesData.map((cat) =>
        Category.create({
          ...cat,
          userId: testUser.id,
        }),
      ),
    );
    console.log("✅ Seeded categories for test user");

    await Promise.all(
      categoriesData.map((cat) =>
        Category.create({
          ...cat,
          userId: demoUser.id,
        }),
      ),
    );
    console.log("✅ Seeded categories for demo user");

    const expensesData = [
      {
        title: "Grocery Shopping",
        amount: 85.5,
        categoryName: "Food",
        date: new Date("2026-02-03"),
      },
      {
        title: "Uber Ride",
        amount: 15.2,
        categoryName: "Transport",
        date: new Date("2026-02-04"),
      },
      {
        title: "Netflix Subscription",
        amount: 12.99,
        categoryName: "Entertainment",
        date: new Date("2026-02-01"),
      },
      {
        title: "New Shoes",
        amount: 89.99,
        categoryName: "Shopping",
        date: new Date("2026-02-02"),
      },
      {
        title: "Electricity Bill",
        amount: 125,
        categoryName: "Bills",
        date: new Date("2026-02-05"),
      },
    ];

    for (const expenseData of expensesData) {
      const category = testUserCategories.find(
        (c) => c.name === expenseData.categoryName,
      );
      if (category) {
        await Expense.create({
          title: expenseData.title,
          amount: expenseData.amount,
          categoryId: category.id,
          date: expenseData.date,
          userId: testUser.id,
        });
      }
    }
    console.log("✅ Seeded expenses");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 Test accounts:");
    console.log("   Email: test@test.com, Password: 123456");
    console.log("   Email: demo@example.com, Password: demo123");

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
