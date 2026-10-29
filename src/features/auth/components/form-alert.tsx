import { TriangleAlert } from "lucide-react";

export function FormAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50 p-3 text-[13px] text-red-700">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
