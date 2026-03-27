import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);

function toTodoResponse(todo) {
  return {
    id: todo._id.toString(),
    text: todo.text,
    done: todo.done,
  };
}

app.use(cors());
app.use(express.json());

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos.map(toTodoResponse));
  } catch (error) {
    res.status(500).json({ message: "목록 조회에 실패했습니다." });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const text = req.body?.text?.trim();

    if (!text) {
      res.status(400).json({ message: "text는 필수입니다." });
      return;
    }

    const todo = await Todo.create({ text });
    res.status(201).json(toTodoResponse(todo));
  } catch (error) {
    res.status(500).json({ message: "할 일 추가에 실패했습니다." });
  }
});

app.patch("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "잘못된 id입니다." });
      return;
    }

    const updates = {};

    if ("text" in body) {
      const text = String(body.text || "").trim();

      if (!text) {
        res.status(400).json({ message: "text는 비어 있을 수 없습니다." });
        return;
      }

      updates.text = text;
    }

    if ("done" in body) {
      updates.done = Boolean(body.done);
    }

    if (!Object.keys(updates).length) {
      res.status(400).json({ message: "수정할 값이 없습니다." });
      return;
    }

    const todo = await Todo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
      return;
    }

    res.json(toTodoResponse(todo));
  } catch (error) {
    res.status(500).json({ message: "할 일 수정에 실패했습니다." });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "잘못된 id입니다." });
      return;
    }

    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      res.status(404).json({ message: "할 일을 찾을 수 없습니다." });
      return;
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "할 일 삭제에 실패했습니다." });
  }
});

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`server started on ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed");
    process.exit(1);
  });
