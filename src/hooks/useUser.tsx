import User from '@/types/user/User';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const useUser = (): User => {
  const session = useSession();
  const [user, setUser] = useState<User>(new User());

  useEffect(() => {
    if (session.status === 'authenticated') {
      const _user = new User();
      _user.parseResponse(session.data.user);
      setUser(_user);
    }
  }, [session]);

  return user;
};
