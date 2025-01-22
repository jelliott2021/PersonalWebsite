import { useEffect, useState } from 'react';
import { followUser } from '../services/userService';
import useUserContext from './useUserContext';
import { User } from '../types';

const useFollowStatus = ({ profile }: { profile: User }) => {
  const UserContext = useUserContext();
  const user = UserContext ? UserContext.user : null;
  const [isFollowed, setIsFollowed] = useState<boolean>();

  const handleFollowUser = async () => {
    try {
      if (user) {
        await followUser(user._id, profile._id);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error following user:', error);
    }
  };

  useEffect(() => {
    if (user && profile.followers.some(u => u._id === user._id)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [user, profile.followers]);

  return {
    isFollowed,
    handleFollowUser,
  };
};

export default useFollowStatus;
