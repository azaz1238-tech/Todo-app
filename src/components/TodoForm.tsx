"use client";

import { useState, type FormEvent } from "react";

// disabled, errorMessage는 명세(COMPONENT_SPEC)대로 선언만 해 두고, 해당 테스트 때 사용한다
type TodoFormProps = {
  onAdd: (title: string) => Promise<void>;
  disabled: boolean;
  errorMessage: string | null;
};

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");

  // 추가 버튼을 누르면 부모에 제목을 넘기고, 성공하면 입력칸을 비운다
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onAdd(title);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="todo-title">할 일 제목</label>
      <input
        id="todo-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">추가</button>
    </form>
  );
}
