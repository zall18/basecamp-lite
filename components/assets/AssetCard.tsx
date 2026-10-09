"use client";

import React, { useState } from "react";
import { ExternalLink, Copy, Check, Folder, FileSpreadsheet, Tv, Presentation } from "lucide-react";
import { QuickAsset } from "@/types";
import { Button } from "@/components/ui/Button";

interface AssetCardProps {
  asset: QuickAsset;
}

export function AssetCard({ asset }: AssetCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Drive":
        return <Folder className="w-5 h-5 text-amber-400" />;
      case "Form":
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case "Streaming":
        return <Tv className="w-5 h-5 text-rose-400" />;
      default:
        return <Presentation className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-white/5 hover:border-violet-500/30 transition-all flex flex-col justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center shrink-0">
          {getCategoryIcon(asset.category)}
        </div>
        <div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/5">
            {asset.category}
          </span>
          <h4 className="text-sm font-bold text-white mt-1 leading-snug">
            {asset.title}
          </h4>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-white/5">
        <a
          href={asset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Buka Tautan</span>
        </a>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="px-3 min-h-[36px]"
          title="Salin Link Tautan"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
      </div>
    </div>
  );
}
