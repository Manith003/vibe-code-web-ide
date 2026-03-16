"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Bot,
  Code,
  FileText,
  Import,
  Loader2,
  Power,
  PowerOff,
  Braces,
  Variable,
} from "lucide-react";

interface ToggleAIProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  suggestionLoading: boolean;
  /*optional feature */
  loadingProgress?: number;
  activeFeature?: string;
}

const ToggleAI = ({
  isEnabled,
  onToggle,
  suggestionLoading,
  loadingProgress = 0,
  activeFeature,
}: ToggleAIProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={"sm"}
          variant={isEnabled ? "default" : "outline"}
          className={cn(
            "relative gap-2 h-8 px-3 text-sm font-medium transition-all duration-200",
            isEnabled
              ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-50 border-zinc-700 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 dark:border-zinc-300"
              : "bg-zinc-900 hover:bg-zinc-800 hover:text-white border-none",
            suggestionLoading && "opacity-80",
          )}
          onClick={(e) => e.preventDefault()}
        >
          {suggestionLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Bot size={16} />
          )}
          <span>AI</span>
          {isEnabled ? (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          ) : (
            <div className="w-2 h-2 bg-red-700 rounded-full animate-spin" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 bg-zinc-800 backdrop-blur border border-zinc-700 text-white"
      >
        <DropdownMenuLabel className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Bot size={16} />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          <Badge
            variant={"outline"}
            className={cn(
              "text-xs",
              isEnabled
                ? "bg-zinc-900 text-green-500 border-none"
                : " text-red-500 border-none",
            )}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </DropdownMenuLabel>

        {suggestionLoading && activeFeature && (
          <div className="px-3 pb-3">
            <div className="space-y-2 ">
              <div className="flex items-center justify-between text-xs">
                <span>{activeFeature}</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
          </div>
        )}  
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem
          onClick={() => onToggle(!isEnabled)}
          className="py-2 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {isEnabled ? (
                <Power className="size-4" />
              ) : (
                <PowerOff className="size-4" />
              )}
              <div>
                <div className="text-sm font-medium">
                  {isEnabled ? "Disable AI" : "Enable AI"}
                </div>
                <div className="text-sm text-zinc-400">
                  Toggle AI Assistance
                </div>
              </div>
            </div>
            <div>
              <Switch
                checked={isEnabled}
                onCheckedChange={(checked) => onToggle(checked)}
              />
            </div>

              {/* <div className={cn(
                'w-8 h-4 rounded-full border transition-all duration-200 relative',
                isEnabled
                ? "bg-zinc-900 border-zinc-900"
                :"bg-muted border-muted"
              )}>
                <div className={cn(
                  'w-3 h-3 rounded-full bg-black transition-all duration-200 absolute top-[1px]',
                isEnabled
                ? "left-4"
                :"left-0.5"
                )}/>
              </div> */}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem onClick={() => {}} className="py-2 cursor-pointer">
          <div className="flex items-center gap-3 w-full">
            <FileText className="size-4" />
            <div>
              <div className="text-sm">Open Chat</div>
              <div>
                Chat with the AI assistant
              </div>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleAI;
