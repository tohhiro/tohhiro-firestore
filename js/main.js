// Firebase SDKのインポート (v9+ モジュラーSDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
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

const messagesList = document.getElementById("messageList");
// timestampでソートするクエリを作成
const q = query(messagesCol, orderBy("timestamp", "asc"));
onSnapshot(q, (snapshot) => {
  messagesList.innerHTML = "";
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = doc.data().message;
    messagesList.appendChild(li);
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const val = messageInput.value.trim();

  // 空のメッセージは追加しない
  if (!val) return;

  // ドキュメントを追加
  addDoc(messagesCol, {
    message: val,
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
