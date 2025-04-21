'use client'

import { HomeLayout } from '@/app/homeStyle'
import { FloatingLayout } from '@/components/floatingBox/FloatingStyles'
import { useSession } from 'next-auth/react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useSession()

  const isLoading = session.status === 'loading'
  // const isLoading = true

  if (isLoading) {
    return (
      <HomeLayout className="justify-center z-50">
        <FloatingLayout className="w-auto px-12 py-4 mt-0">로그인 중입니다...</FloatingLayout>
      </HomeLayout>
    )
  }

  return children
}
