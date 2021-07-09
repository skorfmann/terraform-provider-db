export interface ProviderList {
  meta:      Meta;
  providers: Provider[];
}

export interface Meta {
  limit:          number;
  current_offset: number;
  next_offset:    number;
  next_url:       string;
}

export interface Provider {
  id:           string;
  owner:        string;
  namespace:    Namespace;
  name:         string;
  alias:        string;
  version:      string;
  tag:          string;
  description:  string;
  source:       string;
  published_at: Date;
  downloads:    number;
  tier:         Tier;
  logo_url:     string;
}

export enum Namespace {
  Hashicorp = "hashicorp",
}

export enum Tier {
  Official = "official",
}
