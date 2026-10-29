export const SITE = {
  name: "Design House",
  legalName: "Design House India Pvt. Ltd.",
  adminTitle: "Design House Admin",
  websiteUrl: "https://www.designhouse.co.in",
  supportEmail: "info@designhouse.co.in",
  logo: "/images/brand/logo.png",
  /** Transparent logo for coloured or photo backgrounds */
  logoMark: "/logobg.png",
} as const;

export const ROUTES = {
  login: "/login",
  dashboard: "/",
  changePassword: "/change-password",
  users: "/users",
  settings: "/settings",
} as const;
