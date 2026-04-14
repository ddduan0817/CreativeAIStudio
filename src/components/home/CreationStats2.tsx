"use client";

import { Download, Calendar, FileText } from "lucide-react";
import { mockWorks } from "@/data/mockWorks";

export default function CreationStats2() {
  const totalWords = mockWorks.reduce((sum, w) => sum + w.wordCount, 0);
  const totalWordsWan = (totalWords / 10000).toFixed(1);
  const worksCount = mockWorks.length;

  // Progress bar: percentage of 100,000 words goal
  const progressPercent = Math.min((totalWords / 100000) * 100, 100);

  // Fun comparison based on word count
  const getComparison = () => {
    if (totalWords >= 50000) return "相当于完成了一部中篇小说";
    if (totalWords >= 30000) return "相当于完成了鲁迅的《阿Q正传》";
    if (totalWords >= 10000) return "相当于完成了鲁迅的短篇小说《祝福》";
    return "继续加油，向第一个万字迈进！";
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-border-warm p-5 flex flex-col">
      <h2 className="text-sm font-semibold text-warm-text mb-4">创作情况</h2>

      {/* Main Stat */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-warm-text">{totalWordsWan}</span>
          <span className="text-lg font-bold text-warm-text">万字</span>
        </div>
        <p className="text-xs text-warm-text-muted mt-1">
          {getComparison()}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="h-2 bg-cream-bg rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-literary-primary to-[#c4a07a] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between border-t border-cream-bg pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-warm-text-secondary">
          <Download className="w-3.5 h-3.5 text-warm-text-muted" />
          <span>导出次数</span>
          <span className="font-semibold text-warm-text ml-1">0次</span>
        </div>
        <div className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-warm-text-secondary">
          <Calendar className="w-3.5 h-3.5 text-warm-text-muted" />
          <span>连续创作</span>
          <span className="font-semibold text-warm-text ml-1">37天</span>
        </div>
        <div className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-warm-text-secondary">
          <FileText className="w-3.5 h-3.5 text-warm-text-muted" />
          <span>作品数</span>
          <span className="font-semibold text-warm-text ml-1">{worksCount}篇</span>
        </div>
      </div>
    </div>
  );
}
