import "dotenv/config";
import mongoose from "mongoose";

const URI = process.env.URI;

if (!URI) {
  console.error("❌ URI is missing. Please set URI in .env");
  process.exit(1);
}

const todoSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

todoSchema.pre("save", function updateTimestamp() {
  this.updatedAt = new Date();
});

const Todo = mongoose.model("Todo", todoSchema);

function serializeTodo(doc) {
  const plain = typeof doc.toObject === "function" ? doc.toObject() : doc;

  return {
    id: String(plain._id),
    content: plain.content,
    completed: Boolean(plain.completed),
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
}


function parseCompletedArg(rawCompleted) {
  if (rawCompleted === undefined) return false;

  const value = String(rawCompleted).toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;

  return false;
}

async function connectDatabase() {
  try {
    await mongoose.connect(URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

async function getTodos() {
  const todos = await Todo.find().sort({ createdAt: -1 }).lean();
  const serialized = todos.map(serializeTodo);

  console.log(`📋 todos (${serialized.length})`);
  console.log(JSON.stringify(serialized, null, 2));
}

async function createTodo(content, completedArg) {
  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error("content is required");
  }

  const completed = parseCompletedArg(completedArg);
  const created = await Todo.create({ content: trimmedContent, completed });
  console.log("✅ created todo");
  console.log(JSON.stringify(serializeTodo(created), null, 2));
}

async function main() {
  const command = process.argv[2];

  await connectDatabase();

  try {
    if (command === "get") {
      await getTodos();
      return;
    }

    if (command === "post") {
      const content = process.argv[3] ?? "";
      const completedArg = process.argv[4];
      await createTodo(content, completedArg);
      return;
    }

    console.log("Usage:");
    console.log("  node db-test.js get");
    console.log('  node db-test.js post "todo content" [true|false]');
  } finally {
    await disconnectDatabase();
  }
}

main().catch((error) => {
  console.error("❌ failed:", error.message);
  process.exit(1);
});
