
async function testOTP() {
  console.log('Testing Send OTP...');
  try {
    const resp = await fetch('http://127.0.0.1:4000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const data = await resp.json();
    console.log('OTP Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
}
testOTP();
