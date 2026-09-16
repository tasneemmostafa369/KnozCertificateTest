const username = process.env.KNOZ_API_USERNAME;
const password = process.env.KNOZ_API_PASSWORD;

async function run() {
  const loginRes = await fetch('https://knoz-api.knoz.online/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usernameOrEmail: username, password: password, appType: 0 })
  });
  const data = await loginRes.json();
  const token = data?.record?.token;

  const sspId = '123';
  const detailsRes = await fetch(`https://knoz-api.knoz.online/api/Monitor/Assigned-Student-Course-Details?SSPId=${sspId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  console.log("Details status:", detailsRes.status);
  const detailsBody = await detailsRes.text();
  console.log("Details data preview:", detailsBody.substring(0, 50));
}
run();
