'use client'

import Image from 'next/image'

interface IUserAvatar {
  imageURL
}
export default function UserAvatar({ imageURL }: IUserAvatar) {
  return (
    <div className="relative flex flex-center w-full h-full">
      <Image src={imageURL} fill alt="Picture" />
    </div>
  )
}
