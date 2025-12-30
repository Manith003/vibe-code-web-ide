"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const {
    playgroundData,
    templateData,
    isLoading,
    error,
    loadPlayground,
    saveTemplateData,
  } = usePlayground(id);

  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setOpenFiles,
    setPlaygroundId,
  } = useFileExplorer();

  return (
    <div>
      <>
        {/* template tree making playground page */}
        {templateData && <TemplateFileTree data={templateData} />}
        <SidebarInset>
          <header className="flex h-16 shrink items-center gap-2 border-b px-3 bg-neutral-900 text-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1">
                {playgroundData?.title || "Playground"}
              </div>
            </div>
          </header>
        </SidebarInset>
      </>
    </div>
  );
};

export default Page;
