
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const TUTORIAL_COMPLETED_KEY = 'pachegar_tutorial_completed';

export const useTutorial = () => {
  const { user } = useAuth();
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Check if tutorial was already completed for this user
      const tutorialCompleted = localStorage.getItem(`${TUTORIAL_COMPLETED_KEY}_${user.id}`);
      
      if (!tutorialCompleted) {
        // Show tutorial after a short delay to ensure UI is loaded
        setTimeout(() => {
          setShowTutorial(true);
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const completeTutorial = () => {
    if (user) {
      localStorage.setItem(`${TUTORIAL_COMPLETED_KEY}_${user.id}`, 'true');
    }
    setShowTutorial(false);
  };

  const skipTutorial = () => {
    if (user) {
      localStorage.setItem(`${TUTORIAL_COMPLETED_KEY}_${user.id}`, 'true');
    }
    setShowTutorial(false);
  };

  return {
    showTutorial,
    isLoading,
    completeTutorial,
    skipTutorial
  };
};
