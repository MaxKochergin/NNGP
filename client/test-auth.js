// Простой скрипт для проверки токена
const fs = require('fs');
const readline = require('readline');

// Создаем интерфейс ввода-вывода
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Введите токен из localStorage клиента: ', token => {
  console.log('Выполняем запрос с токеном...');
  const { exec } = require('child_process');
  exec(
    `curl -v -H "Authorization: Bearer ${token}" http://localhost:3000/api/auth/profile`,
    (error, stdout, stderr) => {
      console.log('RESPONSE:');
      console.log(stdout);
      console.log('ERROR OUTPUT:');
      console.log(stderr);
      rl.close();
    }
  );
});
