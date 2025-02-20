import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      token?: string | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    user: {
      id: string | null;
      name: string | null;
      email: string | null;
      token: string | null;
    };
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string | null;
      name: string | null;
      email: string | null;
      token: string | null;
    };
  }
}
