"use client";

import { useRouter } from "next/navigation";

const scenes = [
  {
    id: "ecommerce",
    name: "电商带货",
    desc: "直播文本 · 产品带货 · 短视频文案",
    iconBg: "bg-[#f5e6da]",
    illustration: "🛍️",
  },
  {
    id: "reading",
    name: "知识专栏",
    desc: "深度拆书 · 内容解读 · 知识播客",
    iconBg: "bg-[#e4ebe0]",
    illustration: "📚",
  },
  {
    id: "novel",
    name: "小说创作",
    desc: "长篇小说 · 短篇故事 · 网络文学",
    iconBg: "bg-[#ece3d8]",
    illustration: "📖",
  },
  {
    id: "screenplay",
    name: "剧本脚本",
    desc: "短剧剧本 · 漫改脚本 · 分镜设计",
    iconBg: "bg-[#e0ddd6]",
    illustration: "🎬",
  },
  {
    id: "general",
    name: "通用写作",
    desc: "文章撰写 · 文案润色 · 素材整理",
    iconBg: "bg-[#f0e6d5]",
    illustration: "✏️",
  },
];

export default function SceneCards() {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/workbench?scene=${id}`);
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          onClick={() => handleClick(scene.id)}
          className="rounded-xl bg-white border border-cream-border-warm hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-200 text-left group p-4"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              className={`w-8 h-8 ${scene.iconBg} rounded-lg flex items-center justify-center shrink-0`}
            >
              <span className="text-base group-hover:scale-110 transition-transform duration-300">
                {scene.illustration}
              </span>
            </div>
            <h3 className="text-base font-semibold text-warm-text">
              {scene.name}
            </h3>
          </div>
          <p className="text-[11px] leading-[1.6] text-warm-text-muted tracking-wide">
            {scene.desc}
          </p>
        </button>
      ))}
    </div>
  );
}
