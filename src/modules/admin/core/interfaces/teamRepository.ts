import { TTeamsResponse, TCreateTeamPayload, TChangeTeamPayload, TTeamActionResponse } from '../types/teamTypes';

export interface ITeamRepository {
  getTeamsWithUsers(): Promise<TTeamsResponse>;
  createTeam(payload: TCreateTeamPayload): Promise<TTeamActionResponse>;
  deleteTeam(id: number): Promise<TTeamActionResponse>;
  changeUserTeam(payload: TChangeTeamPayload): Promise<TTeamActionResponse>;
}
