// Debug utility to directly test the auth API
// You can import this file in a component and call the function to debug your API calls

export async function testLoginAPI(email: string, password: string) {
  try {
    console.log('Testing login API with credentials:', { email, passwordProvided: !!password });

    const response = await fetch('https://demo-hackathon.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('API Response status:', response.status);

    const data = await response.json();
    console.log('API Response data:', data);

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function testRegisterAPI(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  role?: string;
  position?: string;
}) {
  try {
    console.log('Testing register API with data:', userData);

    const response = await fetch('https://demo-hackathon.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('API Response status:', response.status);

    const data = await response.json();
    console.log('API Response data:', data);

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
