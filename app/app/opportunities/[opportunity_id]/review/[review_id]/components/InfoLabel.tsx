"use client";

export default function InfoLabel({ label, info }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-md text-slate-400">{label}</label>
      <p className="border-b-2 pb-2">{info}</p>
    </div>
  );
}
