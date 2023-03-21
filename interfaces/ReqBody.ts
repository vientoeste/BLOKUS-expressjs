// /POST auth/signIn
export interface SignInRequestBody {
  id: string;
  password: string;
}

// POST /users
export interface CreateUserRequestBody {
  id: string;
  password: string;
}

// POST /games
export interface CreateGameRequestBody {
  title: string;
  password?: string;
  maxParticipants: number;
  // [TODO] enable with rank system
  // isRankGame: boolean;
  // minGrade: string;
  // maxGrade: string;
}

// PUT /games/:game_uuid
export interface UpdateGameRequestBody {
  title: string;
  password: string;
  maxParticipants: number;
  // [TODO] enable with rank system
  // isRankGame: boolean;
  // minGrade: string;
  // maxGrade: string;
}
