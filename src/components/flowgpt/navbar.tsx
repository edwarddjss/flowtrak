'use client'

import { Brain, LogOut, Settings } from 'lucide-react'
import { MainNav } from '@/components/main-nav'
import { ModeToggle } from '@/components/mode-toggle'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/auth-helpers-nextjs'
import { motion } from 'framer-motion'

interface NavbarProps {
  user: User | null
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 h-16 border-b bg-background/80 backdrop-blur-xl z-50"
    >
      <div className="container h-full">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <motion.div
              className="flex items-center gap-3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary to-violet-600 opacity-30 blur transition duration-1000 group-hover:opacity-70 group-hover:duration-200" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center shadow-lg shadow-primary/5">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
              </div>
              <span className="text-lg font-semibold tracking-tight">FlowGPT</span>
            </motion.div>
            <MainNav />
          </div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative group rounded-xl p-2 hover:bg-accent"
                >
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-violet-600 opacity-0 blur transition group-hover:opacity-30" />
                  {user?.user_metadata.avatar_url ? (
                    <div className="relative">
                      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-violet-600 opacity-30 blur transition group-hover:opacity-70" />
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="relative rounded-xl"
                      />
                    </div>
                  ) : (
                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.user_metadata.full_name?.[0] || user?.email?.[0]}
                      </span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="p-2">
                  <div className="flex flex-col space-y-1.5">
                    <p className="text-sm font-semibold leading-none">{user?.user_metadata.full_name}</p>
                    <p className="text-xs text-muted-foreground font-medium">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={() => router.push('/settings')}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium cursor-pointer rounded-lg focus:bg-accent"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium cursor-pointer rounded-lg focus:bg-accent text-red-500 focus:text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
