import axios from "axios";

const BASE_URL = "https://api-mywalletproject.herokuapp.com";

export function createConfig(token) {
  return { headers: { authorization: `Bearer ${token}` } };
}

export async function signIn(data) {
  try {
    return await axios.post(`${BASE_URL}/`, data);
  } catch (e) {
    console.error(e.response.data);
  }
}

export async function signUp(data) {
  try {
    return await axios.post(`${BASE_URL}/sign-up`, data);
  } catch (e) {
    console.error(e.response.data);
  }
}

export async function signOut(token) {
  try {
    await axios.post(`${BASE_URL}/sign-out`, {}, createConfig(token));
  } catch (e) {
    console.error(e.response.data);
  }
}

export async function getData(token) {
  try {
    return await axios.get(`${BASE_URL}/transactions`, createConfig(token));
  } catch (e) {
    console.error(e.response.data);
  }
}

export async function addEntry(token, data) {
  try {
    return await axios.post(
      `${BASE_URL}/transactions`,
      data,
      createConfig(token)
    );
  } catch (e) {
    console.error(e.response.data);
  }
}

export async function deleteEntry(token, id) {
  try {
    return await axios.delete(
      `${BASE_URL}/transactions/${id}`,
      createConfig(token)
    );
  } catch (e) {
    console.error(e.response.data);
  }
}
