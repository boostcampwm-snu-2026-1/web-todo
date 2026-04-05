import express from "express";
import { Todos } from "../models/Todo.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const todos = await Todos.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        // 요청으로 받은 데이터를 이용하여 새로운 todo 생성
        const newTodo = new Todos(req.body);

        // DB에 데이터 저장
        await newTodo.save();
        
        // 새로 생성된 사용자 정보를 응답
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { done } = req.body;
        const updatedTodo = await Todos.findByIdAndUpdate(id, { done }, { returnDocument: 'after' }); // { returnDocument: 'after' } 를 통해 수정 후 데이터 반환

        if (!updatedTodo) return res.status(404).json({ message: "대상을 찾을 수 없습니다." });
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTodo = await Todos.findByIdAndDelete(id);

        if (!deletedTodo) return res.status(404).json({ message: "대상을 찾을 수 없습니다." });
        res.status(200).json({ id: deletedTodo._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;