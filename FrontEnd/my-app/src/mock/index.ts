import { message } from "antd";
import Mock from "mockjs";

// Mock.mock("https://www.demo.com/login", "post", (options: any) => {
//   const { username, password } = JSON.parse(options.body);
//   console.log(username, password);
//   if (username === "admin" && password === "admin123123") {
//     return {
//       code: 200,
//       message: "Login successful",
//       data: {
//         username: "zhao",
//         token: "mocktoken123456admin",
//       },
//     };
//   } else {
//     return {
//       code: 401,
//       message: "username or password is false",
//     };
//   }
// });
