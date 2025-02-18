import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       image?: string;
//       role?: string;
//     }
//     accessToken: string;
//     refreshToken: string;
//     expires: number;
//   }
//   interface JWT {
//     accessToken: string; // Add your custom fields to the JWT
//     refreshToken: string;
//     expires: number;
//   }
// }


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
    accessToken: string;
    refreshToken: string;
    expires: number; // Expiration timestamp for the access token
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  }
}
