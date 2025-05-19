export type TUserRequest = {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  permission: string;
  role: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  teamAssignment: {
    id: string;
    userId: string;
    teamId: number;
    effectiveFrom: string;
    effectiveTo: string | null;
  } | null;
  teamName: string | null;
};

export type TUserRequestsResponse = {
  success: boolean;
  data: {
    users: TUserRequest[];
  };
};

export type TProcessRequestPayload = {
  userId: string;
  status: 'approved' | 'declined';
};

export type TProcessRequestResponse = {
  success: boolean;
  message?: string;
};
