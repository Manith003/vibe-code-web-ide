'use client'
import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'
import Image from 'next/image'

const AddRepoButton = () => {
  return (
    <div
          className="group px-6 py-8 flex flex-row-reverse justify-between items-center border rounded-lg border-black cursor-pointer 
            transition-all duration-300 ease-in-out
            hover:scale-[1.02] bg-neutral-800 hover:border-white/40 relative overflow-hidden"
        >
          <div className="flex flex-row justify-start items-center gap-4 w-full">
            <div className="buttonClass">
              <Button
                variant={"outline"}
                className="flex justify-center items-center cursor-pointer bg-neutral-700 border-none group-hover:rotate-360 transition-transform duration-300"
                size={"icon"}
              >
                <ArrowDown />
              </Button>
            </div>
            <div className="flex flex-col">
              <h1>Open Github Repository</h1>
              <p className="text-sm text-gray-400">work with your repositories in our editor</p>
            </div>   
          </div>
          <Image className="absolute -right-2 border-none scale-90" src={'/githubbc.svg'} alt="All Programming" width={150} height={50} />
        </div>
  )
}

export default AddRepoButton