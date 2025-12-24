'use client'

import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { usePlayground } from '@/features/playground/hooks/usePlayground';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { useParams } from 'next/navigation'


const Page = () => {
    const {id} = useParams<{id: string}>();
    const {playgroundData, templateData, isLoading, error, loadPlayground, saveTemplateData} = usePlayground(id);
    // console.log("templateData", templateData)
    // console.log("playgroundData",playgroundData)
  return (
    <div>
        <>
        {/* template tree making playground page */}
        <SidebarInset>
            <header className='flex h-16 shrink items-center gap-2 border-b px-4 bg-neutral-800 text-white'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation="vertical" className='mr-2 h-4' />
                <div className='flex flex-1 items-center gap-2'>
                    <div className='flex flex-col flex-1'>
                        {playgroundData?.title || 'Playground'}
                    </div>
                </div>
            </header>
        </SidebarInset>
        </>
    </div>
  )
}

export default Page;