import type { Route } from "./+types/home";
import { useSubmit } from "react-router";
import { redirect } from "react-router";
import { checkUser, logoutUser } from "~/utils/payload-helper";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

/**
 * Loader function for the home route.
 *
 * This function checks if a user is authenticated by calling the `checkUser` function
 * with the provided request. If the user is not authenticated, it redirects to the
 * login page. If the user is authenticated, it returns an object containing the user
 * and a null error.
 *
 * @param {Route.LoaderArgs} args - The arguments containing the request object.
 * @returns {Promise<{ user: any, error: null } | Response>} - An object with the user
 * information and a null error, or a redirect response to the login page.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const user = await checkUser(request);
  if (!user) {
    return redirect("/login");
  }

  // get all users
  const usersResp = await fetch(`${process.env.API_URL}/api/users`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("Cookie") || "",
    },
  });
  const users = await usersResp.json();

  return {
    user,
    allUsers: users || [],
    error: null,
  };
}

/**
 * Handles the logout action for the user.
 *
 * This function performs the following steps:
 * 1. Calls the `logoutUser` function with the provided request to log out the user.
 * 2. If there are any errors in the logout response, it returns the first error message.
 * 3. If the logout is successful, it redirects the user to the login page and clears the authentication cookie.
 *
 * @param {Route.ActionArgs} args - The arguments containing the request object.
 * @returns {Promise<{ error?: string } | Response>} - A promise that resolves to an object containing an error message if there was an error, or a redirect response to the login page.
 */
export async function action({ request }: Route.ActionArgs) {
  const logoutResp = await logoutUser(request);

  if (logoutResp?.errors) {
    return { error: logoutResp.errors[0]?.message };
  } else {
    return redirect("/login", {
      headers: {
        "Set-Cookie":
          "payload-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  }
}

/**
 * Home component displays user information and provides a logout button.
 *
 * @param {Route.ComponentProps} props - The props object containing loaderData.
 * @param {object} props.loaderData - The data loaded for the route.
 * @param {object} props.loaderData.user - The user object containing user details.
 * @param {string} props.loaderData.user.firstName - The first name of the user.
 * @param {string} props.loaderData.user.lastName - The last name of the user.
 * @param {string[]} props.loaderData.user.roles - The roles assigned to the user.
 * @param {string} props.loaderData.user.email - The email address of the user.
 *
 * @returns {JSX.Element} The Home component.
 */
export default function Home({ loaderData }: Route.ComponentProps) {
  const { user, allUsers } = loaderData;
  const submit = useSubmit();
  return (
    <div className="p-8 min-w-3/4 w-[500px] border rounded mx-auto mt-20">
      <h1 className="text-xl">React Router v7 + Payload Auth: Welcome</h1>
      {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      <div className="flex flex-col gap-2 mt-6 mb-6">
        <div>
          <span className="font-bold">Name: </span>
          {user?.firstName} {user?.lastName}
        </div>
        <div>
          <span className="font-bold">Role: </span>
          {user?.roles.flatMap((role: string) => role).join(", ")}
        </div>
        <div>
          <span className="font-bold">Email: </span>
          {user?.email}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-6 mb-6 border rounded p-4">
        <h2 className="text-xl">All Users</h2>
        <ul>
          {allUsers?.docs?.map((user: any) => (
            <li key={user.id}>{user.email}</li>
          ))}
        </ul>
      </div>
      <button
        className="border rounded px-2.5 py-1 w-32 hover:bg-slate-400 hover:text-white"
        onClick={() => submit(null, { method: "POST" })}
      >
        LOGOUT
      </button>
    </div>
  );
}
