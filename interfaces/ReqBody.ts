// /auth/signIn
export interface SignInRequestBody {
  id: string;
  password: string;
}

// /users
export interface CreateUserRequestBody {
  id: string;
  password: string;
}
