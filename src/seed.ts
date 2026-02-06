import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { pool, initDatabase } from "./config/database";

const categories = [
  { id: uuidv4(), name: "Food", icon: "fast-food", color: "#f59e0b" },
  { id: uuidv4(), name: "Transport", icon: "car", color: "#3b82f6" },
  {
    id: uuidv4(),
    name: "Entertainment",
    icon: "game-controller",
    color: "#8b5cf6",
  },
  { id: uuidv4(), name: "Shopping", icon: "cart", color: "#ec4899" },
  { id: uuidv4(), name: "Bills", icon: "receipt", color: "#ef4444" },
  { id: uuidv4(), name: "Health", icon: "medical", color: "#10b981" },
  { id: uuidv4(), name: "Education", icon: "school", color: "#06b6d4" },
  {
    id: uuidv4(),
    name: "Other",
    icon: "ellipsis-horizontal",
    color: "#6b7280",
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await initDatabase();

    await pool.query("DELETE FROM expenses");
    await pool.query("DELETE FROM categories");
    await pool.query("DELETE FROM users");

    console.log("✅ Cleared existing data");

    for (const category of categories) {
      await pool.query(
        "INSERT INTO categories (id, name, icon, color) VALUES (?, ?, ?, ?)",
        [category.id, category.name, category.icon, category.color],
      );
    }
    console.log("✅ Seeded categories");

    const users = [
      {
        id: uuidv4(),
        email: "test@test.com",
        name: "Test User",
        password: await bcrypt.hash("123456", 10),
      },
      {
        id: uuidv4(),
        email: "demo@example.com",
        name: "Demo User",
        password: await bcrypt.hash("demo123", 10),
      },
    ];

    for (const user of users) {
      await pool.query(
        "INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)",
        [user.id, user.email, user.name, user.password],
      );
    }
    console.log("✅ Seeded users");

    const testUser = users[0];
    const expenses = [
      {
        id: uuidv4(),
        title: "Grocery Shopping",
        amount: 85.5,
        category_id: categories.find((c) => c.name === "Food")!.id,
        date: new Date("2026-02-03"),
        user_id: testUser.id,
      },
      {
        id: uuidv4(),
        title: "Uber Ride",
        amount: 15.2,
        category_id: categories.find((c) => c.name === "Transport")!.id,
        date: new Date("2026-02-04"),
        user_id: testUser.id,
      },
      {
        id: uuidv4(),
        title: "Netflix Subscription",
        amount: 12.99,
        category_id: categories.find((c) => c.name === "Entertainment")!.id,
        date: new Date("2026-02-01"),
        user_id: testUser.id,
      },
      {
        id: uuidv4(),
        title: "New Shoes",
        amount: 89.99,
        category_id: categories.find((c) => c.name === "Shopping")!.id,
        date: new Date("2026-02-02"),
        user_id: testUser.id,
      },
      {
        id: uuidv4(),
        title: "Electricity Bill",
        amount: 125,
        category_id: categories.find((c) => c.name === "Bills")!.id,
        date: new Date("2026-02-05"),
        user_id: testUser.id,
      },
    ];

    for (const expense of expenses) {
      await pool.query(
        "INSERT INTO expenses (id, title, amount, category_id, date, user_id) VALUES (?, ?, ?, ?, ?, ?)",
        [
          expense.id,
          expense.title,
          expense.amount,
          expense.category_id,
          expense.date,
          expense.user_id,
        ],
      );
    }
    console.log("✅ Seeded expenses");

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 Test accounts:");
    console.log("   Email: test@test.com, Password: 123456");
    console.log("   Email: demo@example.com, Password: demo123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
