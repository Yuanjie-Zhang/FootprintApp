const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json()); // 解析 JSON 请求体

// 路由：接收位置信息
app.post('/api/location', (req, res) => {
  console.log('Received location:', req.body);
  res.status(200).send({ message: 'Location received' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
