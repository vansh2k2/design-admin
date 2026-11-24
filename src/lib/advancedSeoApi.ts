import { api } from "./api";

export interface SeoFile {
  _id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileType: string;
  size: number;
  uploadedAt: string;
}

export interface AdvancedSeoSocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
}

export interface AdvancedSeoData {
  headerScripts: string;
  footerScripts: string;
  ga4MeasurementId: string;
  gtmContainerId: string;
  googleSearchConsoleVerification: string;
  socialLinks: AdvancedSeoSocialLinks;
  seoFiles: SeoFile[];
}

export interface AdvancedSeoScriptsPayload {
  headerScripts: string;
  footerScripts: string;
  ga4MeasurementId: string;
  gtmContainerId: string;
  googleSearchConsoleVerification: string;
  socialLinks?: Partial<AdvancedSeoSocialLinks>;
}

export const advancedSeoApi = {
  get: () => api.get<AdvancedSeoData>("/seo-settings/advanced"),

  saveScripts: (payload: AdvancedSeoScriptsPayload) =>
    api.put<AdvancedSeoData>("/seo-settings/scripts", payload),

  saveSocialLinks: (links: Partial<AdvancedSeoSocialLinks>) =>
    api.put<AdvancedSeoSocialLinks>("/seo-settings/social-links", links),

  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.postForm<SeoFile[]>("/seo-settings/upload-file", formData);
  },

  deleteFile: (fileId: string) => api.delete<{ success: boolean }>(`/seo-settings/file/${fileId}`),
};
