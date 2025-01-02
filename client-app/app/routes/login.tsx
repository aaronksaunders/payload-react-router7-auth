import { Form, Link, redirect, type MetaFunction } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/login";
import { checkUser, loginUser } from "~/utils/payload-helper";

const LoginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(6),
});

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

/**
 * Loader function for the login route.
 *
 * This function checks if a user is already logged in. If the user is logged in,
 * it redirects them to the home page. If the user is not logged in, it returns
 * an object with `user` set to `null` and `error` set to `null`.
 *
 * @param {Route.LoaderArgs} args - The arguments passed to the loader function.
 * @param {Request} args.request - The request object.
 * @returns {Promise<{ user: null, error: null } | Response>} - A promise that resolves to an object with user and error properties, or a redirect response.
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
 * Handles the login action for the login route.
 *
 * @param {Route.ActionArgs} args - The arguments for the action, including the request object.
 * @returns {Promise<{ error?: string } | Response>} - Returns an object with an error message if the login fails,
 * or a redirect response with a set cookie header if the login is successful.
 *
 * @throws {Error} - Throws an error if an unknown error occurs during the login process.
 */
export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const result = LoginSchema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return { error: "Invalid form data" };
    }

    const loginResp = await loginUser(request, result.data);

    if (loginResp?.errors) {
      return { error: loginResp.errors[0]?.message };
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
    console.error("login action error", error);
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }
}

/**
 * The `Login` component renders a login form for user authentication.
 * It includes fields for email and password, and buttons for submitting the form
 * and navigating to the registration page.
 *
 * @param {Route.ComponentProps} props - The props object containing `actionData`.
 * @param {object} props.actionData - The data object that may contain an error message.
 * @param {string} [props.actionData.error] - An optional error message to display if login fails.
 *
 * @returns {JSX.Element} The rendered login form component.
 */
export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="p-8 min-w-3/4 w-[500px] border rounded mx-auto mt-20">
      <h1 className="text-xl">React Router v7 + Payload Auth: Login</h1>
      <Form method="post" className="mt-6 ">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="min-w-24 ">Email:</label>
            <input className="flex-1 p-1" type="email" name="email" />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Password:</label>
            <input className="flex-1 p-1" type="password" name="password" />
          </div>
          <div className="flex flex-row-reverse mt-4 gap-4">
            <button
              type="submit"
              className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
            >
              Login
            </button>
            <Link to="/register">
              <button
                type="submit"
                className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
              >
                Register
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
