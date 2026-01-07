"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingStep from "@/components/ui/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PlaygroundEditor from "@/features/playground/components/playground-editor";
import TemplateFileTree from "@/features/playground/components/template-file-tree";
import { useFileExplorer } from "@/features/playground/hooks/useFileExplorer";
import { usePlayground } from "@/features/playground/hooks/usePlayground";
import { findFilePath } from "@/features/playground/lib";
import { TemplateFile, TemplateFolder } from "@/features/playground/types";
import WebContainerPreview from "@/features/webContainers/components/webcontainer-preview";
import { useWebContainer } from "@/features/webContainers/hooks/useWebContainer";
import { th } from "date-fns/locale";
import {
  AlertCircle,
  Bot,
  FileText,
  FolderOpen,
  Save,
  Settings,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const { id } = useParams<{ id: string }>();
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
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

  const {
    serverUrl,
    isLoading: containerLoading,
    error: containerError,
    instance,
    writeFileSync,
  } = useWebContainer({ templateData });
  const lastSyncedContent = useRef<Map<string, string>>(new Map());
  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId]);

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length]);

  // Create wrapper functions that pass saveTemplateData
  const wrappedHandleAddFile = useCallback(
    (newFile: TemplateFile, parentPath: string) => {
      return handleAddFile(
        newFile,
        parentPath,
        writeFileSync,
        instance,
        saveTemplateData
      );
    },
    [handleAddFile, writeFileSync, instance, saveTemplateData]
  );

  const wrappedHandleAddFolder = useCallback(
    (newFolder: TemplateFolder, parentPath: string) => {
      return handleAddFolder(newFolder, parentPath, instance, saveTemplateData);
    },
    [handleAddFolder, instance, saveTemplateData]
  );

  const wrappedHandleDeleteFile = useCallback(
    (file: TemplateFile, parentPath: string) => {
      return handleDeleteFile(file, parentPath, saveTemplateData);
    },
    [handleDeleteFile, saveTemplateData]
  );

  const wrappedHandleDeleteFolder = useCallback(
    (folder: TemplateFolder, parentPath: string) => {
      return handleDeleteFolder(folder, parentPath, saveTemplateData);
    },
    [handleDeleteFolder, saveTemplateData]
  );

  const wrappedHandleRenameFile = useCallback(
    (
      file: TemplateFile,
      newFilename: string,
      newExtension: string,
      parentPath: string
    ) => {
      return handleRenameFile(
        file,
        newFilename,
        newExtension,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFile, saveTemplateData]
  );

  const wrappedHandleRenameFolder = useCallback(
    (folder: TemplateFolder, newFolderName: string, parentPath: string) => {
      return handleRenameFolder(
        folder,
        newFolderName,
        parentPath,
        saveTemplateData
      );
    },
    [handleRenameFolder, saveTemplateData]
  );

  const activeFile = openFiles.find((file) => file.id === activeFileId);
  const hasUnsavedChanges = openFiles.some((file) => file.hasUnsavedChanges);
  const handleFileSelect = (file: TemplateFile) => {
    openFile(file);
  };

  const handleSave = useCallback(
    async (fileId?: string) => {
      const targetFileId = fileId || activeFileId;
      if (!targetFileId) return;

      const fileToSave = openFiles.find((f) => f.id === targetFileId);
      if (!fileToSave) return;

      const latestTemplateData = useFileExplorer.getState().templateData;
      if (!latestTemplateData) return;

      try {
        const filePath = findFilePath(fileToSave, latestTemplateData);
        if (!filePath) {
          toast.error(
            `Could not find path for file: ${fileToSave.filename}.${fileToSave.fileExtension}`
          );
          return;
        }

        // Update file content in template data (clone for immutability)
        const updatedTemplateData = JSON.parse(
          JSON.stringify(latestTemplateData)
        );
        const updateFileContent = (items: any[]): any[] =>
          items.map((item) => {
            if ("folderName" in item) {
              return { ...item, items: updateFileContent(item.items) };
            } else if (
              item.filename === fileToSave.filename &&
              item.fileExtension === fileToSave.fileExtension
            ) {
              return { ...item, content: fileToSave.content };
            }
            return item;
          });
        updatedTemplateData.items = updateFileContent(
          updatedTemplateData.items
        );

        // Sync with WebContainer
        if (writeFileSync) {
          await writeFileSync(filePath, fileToSave.content);
          lastSyncedContent.current.set(fileToSave.id, fileToSave.content);
          if (instance && instance.fs) {
            await instance.fs.writeFile(filePath, fileToSave.content);
          }
        }

        // Use saveTemplateData to persist changes
        const newTemplateData = await saveTemplateData(updatedTemplateData);
        setTemplateData(newTemplateData! || updatedTemplateData);

        // Update open files
        const updatedOpenFiles = openFiles.map((f) =>
          f.id === targetFileId
            ? {
                ...f,
                content: fileToSave.content,
                originalContent: fileToSave.content,
                hasUnsavedChanges: false,
              }
            : f
        );
        setOpenFiles(updatedOpenFiles);

        toast.success(
          `Saved ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
      } catch (error) {
        console.error("Error saving file:", error);
        toast.error(
          `Failed to save ${fileToSave.filename}.${fileToSave.fileExtension}`
        );
        throw error;
      }
    },
    [
      activeFileId,
      openFiles,
      writeFileSync,
      instance,
      saveTemplateData,
      setTemplateData,
      setOpenFiles,
    ]
  );

  const handleSaveAll = async () => {
    const unsavedFiles = openFiles.filter((file) => file.hasUnsavedChanges);

    if (unsavedFiles.length === 0) {
      toast.info("No unsaved changes to save.");
      return;
    }

    try {
      await Promise.all(unsavedFiles.map((file) => handleSave(file.id)));
      toast.success("All files saved successfully.");
    } catch (error) {
      toast.error("Failed to save all files.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="destructive">
          Try Again
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div>
        </div>
      </div>
    );
  }

  // No template data
  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }
  return (
    <TooltipProvider>
      <>
        {/* template tree making playground page */}
        {templateData && (
          <TemplateFileTree
            data={templateData}
            onFileSelect={handleFileSelect}
            selectedFile={activeFile}
            title="File Explorer"
            onAddFile={wrappedHandleAddFile}
            onAddFolder={wrappedHandleAddFolder}
            onDeleteFile={wrappedHandleDeleteFile}
            onDeleteFolder={wrappedHandleDeleteFolder}
            onRenameFile={wrappedHandleRenameFile}
            onRenameFolder={wrappedHandleRenameFolder}
          />
        )}
        <SidebarInset>
          <header className="flex h-16 shrink items-center gap-2 px-3 bg-neutral-900 text-white  border-b border-b-neutral-700">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-neutral-700"
            />
            <div className="flex flex-1 items-center gap-2">
              <div className="flex flex-col flex-1 gap-1">
                <h1 className="text-sm font-medium leading-none">
                  {playgroundData?.title || "Playground"}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {openFiles.length} files open
                  {hasUnsavedChanges && " • Unsaved changes"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      disabled={!hasUnsavedChanges || !activeFile}
                      onClick={() => handleSave()}
                      className="cursor-pointer"
                      variant={"ghost"}
                    >
                      <Save className="" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl + S)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      disabled={!hasUnsavedChanges || !activeFile}
                      onClick={handleSaveAll}
                      className="cursor-pointer"
                      variant={"ghost"}
                    >
                      <Save className="" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All(Ctrl + Shift + S)</TooltipContent>
                </Tooltip>

                {/*TODO: later adding the TOGGLEAI*/}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"sm"}
                      onClick={() => {}}
                      className="cursor-pointer"
                      variant={"ghost"}
                    >
                      <Bot />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI Assistant</TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"sm"} variant={"ghost"}>
                      <Settings />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <div className="h-[calc(100vh-4rem)] bg-neutral-900 text-white">
            {openFiles.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="border-b border-b-neutral-700">
                  <Tabs
                    value={activeFileId || ""}
                    onValueChange={setActiveFileId}
                  >
                    <div className="flex items-center justify-between px-4 py-2">
                      <TabsList className="h-8 bg-transparent p-0">
                        {openFiles.map((file) => (
                          <TabsTrigger
                            key={file.id}
                            value={file.id}
                            className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]: shadow-sm group"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="size-4" />
                              <span className="text-sm">
                                {file.filename}.{file.fileExtension}
                              </span>
                              {file.hasUnsavedChanges && (
                                <span className="text-[30px] ">•</span>
                              )}
                              <span
                                className=" h-4 w-4 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeFile(file.id);
                                }}
                              >
                                <X />
                              </span>
                            </div>
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {openFiles.length > 1 && (
                        <Button
                          variant={"ghost"}
                          size={"sm"}
                          onClick={closeAllFiles}
                        >
                          Close All
                        </Button>
                      )}
                    </div>
                  </Tabs>
                </div>
                <div className="flex-1">
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full"
                  >
                    <ResizablePanel defaultSize={isPreviewVisible ? 100 : 100}>
                      <PlaygroundEditor
                        activeFile={activeFile}
                        content={activeFile?.content || ""}
                        onContentChange={(value) =>
                          activeFileId && updateFileContent(activeFileId, value)
                        }
                      />
                    </ResizablePanel>
                    {isPreviewVisible && (
                      <>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50}>
                          <WebContainerPreview
                            templateData={templateData!}
                            instance={instance}
                            writeFileSync={writeFileSync}
                            isLoading={containerLoading}
                            error={containerError}
                            serverUrl={serverUrl!}
                            forceResetup={false}
                          />
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full items-center justify-center text-muted-foreground gap-4">
                <FileText className="size-16" />
                <p className="text-sm">No files are open.</p>
              </div>
            )}
          </div>
        </SidebarInset>
      </>
    </TooltipProvider>
  );
};

export default Page;
