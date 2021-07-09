export interface Provider {
  id:           string;
  owner:        string;
  namespace:    string;
  name:         string;
  alias:        string;
  version:      string;
  tag:          string;
  description:  string;
  source:       string;
  published_at: Date;
  downloads:    number;
  tier:         string;
  logo_url:     string;
  versions:     string[];
  docs:         Doc[];
}

export interface Doc {
  id:          string;
  title:       string;
  path:        string;
  slug:        string;
  category:    string;
  subcategory: string;
}
