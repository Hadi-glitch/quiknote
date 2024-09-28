"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Github } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  createUser,
  getUser,
  getUserId,
} from "@/lib/database/actions/user.actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AuthPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState();

  const fetchUserId = async (email) => {
    const userId = await getUserId(email);
    console.log(userId);
    setUserId(userId);

    return userId;
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries());

    if (action === "signup" && userData.password !== userData.confirmPassword) {
      setIsPassword(true);
      setIsLoading(false);
      return;
    }

    if (action === "signup") {
      await createAccount(userData);
    } else if (action === "signin") {
      await signInWithEmail(userData);
    }

    setIsLoading(false);
  };

  const createAccount = async (userData) => {
    try {
      delete userData.confirmPassword;
      console.log("Signing up:", userData);
      await createUser(userData);
      const userId = await fetchUserId(userData.email);

      const user = await getUser(userId);
      setUser(user);
      console.log(user);
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setMessage("Error creating account");
    }
  };

  const signInWithEmail = async (userData) => {
    try {
      const userId = await fetchUserId(userData.email);

      const user = await getUser(userId);
      setUser(user);
      console.log("Signing in with email:", userData.email);
      console.log(user);
      if (user.email !== userData.email) {
        setCheckEmail("Email does not match.");
        setIsLoading(false);
        return;
      }
      if (user.password !== userData.password) {
        setCheckPassword("Password does not match.");
        setIsLoading(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setMessage("Invalid email or password");
    }
  };

  useEffect(() => {
    const getSessionData = async () => {
      if (session) {
        const userData = {
          email: session.user.email,
          username: session.user.name,
          userId: session.user.id,
        };

        // Get stored user from localStorage
        const storedUser = localStorage.getItem("user");

        // If there's no stored user or the stored user data doesn't match, update localStorage
        if (storedUser) {
          const parsedStoredUser = JSON.parse(storedUser);

          // Check if the stored user matches the current user data
          if (
            parsedStoredUser.email === userData.email &&
            parsedStoredUser.username === userData.username
          ) {
            // User exists, redirect to dashboard
            router.push(`/dashboard/${parsedStoredUser.userId}`);
            return; // Stop further execution
          }
        }

        // If the user doesn't exist in localStorage, save the user data
        localStorage.setItem("user", JSON.stringify(userData));

        // Retrieve the stored user data and redirect
        const newStoredUser = JSON.parse(localStorage.getItem("user"));
        if (newStoredUser) {
          router.push(`/dashboard/${newStoredUser.userId}`);
        }
      }
    };

    getSessionData();
  }, [session, router]);

  const handleSocialSignIn = async (provider) => {
    await signIn(provider);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center mb-8 gap-2">
        <Image src='/icons/logo.png' alt="logo" width={40} height={40} />
        <h1 className="text-3xl font-bold text-primary">Quiknote</h1>
      </div>
      <Tabs defaultValue="signin" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back to Quiknote</CardTitle>
              <CardDescription>
                Enter your details to sign in to your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, "signin")}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={() => setMessage("")}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      onChange={() => setMessage("")}
                      required
                    />
                  </div>
                  {message && <p className="text-sm text-red-500">{message}</p>}
                </div>
                <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignIn("github")}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
              <a href="#" className="text-sm text-primary hover:underline">
                Need help?
              </a>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create a Quiknote account</CardTitle>
              <CardDescription>
                Enter your details to get started with Quiknote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, "signup")}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      placeholder="JohnDoe123"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      onChange={() => setIsPassword(false)}
                      required
                    />
                  </div>
                  {isPassword && (
                    <div className="text-red-600">Passwords do not match</div>
                  )}
                  {message && <p className="text-sm text-red-500">{message}</p>}
                </div>
                <Button
                  className="w-full mt-6"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading && isPassword
                    ? "Creating account..."
                    : "Create Account"}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or sign up with
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialSignIn("github")}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground text-center w-full">
                By signing up, you agree to Quiknote's{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
