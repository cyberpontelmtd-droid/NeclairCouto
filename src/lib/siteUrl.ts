export function siteUrl() {
  return process.env.NEXTAUTH_URL ?? "https://neclaircouto.com.br";
}

export function labelVinculoUrl(code: string) {
  return `${siteUrl()}/admin/etiquetas/vincular/${code}`;
}
