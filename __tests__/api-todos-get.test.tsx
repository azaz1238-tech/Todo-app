/**
 * @jest-environment node
 */
// API-01: 서버(FastAPI)에 실제로 요청을 보내 확인한다. (브라우저 환경이 아니라 node 환경)
const API_URL = process.env.API_URL ?? "http://localhost:8000";

describe("GET /api/todos - 목록 조회 (F-02)", () => {
  it("API-01 할 일이 하나도 없으면 200과 빈 배열을 돌려준다", async () => {
    const res = await fetch(`${API_URL}/api/todos`);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});
