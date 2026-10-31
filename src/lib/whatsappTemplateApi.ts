import { api } from "./api";

export type WhatsAppTemplateType = "contact" | "booking" | "career";

export interface TemplatePlaceholder {
  key: string;
  description: string;
}

// WhatsApp message sent to a visitor (via Opus) after they submit a website form
export interface WhatsAppTemplate {
  formType: WhatsAppTemplateType;
  label: string;
  usedOn: string;
  sentTo: string;
  placeholders: TemplatePlaceholder[];
  whatsappBody: string;
  defaultBody: string;
  isCustomised: boolean;
  updatedBy: string;
  updatedAt: string | null;
}

export const whatsappTemplateApi = {
  list: () => api.get<WhatsAppTemplate[]>("/whatsapp-templates"),
  update: (formType: WhatsAppTemplateType, whatsappBody: string, updatedBy?: string) =>
    api.put<WhatsAppTemplate>(`/whatsapp-templates/${formType}`, { whatsappBody, updatedBy }),
  reset: (formType: WhatsAppTemplateType, updatedBy?: string) =>
    api.post<WhatsAppTemplate>(`/whatsapp-templates/${formType}/reset`, { updatedBy }),
};
