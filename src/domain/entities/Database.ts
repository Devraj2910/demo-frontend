export interface Database {
  name: string;
  owner: string;
  encoding: string;
  collate: string;
  ctype: string;
}

export interface DatabaseResponse {
  success: boolean;
  data: {
    databases: Database[];
  };
} 