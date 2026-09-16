const username = process.env.KNOZ_API_USERNAME;
const password = process.env.KNOZ_API_PASSWORD;

async function run() {
  const loginRes = await fetch('https://knoz-api.knoz.online/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: username, password: password, appType: 0 })
  });
  console.log("Login status:", loginRes.status);
  const data = await loginRes.text();
  console.log("Login data preview:", data.substring(0, 50));
}
run();
