import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "@/src/components/TodoForm";

describe("TodoForm - 입력과 1차 검사 (F-01)", () => {
  it('UI-01 제목 "우유 사기"를 입력하고 추가를 누르면 onAdd("우유 사기")가 호출되고 입력칸이 비워진다', async () => {
    const user = userEvent.setup();
    const onAdd = jest.fn().mockResolvedValue(undefined);
    render(<TodoForm onAdd={onAdd} disabled={false} errorMessage={null} />);

    const input = screen.getByLabelText("할 일 제목");
    await user.type(input, "우유 사기");
    await user.click(screen.getByRole("button", { name: "추가" }));

    expect(onAdd).toHaveBeenCalledWith("우유 사기");
    expect(input).toHaveValue("");
  });
});
