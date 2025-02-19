import axios from "axios";
import NextAuth, { getServerSession } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
    debug: true, // Enable debug messages in the console if you are having problems
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
                otp: { label: 'OTP', type: 'text', optional: true },
            },
            async authorize(credentials) {
                const { email, password, otp } = credentials || {};
                // IF NEED OTP CODE
                // if (otp) {
                //     // OTP verification via Golang API
                //     try {
                //         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/auth/verify-otp`, { email, otp });
                //         return response.data; // Assuming the API returns user data on success
                //     } catch (error) {
                //         throw new Error('Invalid OTP');
                //     }
                // }

                // Password-based login via Golang API
                try {
                    const url = `${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/auth/login`;
                    console.log(url);
                    const response = await axios.post(url, { 
                        email: email,
                        password: password,
                     }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    return response.data.data; // Assuming the API sends user data on successful OTP initiation
                    // const data = response.data.data;
                    // return {
                    //     accessToken: data.token,
                    //     refreshToken: data.refresh_token, 
                    //     accessTokenExpires: data.token_expires,
                    //     refreshTokenExpires: data.refresh_token_expires,
                    //     user: data.user,
                    // }
                } catch (error: any) {
                    console.log("ERR: ",error);
                    throw new Error(error.response?.data?.message || 'Login failed');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                // token.expires = user.expires;
                // token.accessToken = user.token;
                // token.refreshToken = user.refresh_token;
                // token.user = user.user;
                return {
                    accessToken: user.token,
                    refreshToken: user.refresh_token,
                    accessTokenExpires: user.token_expires,
                    refreshTokenExpires: user.refresh_token_expires,
                    user: user.user,
                };
            }

            if (Date.now() < (token.accessTokenExpires * 1000)) {
                return token;
            }

            // REFRESH TOKEN IF EXPIRES
            // If access token is expired, but refresh token is still valid, refresh it
            if (Date.now() < token.refreshTokenExpires*1000) {
                try {
                console.log("Access token expired. Refreshing...");
                const refreshedToken = await refreshAccessToken(token.refreshToken);

                return {
                    accessToken: refreshedToken.access_token,
                    refreshToken: refreshedToken.refresh_token || token.refreshToken, // Keep old refresh token if API doesn’t send a new one
                    accessTokenExpires: refreshedToken.expires_in,
                    refreshTokenExpires: token.refreshTokenExpires, // Keep the original refresh token expiry
                    user: token.user,
                };
                } catch (error) {
                    console.error("Refresh token failed:", error);
                    return {}; // Clear session on failure
                }
            }
        },
        async session({ session, token }: { session: any; token: any }) {
            if (!token.accessToken) {
                return null; // Clear session when tokens are removed
            }
            session.user = token.user || session.user; // Add user data to session (if present)
            session.accessToken = token.accessToken; // Attach the access token to the session
            session.refreshToken = token.refreshToken;
            session.expires = token.accessTokenExpires;
            return session;
        },
    },
    session: {
        strategy: 'jwt' as 'jwt' | 'database', // Use JWT for sessions
    },
    pages: {
        signIn: '/auth/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}


async function refreshAccessToken(refreshToken: string) {
    // Your custom logic to refresh the token, for example:
    const url = `${process.env.NEXT_PUBLIC_API_CONTAINER}/v1/auth/refresh-token`;
    const response = await axios.post(url, { 
        refresh_token: refreshToken,
     }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const refreshedData = await response.data.data;
    console.log("REFRESHED DATA: ", refreshedData);
    return {
        access_token: refreshedData.token,
        refresh_token: refreshedData.refresh_token,
        expires_in: refreshedData.token_expires,
    };
  }


const handlers = NextAuth(authOptions);

export { handlers as GET, handlers as POST, authOptions }


