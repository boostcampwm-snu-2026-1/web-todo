import mongoose from "mongoose";

// todo 스키마
const todoSchema = new mongoose.Schema({
    content: { type: String, required: true },
    done: { type: Boolean, default: false },
});

// id라는 가상의 컬럼 추가. JSON 타입으로 변경할 때 _id 값을 그대로 보여줌
todoSchema.virtual('id').get(function() {
  return this._id.toHexString();
}); 
todoSchema.set('toJSON', { virtuals: true }) 

export const Todos = mongoose.model("Todos", todoSchema);