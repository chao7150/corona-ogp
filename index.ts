import express from "express";
import * as request from "superagent";
import axios from "axios";
import { TokyoCoronaData } from "./TokyoCoronaData";


async function main() {
  const url = "https://raw.githubusercontent.com/tokyo-metropolitan-gov/covid19/development/data/daily_positive_detail.json"
  const TokyoCoronaDatas = await axios.get<TokyoCoronaData>(url);




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
    const length = req.params.dates ? Number(req.params.dates) : 5; // datesがクエリパラメータから取得できない
    const lines = TokyoCoronaDatas.data.data.slice(-length).map(datum => `${datum.diagnosed_date.slice(-2)}日: ${datum.count}人`);

    const template = `
<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" lang="ja" xml:lang="ja" xmlns:og="http://ogp.me/ns#" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
  <meta property="og:title" content="東京の感染者数"/>
  <meta property="og:type" content="website"/>
  <meta property="og:description" content="${lines.join(", ")}"
  <meta property="og:url" content="https://raw.githubusercontent.com/tokyo-metropolitan-gov/covid19/development/data/daily_positive_detail.json"/>
  <title>fuga</title>
</head>
<body>
    ${lines.join("<br>")}
</body>
</html>
`;

    res.send(template);

  });

  app.use(router);

  // 3000番ポートでAPIサーバ起動
  app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
  });

}

main();
