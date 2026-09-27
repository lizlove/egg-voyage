type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  KIT_API_KEY: string;
  KIT_FORM_ID: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
