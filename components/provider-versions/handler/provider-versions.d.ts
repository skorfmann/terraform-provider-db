export interface ProviderVersions {
  id:       string;
  versions: Version[];
  warnings: null;
}

export interface Version {
  version:   string;
  protocols: string[];
  platforms: Platform[];
}

export interface Platform {
  os:   OS;
  arch: string;
}

export enum OS {
  Darwin = "darwin",
  Freebsd = "freebsd",
  Linux = "linux",
  Openbsd = "openbsd",
  Solaris = "solaris",
  Windows = "windows",
}
