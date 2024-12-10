// Функція для шифрування даних
function encryptData(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

// Функція для дешифрування даних
function decryptData(encryptedData, key) {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Функція для отримання масиву користувачів із Local Storage
function getUsers() {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
}

// Функція для збереження користувачів у Local Storage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Логіка реєстрації користувача
const authForm = document.getElementById("auth-form");
if (authForm) {
  authForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Логіка перевірки адміністратора
    if (username === "admin" && password === "admin123") {
      sessionStorage.setItem("isAdmin", "true");
      window.location.href = "admin.html";
      return;
    }

    // Шифруємо пароль
    const encryptedPassword = encryptData(password, "my-secret-key");

    // Отримуємо поточний список користувачів
    const users = getUsers();

    // Додаємо нового користувача
    users.push({ username, password: encryptedPassword });

    // Зберігаємо список користувачів
    saveUsers(users);

    // Перенаправляємо на сторінку користувача
    window.location.href = "user.html";
  });
}

// Логіка для відображення користувачів на сторінці адміністратора
const usersTable = document.getElementById("users-table");
if (usersTable) {
  window.addEventListener("load", function () {
    // Перевірка доступу адміністратора
    if (!sessionStorage.getItem("isAdmin")) {
      alert("Доступ заборонено!");
      window.location.href = "index.html";
      return;
    }

    // Отримуємо дані з Local Storage
    const users = getUsers();

    // Відображаємо користувачів у таблиці
    const usersTableBody = usersTable.getElementsByTagName("tbody")[0];

    users.forEach(user => {
      const newRow = usersTableBody.insertRow();
      newRow.insertCell(0).textContent = user.username;
      newRow.insertCell(1).textContent = decryptData(user.password, "my-secret-key");
    });
  });
}
