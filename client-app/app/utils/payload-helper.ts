/**
 * Asynchronously checks the current user by making a request to the API.
 *
 * @param {Request} request - The incoming request object containing headers.
 * @returns {Promise<any>} A promise that resolves to the user object if the request is successful.
 *
 * @throws {Error} Throws an error if the fetch request fails or the response cannot be parsed as JSON.
 */
export const checkUser = async (request: Request) => {
  const resp = await fetch(`${process.env.API_URL}/api/users/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  const user = await resp.json();
  return user?.user;
};

/**
 * Logs in a user by sending a POST request to the login API endpoint.
 *
 * @param {Request} request - The request object.
 * @param {Object} data - The login data.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's password.
 * @returns {Promise<any>} The response from the API as a JSON object.
 */
export const loginUser = async (
  request: Request,
  data: { email: string; password: string }
) => {
  const resp = await fetch(`${process.env.API_URL}/api/users/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await resp.json();
};

/**
 * Logs out the current user by making a POST request to the logout endpoint.
 *
 * @param {Request} request - The request object containing the user's cookies.
 * @returns {Promise<any>} A promise that resolves to the response JSON.
 */
export const logoutUser = async (request: Request) => {
  const resp = await fetch(`${process.env.API_URL}/api/users/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  return await resp.json();
};

/**
 * Creates a new user by sending a POST request to the API.
 *
 * @param email - The email address of the new user.
 * @param password - The password for the new user.
 * @param firstName - The first name of the new user.
 * @param lastName - The last name of the new user.
 * @returns A promise that resolves to the response JSON object.
 */
export const createUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const resp = await fetch(`${process.env.API_URL}/api/users`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  return await resp.json();
};
