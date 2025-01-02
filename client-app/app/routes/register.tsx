/**
 * Registration route for user sign-up.
 *
 * This module handles user registration by processing form data,
 * validating input, and creating a new user session upon successful registration.
 *
 * @module register
 */

import { Form, Link, redirect, type MetaFunction } from "react-router";
import type { Route } from "./+types/register";
import { z } from "zod";
import { checkUser, createUser, loginUser } from "~/utils/payload-helper";

// Define the schema for registration validation
const RegisterSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
});

/**
 * Meta function for setting the page metadata.
 *
 * @returns {Array<{ title: string, name?: string, content?: string }>} Metadata for the page.
 */
export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

/**
 * Loader function to check if the user is already logged in.
 *
 * @param {Route.LoaderArgs} args - The loader arguments containing the request.
 * @returns {Promise<{ user: null, error: null }>} An object indicating no user is logged in.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const user = await checkUser(request);

  if (user) {
    // If the user is already logged in, redirect them to the home page
    return redirect("/");
  }

  return { user: null, error: null };
}

/**
 * Handles the action for user registration.
 *
 * @param {Route.ActionArgs} args - The action arguments containing the request.
 * @returns {Promise<{ error?: string, user?: any }>} An object containing an error message if validation fails.
 */
export async function action({ request }: Route.ActionArgs) {
  let response: Response;
  try {
    const formData = await request.formData();

    const parsed = RegisterSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { error: "Invalid form data" };
    }

    const registerResp = await createUser(
      parsed.data.email,
      parsed.data.password,
      parsed.data.firstName,
      parsed.data.lastName
    );

    if (registerResp?.errors) {
      throw Error(registerResp.errors[0]?.message);
    }

    const loginResp = await loginUser(request, {
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (loginResp?.errors) {
      throw Error(loginResp.errors[0]?.message);
    } else if (loginResp?.user) {
      return redirect("/", {
        headers: {
          "Set-Cookie": `payload-token=${
            loginResp?.token
          }; path=/; expires=${new Date(loginResp?.expires).toUTCString()}`,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }
}

/**
 * Renders the registration form.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.actionData - Data returned from the action function.
 * @returns {JSX.Element} The registration form component.
 */
export default function Register({ actionData }: Route.ComponentProps) {
  return (
    <div className="p-8 min-w-3/4 w-[500px] border rounded mx-auto mt-20">
      <h1 className="text-xl">React Router v7 + Payload Auth: Register</h1>
      <Form method="post" className="mt-6 ">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="min-w-24 ">First:</label>
            <input
              className="flex-1 p-1"
              type="text"
              name="firstName"
              autoComplete="off"
              aria-autocomplete="none"
              autoSave="off"
            />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Last:</label>
            <input
              className="flex-1 p-1"
              type="text"
              name="lastName"
              autoComplete="off"
              aria-autocomplete="none"
              autoSave="off"
            />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Email:</label>
            <input
              className="flex-1 p-1"
              type="email"
              name="email"
              autoComplete="off"
              aria-autocomplete="none"
              autoSave="off"
            />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Password:</label>
            <input
              className="flex-1 p-1"
              type="password"
              name="password"
              autoComplete="off"
              aria-autocomplete="none"
              autoSave="off"
            />
          </div>
          <div className="flex flex-row-reverse mt-4 gap-4">
            <button
              type="submit"
              className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
            >
              Register User
            </button>
            <Link to="/login">
              <button
                type="button"
                className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
              >
                Go Back
              </button>
            </Link>
          </div>
          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
