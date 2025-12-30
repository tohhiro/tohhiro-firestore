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
import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase設定を外部ファイルから読み込み
import { firebaseConfig } from "./config.js";

// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let me = null;

// コレクションの参照を取得
const messagesCol = collection(db, "messages");

const messageInput = document.getElementById("message");
const form = document.querySelector("form");

const messagesList = document.getElementById("messageList");

const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");

// timestampでソートするクエリを作成
const q = query(messagesCol, orderBy("timestamp", "asc"));
onSnapshot(q, (snapshot) => {
  messagesList.innerHTML = "";
  snapshot.forEach((doc) => {
    const li = document.createElement("li");
    const data = doc.data();
    li.textContent = data.message + " (by: " + (data.uid || "anonymous") + ")";
    messagesList.appendChild(li);
  });
});

loginButton.addEventListener("click", () => {
  signInAnonymously(auth)
    .then((result) => {
      me = result.user.uid;
      console.log("✅ ログインしました:", me);
    })
    .catch((error) => {
      console.error("❌ サインインエラー:", error);
    });
});

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      me = null;
      console.log("✅ ログアウトしました");
    })
    .catch((error) => {
      console.error("❌ サインアウトエラー:", error);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    // ログイン中
    me = user.uid;
    console.log("✅ ログイン中:", user.uid);
    loginButton.classList.add("hidden");
    [logoutButton, messagesList, form].forEach((el) =>
      el.classList.remove("hidden")
    );
    messageInput.focus();
  } else {
    // ログアウト中
    me = null;
    [logoutButton, messagesList, form].forEach((el) =>
      el.classList.add("hidden")
    );
    console.log("ℹ️ ログアウト中");
    loginButton.classList.remove("hidden");
  }
});

// フォームの送信イベントを処理
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const val = messageInput.value.trim();

  // 空のメッセージは追加しない
  if (!val) return;

  // ドキュメントを追加
  addDoc(messagesCol, {
    message: val,
    timestamp: serverTimestamp(),
    uid: me ?? "anonymous",
  })
    .then((docRef) => {
      console.log(`✅ ドキュメントID: ${docRef.id} に追加しました`);
      messageInput.value = "";
      messageInput.focus();
    })
    .catch((error) => {
      console.error("❌ エラー:", error);
      if (error.code === "permission-denied") {
        alert("ログインが必要です");
      }
    });
});

messageInput.focus();
