"use client";

import React, { useState } from "react";
import { ExternalLink, ImageIcon, RotateCcw, Trash2, Upload, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import { uploadApi } from "@/lib/uploadApi";
import { ApiRequestError } from "@/lib/api";
import { TextInput } from "./TextInput";
import { FieldLabel } from "./FieldLabel";

export interface ImageWithAltFieldProps {
  label?: string;
  image: string;
  alt: string;
  onImageChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  altLabel?: string;
  altPlaceholder?: string;
  defaultValue?: string;
  required?: boolean;
  folder?: string;
  helperText?: string;
  layout?: "row" | "stacked" | "auto";
}

export function ImageWithAltField({
  label,
  image,
  alt,
  onImageChange,
  onAltChange,
  altLabel = "Alt Tag",
  altPlaceholder = "Enter alt text...",
  defaultValue,
  required = false,
  folder = "design-house/content",
  helperText,
  layout = "auto",
}: ImageWithAltFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadApi.file(file, folder);
      const uploadedUrl = res?.url || (res as { data?: { url?: string } })?.data?.url;
      if (!uploadedUrl) throw new Error("Server did not return an image URL.");
      onImageChange(uploadedUrl);

      // If alt is empty, auto-populate from file name
      if (!alt?.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim();
        if (cleanName) {
          onAltChange(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Upload Failed",
        text:
          err instanceof ApiRequestError || err instanceof Error
            ? err.message
            : "Could not upload the image.",
        icon: "error",
        confirmButtonColor: "#218DAE",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRemove = () => {
    onImageChange("");
  };

  const handleReset = () => {
    if (defaultValue) {
      onImageChange(defaultValue);
    }
  };

  const isDifferentFromDefault = Boolean(defaultValue && image !== defaultValue);
  const hasAlt = Boolean(alt && alt.trim().length > 0);

  const directUrl =
    image && typeof image === "string"
      ? image.startsWith("http")
        ? image
        : image.startsWith("/")
        ? image
        : `/${image}`
      : "";

  const isStacked = layout === "stacked";
  const gridClass = isStacked
    ? "grid grid-cols-1 gap-2.5 items-start"
    : layout === "row"
    ? "grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
    : "grid grid-cols-1 @[480px]:grid-cols-2 md:grid-cols-2 gap-3 items-start";

  return (
    <div className="@container p-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-[7px] shadow-2xs">
      <div className={gridClass}>
        {/* LEFT COLUMN: Image URL, Upload & Thumbnail */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between min-h-[16px]">
            <FieldLabel required={required}>{label || "Image"}</FieldLabel>
            {directUrl ? (
              <a
                href={directUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-0.5 text-[8.5px] font-medium text-[#2563eb] hover:underline"
              >
                <ExternalLink className="h-2.5 w-2.5" />
                View Full
              </a>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
            {/* Compact Thumbnail Preview */}
            {directUrl ? (
              <a
                href={directUrl}
                target="_blank"
                rel="noreferrer"
                title="Click to view full image"
                className="relative h-[34px] w-[38px] shrink-0 overflow-hidden rounded border border-[#cbd5e1] bg-white flex items-center justify-center hover:border-blue-400 transition-colors shadow-2xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={directUrl}
                  alt={alt || "preview"}
                  className="h-full w-full object-contain"
                />
              </a>
            ) : (
              <div
                title="No image set"
                className="h-[34px] w-[38px] shrink-0 rounded border border-dashed border-[#cbd5e1] bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <TextInput
                value={image}
                onChange={onImageChange}
                placeholder="https://... or /assets/..."
                hideLimit={true}
              />
            </div>

            <label className="flex shrink-0 cursor-pointer items-center gap-1 rounded border border-[#0f766e] bg-[#f0fdf4] px-2.5 py-1.5 text-[9px] font-bold text-[#0f766e] hover:bg-[#dcfce7] transition-colors shadow-2xs whitespace-nowrap">
              <Upload className="h-3 w-3" />
              {uploading ? "..." : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {image ? (
              <button
                type="button"
                onClick={handleRemove}
                title="Delete image"
                className="flex shrink-0 items-center justify-center rounded border border-[#fca5a5] bg-[#fef2f2] p-1.5 text-[#dc2626] hover:bg-[#fee2e2] transition-colors shadow-2xs cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            ) : null}

            {isDifferentFromDefault && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset to default image"
                className="flex shrink-0 items-center justify-center rounded border border-amber-300 bg-amber-50 p-1.5 text-amber-800 hover:bg-amber-100 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw className="h-3 w-3 text-amber-700" />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Alt Tag Input & Status */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between min-h-[16px]">
            <label className="text-[9.5px] font-semibold text-slate-700 flex items-center gap-1">
              <Tag size={10} className="text-[#075D3D]" />
              <span>{altLabel}</span>
              {required && <span className="text-red-500 font-bold">*</span>}
            </label>
            <span
              className={`text-[8.5px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                hasAlt
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
              }`}
            >
              {hasAlt ? (
                <>
                  <CheckCircle2 size={10} className="text-emerald-600" /> Alt Set
                </>
              ) : (
                <>
                  <AlertCircle size={10} className="text-amber-600" /> Alt Missing
                </>
              )}
            </span>
          </div>

          <TextInput
            value={alt}
            onChange={onAltChange}
            placeholder={altPlaceholder}
            hideLimit={true}
          />
        </div>
      </div>

      {helperText && (
        <p className="text-[8.5px] text-slate-500 leading-tight mt-1.5 pt-1 border-t border-slate-200/60">
          {helperText}
        </p>
      )}
    </div>
  );
}
