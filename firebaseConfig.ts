// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'; 

const firebaseConfig = {
  apiKey: "AIzaSyDwlUyLk6zYl9nLxZhuJL2h3JEjk9oHfJo",
  authDomain: "footprint-5c29f.firebaseapp.com",
  projectId: "footprint-5c29f",
  storageBucket: "footprint-5c29f.appspot.com", // ✅ 修正这里
  messagingSenderId: "44473616869",
  appId: "1:44473616869:web:dbb95a0cab40ce64e9470c",
  measurementId: "G-LLVZ6QXLPJ",
  databaseURL: "https://footprint-5c29f-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app); // ✅ 初始化数据库实例

export { db };
