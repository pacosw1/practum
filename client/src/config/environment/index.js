import axios from "axios";

let inMemoryToken;

// const apiUrl = process.env.REACT_APP_API_URL;

const accessToken = {
  set: (newToken) => {
    inMemoryToken = newToken;
  },
  get: () => inMemoryToken,
};

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export { client, accessToken };
