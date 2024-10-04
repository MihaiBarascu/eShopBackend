import path from "path";
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*test.ts"],
  verbose: true,
  forceExit: true,
  //cleanMOcks:true
  setupFiles: [path.join(__dirname, "./jest.setup.ts")],
};

