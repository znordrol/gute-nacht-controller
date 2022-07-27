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
};

export type CloudinaryAdminResponse = {
  rate_limit_allowed: number;
  rate_limit_remaining: number;
  rate_limit_reset_at: string;
  resources: CloudinaryResource[];
};
