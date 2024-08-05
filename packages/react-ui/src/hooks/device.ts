import { useAwakenSwapContext } from '../context/AwakenSwap';

export const useIsMobile = () => {
  const [{ isMobile }] = useAwakenSwapContext();
  return isMobile;
};
