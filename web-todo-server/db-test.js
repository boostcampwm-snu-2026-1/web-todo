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

function parseOptionalCompletedArg(rawCompleted) {
  if (rawCompleted === undefined) return undefined;

  const value = String(rawCompleted).toLowerCase();
  if (value === "true") return true;
  if (value === "false") return false;

  return undefined;
}


function parsePostArgs(args) {
  if (!Array.isArray(args) || args.length === 0) {
    return { content: "", completedArg: undefined };
  }

  const maybeCompleted = parseOptionalCompletedArg(args[args.length - 1]);
  if (maybeCompleted !== undefined) {
    return {
      content: args.slice(0, -1).join(" "),
      completedArg: args[args.length - 1],
    };
  }

  return {
    content: args.join(" "),
    completedArg: undefined,
  };
}

function parsePutArgs(args) {
  if (!Array.isArray(args) || args.length === 0) {
    return {
      contentArg: undefined,
      completedArg: undefined,
    };
  }

  const maybeLastCompleted = parseOptionalCompletedArg(args[args.length - 1]);

  if (args.length === 1 && maybeLastCompleted !== undefined) {
    return {
      contentArg: undefined,
      completedArg: args[0],
    };
  }

  if (maybeLastCompleted !== undefined) {
    return {
      contentArg: args.slice(0, -1).join(" "),
      completedArg: args[args.length - 1],
    };
  }

  return {
    contentArg: args.join(" "),
    completedArg: undefined,
  };
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

async function updateTodo(id, contentArg, completedArg) {
  if (!id) {
    throw new Error("id is required for put command");
  }

  const updatePayload = {};

  if (contentArg !== undefined) {
    const trimmedContent = contentArg.trim();
    if (!trimmedContent) {
      throw new Error("content cannot be empty");
    }
    updatePayload.content = trimmedContent;
  }

  const completed = parseOptionalCompletedArg(completedArg);
  if (completed !== undefined) {
    updatePayload.completed = completed;
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new Error("put requires at least content or completed argument");
  }

  updatePayload.updatedAt = new Date();

  const updated = await Todo.findByIdAndUpdate(id, updatePayload, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updated) {
    throw new Error(`todo not found for id: ${id}`);
  }

  console.log("✅ updated todo");
  console.log(JSON.stringify(serializeTodo(updated), null, 2));
}

async function removeTodo(id) {
  if (!id) {
    throw new Error("id is required for delete command");
  }

  const deleted = await Todo.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error(`todo not found for id: ${id}`);
  }

  console.log("✅ deleted todo");
  console.log(JSON.stringify(serializeTodo(deleted), null, 2));
}


async function resetTodos() {
  const result = await Todo.deleteMany({});

  console.log("✅ reset completed");
  console.log(`deletedCount: ${result.deletedCount}`);
}

function printUsage() {
  console.log("Usage:");
  console.log("  npm run test -- get");
  console.log('  npm run test -- post "todo content" [true|false]');
  console.log('  npm run test -- put <id> ["new content"] [true|false]');
  console.log("  npm run test -- delete <id>");
  console.log("  npm run test -- reset");
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
      const postArgs = process.argv.slice(3);
      const { content, completedArg } = parsePostArgs(postArgs);
      await createTodo(content, completedArg);
      return;
    }

    if (command === "put") {
      const id = process.argv[3];
      const putArgs = process.argv.slice(4);
      const { contentArg, completedArg } = parsePutArgs(putArgs);

      await updateTodo(id, contentArg, completedArg);
      return;
    }

    if (command === "delete") {
      const id = process.argv[3];
      await removeTodo(id);
      return;
    }

    if (command === "reset") {
      await resetTodos();
      return;
    }

    printUsage();
  } finally {
    await disconnectDatabase();
  }
}

main().catch((error) => {
  console.error("❌ failed:", error.message);
  process.exit(1);
});
