import type { MockRoute } from "./http";
import { blogRoutes } from "./handlers/blogs";
import { careerRoutes } from "./handlers/careers";
import { chatbotRoutes } from "./handlers/chatbot";
import { contentRoutes } from "./handlers/content";
import { coreRoutes } from "./handlers/core";
import { infrastructureRoutes } from "./handlers/infrastructure";
import { leadRoutes } from "./handlers/leads";
import { securityRoutes } from "./handlers/security";
import { seoRoutes } from "./handlers/seo";
import { systemRoutes } from "./handlers/system";

/** Endpoints that need a specific answer (not plain list CRUD). Checked in order, before the collections. */
export const ROUTES: MockRoute[] = [...coreRoutes, ...chatbotRoutes, ...securityRoutes, ...leadRoutes, ...contentRoutes, ...careerRoutes, ...infrastructureRoutes, ...seoRoutes, ...systemRoutes, ...blogRoutes];
