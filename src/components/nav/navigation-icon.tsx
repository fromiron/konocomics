import { BarChart3, BookOpen, Library, Settings } from "lucide-react";

export type NavigationIconName = "recommendations" | "taste" | "library" | "settings";

type NavigationIconProps = Readonly<{
  name: NavigationIconName;
}>;

const icons = {
  recommendations: BookOpen,
  taste: BarChart3,
  library: Library,
  settings: Settings,
} as const;

export function NavigationIcon({ name }: NavigationIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className="size-[22px]" strokeWidth={1.8} />;
}
