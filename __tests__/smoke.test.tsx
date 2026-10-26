import { render, screen } from "@testing-library/react";

// 테스트 환경이 돌아가는지만 확인하는 테스트 (기능 테스트 아님)
describe("테스트 환경", () => {
  it("화면을 그리고 찾을 수 있다", () => {
    render(<p>안녕</p>);
    expect(screen.getByText("안녕")).toBeInTheDocument();
  });
});
