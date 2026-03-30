import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MONGO_URI = process.env.URI;
if (!MONGO_URI) {
  console.error("URI is missing. Set it in .env.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

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
  },
  {
    timestamps: true,
    versionKey: false
  }
);

const Todo = mongoose.model("Todo", todoSchema);

function serializeTodo(todoDoc) {
  return {
    id: String(todoDoc._id),
    content: todoDoc.content,
    completed: todoDoc.completed,
    createdAt: todoDoc.createdAt,
    updatedAt: todoDoc.updatedAt,
  };
}

function sendError(res, status, code, message, details) {
  const payload = {
    ok: false,
    error: {
      code,
      message,
    },
  };

  if (details) {
    payload.error.details = details;
  }

  return res.status(status).json(payload);
}

function parseContent(raw) {
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

app.get("/", (req, res) => {
  res.json({
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: 1 });
    return res.json(todos.map(serializeTodo));
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to fetch todos.");
  }
});

app.post("/todos", async (req, res) => {
  try {
    const content = parseContent(req.body?.content);
    const completed = req.body?.completed;

    if (!content) {
      return sendError(res, 400, "INVALID_CONTENT", "content must be a non-empty string.");
    }

    let normalizedCompleted = false;
    if (typeof completed !== "undefined") {
      if (typeof completed !== "boolean") {
        return sendError(res, 400, "INVALID_COMPLETED", "completed must be boolean.");
      }
      normalizedCompleted = completed;
    }

    const created = await Todo.create({
      content,
      completed: normalizedCompleted,
    });

    return res.status(201).json(serializeTodo(created));
  } catch (error) {
    console.error("Failed to create todo:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to create todo.");
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return sendError(res, 400, "INVALID_ID", "Invalid todo id format.");
    }

    const update = {};

    if (typeof req.body?.content !== "undefined") {
      const parsedContent = parseContent(req.body.content);
      if (!parsedContent) {
        return sendError(res, 400, "INVALID_CONTENT", "content must be a non-empty string.");
      }
      update.content = parsedContent;
    }

    if (typeof req.body?.completed !== "undefined") {
      if (typeof req.body.completed !== "boolean") {
        return sendError(res, 400, "INVALID_COMPLETED", "completed must be boolean.");
      }
      update.completed = req.body.completed;
    }

    if (Object.keys(update).length === 0) {
      return sendError(
        res,
        400,
        "EMPTY_UPDATE",
        "At least one of content or completed is required for update."
      );
    }

    const updated = await Todo.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return sendError(res, 404, "TODO_NOT_FOUND", "Todo not found.");
    }

    return res.json(serializeTodo(updated));
  } catch (error) {
    console.error("Failed to update todo:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to update todo.");
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return sendError(res, 400, "INVALID_ID", "Invalid todo id format.");
    }

    const deleted = await Todo.findByIdAndDelete(id);

    if (!deleted) {
      return sendError(res, 404, "TODO_NOT_FOUND", "Todo not found.");
    }

    return res.json({ ok: true, deletedId: id });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to delete todo.");
  }
});

app.delete("/todos", async (req, res) => {
  try {
    const result = await Todo.deleteMany({});
    return res.json({ ok: true, deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Failed to reset todos:", error);
    return sendError(res, 500, "INTERNAL_ERROR", "Failed to reset todos.");
  }
});

app.use((req, res) => {
  return sendError(res, 404, "NOT_FOUND", "Route not found.");
});

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected (${mongoose.connection.name})`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
}

async function bootstrap() {
  try {
    await connectToMongoDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("SIGINT", async () => {
  console.log("\nSIGINT received. Closing MongoDB connection...");
  await mongoose.disconnect();
  console.log("MongoDB disconnected. Bye.");
  process.exit(0);
});

bootstrap();
