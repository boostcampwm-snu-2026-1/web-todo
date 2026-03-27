import express from "express"; 
import cors from "cors";
import mongoose from "mongoose"; 
import dotenv from "dotenv"

dotenv.config(); // .env 파일에 적어둔 비밀번호를 읽어오기 위한 설정

const app = express();
const port = 3000;

app.use(cors()); // CORS 문제 해결 (프론트엔드 요청 허용)
app.use(express.json()); // 클라이언트가 보낸 JSON 데이터를 이해할 수 있게 해줌

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB 연결 성공!"))
  .catch((err) => console.log("❌ MongoDB 연결 실패:", err));

// 1. Todo 데이터의 규칙(Schema) 정의
const todoSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 할 일 내용 (문자열, 필수입력)
  completed: { type: Boolean, default: false } // 완료 여부 (불리언, 기본값은 false)
});

// 2. 규칙을 바탕으로 실제 DB와 소통할 '모델(Model)' 생성
const Todo = mongoose.model('Todo', todoSchema);

// API 만들기
// '이런 패턴의 URL 요청이 오면 뒤에 적어둔 함수를 실행해줘' 라고 EXPRESS에게 라우팅 규칙을 등록해주는 것
// ==============================================================
// 1. 할 일 목록 불러오기 (GET API)
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find(); // DB에서 모든 할 일 데이터 꺼내오기
    
    // MongoDB는 고유번호를 '_id'로 저장하지만, 프론트엔드 코드에서는 'id'로 찾기 때문에 이름을 살짝 바꿔야 함.
    const formattedTodos = todos.map(todo => ({
      id: todo._id,
      name: todo.name,
      completed: todo.completed
    }));

    res.status(200).json(formattedTodos); // 프론트엔드로 데이터 전송
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "데이터를 불러오는데 실패했습니다." });
  }
});

// 2. 할 일 추가하기 (POST API)
app.post('/todos', async (req, res) => {
  try {
    // 프론트엔드에서 보낸 데이터(req.body)를 바탕으로 새로운 Todo 덩어리 만들기
    const newTodo = new Todo({
      name: req.body.name,
      completed: req.body.completed
    });

    const savedTodo = await newTodo.save(); // DB에 영구 저장
    
    res.status(201).json({
      id: savedTodo._id,
      name: savedTodo.name,
      completed: savedTodo.completed
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "할 일 추가에 실패했습니다." });
  }
});

// 3. 할 일 삭제하기 (DELETE API)
// :id는 이 자리에 들어오는 값은 무조건 id라는 이름의 변수로 취급하겠다는 뜻의 자리 표시자(placeholder) 역할
app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id; // Express는 주소의 id를 추출해서 req객체 안의 params라는 공간에 {id: '000' 형태로 담아줌}
    
    // DB에서 해당 id를 찾아 삭제하는 Mongoose의 기능
    await Todo.findByIdAndDelete(todoId); 
    
    res.status(200).json({ message: "할 일이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "삭제 중 오류가 발생했습니다." });
  }
});

// 4. 할 일 상태 수정하기 (PUT API)
app.put('/todos/:id', async (req, res) => { 
  try {
    const todoId = req.params.id; // URL에서 id를 뽑아오고
    const isCompleted = req.body.completed; // 프론트엔드가 편지봉투(body)에 담아 보낸 완료 여부를 꺼냅니다.

    // DB에서 id를 찾아 'completed' 항목을 전달받은 값으로 업데이트합니다.
    await Todo.findByIdAndUpdate(todoId, { completed: isCompleted });

    res.status(200).json({ message: "상태가 성공적으로 수정되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "수정 중 오류가 발생했습니다." });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});