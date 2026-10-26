import nextJest from "next/jest.js";

// Next.js 설정(tsconfig, 환경변수 등)을 테스트에 연결
const createJestConfig = nextJest({ dir: "./" });

const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // "@/..." 경로를 프로젝트 루트로 연결
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
};

export default createJestConfig(config);
