export type CloudinaryResource = {
  asset_id: string;
  bytes: number;
  created_at: number;
  folder: string;
  format: string;
  height: number;
  public_id: string;
  resource_type: string;
  secure_url: string;
  type: string;
  url: string;
  version: number;
  width: number;
  tags?: string[];
};

export type CloudinaryAdminResponse = {
  rate_limit_allowed: number;
  rate_limit_remaining: number;
  rate_limit_reset_at: string;
  next_cursor?: string;
  resources: CloudinaryResource[];
};

export type CloudinaryAdminTagsResponse = {
  rate_limit_allowed: number;
  rate_limit_remaining: number;
  rate_limit_reset_at: string;
  tags: string[];
};
