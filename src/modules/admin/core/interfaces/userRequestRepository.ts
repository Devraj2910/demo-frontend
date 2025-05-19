import { TUserRequestsResponse, TProcessRequestPayload, TProcessRequestResponse } from '../types/adminTypes';

export interface IUserRequestRepository {
  fetchUserRequests(): Promise<TUserRequestsResponse>;
  processUserRequest(payload: TProcessRequestPayload): Promise<TProcessRequestResponse>;
}
