// Firebase SDKのインポート (v9+ モジュラーSDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase設定を外部ファイルから読み込み
import { firebaseConfig } from "./config.js";

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// コレクションの参照を取得
const messagesCol = collection(db, "messages");

const messageInput = document.getElementById("message");
const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // ドキュメントを追加
  addDoc(messagesCol, {
    message: messageInput.value,
    timestamp: serverTimestamp(),
  })
    .then((docRef) => {
      console.log(`✅ ドキュメントID: ${docRef.id} に追加しました`);
      messageInput.value = "";
      messageInput.focus();
    })
    .catch((error) => {
      console.error("❌ エラー:", error);
    });
});

messageInput.focus();
