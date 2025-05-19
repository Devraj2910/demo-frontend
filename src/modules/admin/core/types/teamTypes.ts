export type TTeam = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TTeamUser = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  permission: string;
  role: string;
  position: string;
  createdAt: string;
  updatedAt: string;
};

export type TTeamWithUsers = {
  team: TTeam;
  users: TTeamUser[];
};

export type TTeamsResponse = {
  success: boolean;
  data: {
    teams: TTeamWithUsers[];
  };
};

export type TCreateTeamPayload = {
  name: string;
};

export type TChangeTeamPayload = {
  userId: string;
  teamId: string | number;
};

export type TTeamActionResponse = {
  success: boolean;
  message?: string;
  data?: TTeam;
};
