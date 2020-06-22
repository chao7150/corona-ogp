import express from "express";
import * as request from "superagent";
import axios from "axios";
import { TokyoCoronaData } from "./TokyoCoronaData";


async function main() {
  const url = "https://raw.githubusercontent.com/tokyo-metropolitan-gov/covid19/development/data/daily_positive_detail.json"
  const TokyoCoronaDatas = await axios.get<TokyoCoronaData>(url);


  const template = `
<!DOCTYPE HTML>
<html lang="ja">
<head>
  <title>fuga</title>
</head>
<body>piyo</body>
</html>
`;

  const app: express.Express = express();

  // CORSの許可
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  // body-parserに基づいた着信リクエストの解析
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Getのルーティング
  const router: express.Router = express.Router();
  router.get("/", (req: express.Request, res: express.Response) => {
    res.send(TokyoCoronaDatas.data.data.slice(-5).map(datum => `${datum.diagnosed_date.slice(-2)}日: ${datum.count}人`).join(", "));
  });

  app.use(router);

  // 3000番ポートでAPIサーバ起動
  app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
  });

}

main();
