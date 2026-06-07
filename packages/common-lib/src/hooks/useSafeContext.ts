import { useContext, type Context } from 'react';

const useSafeContext = <T>(context: Context<T>): T | undefined => {
  try {
    return useContext(context);
  } catch (error) {
    return undefined;
  }
};

export default useSafeContext;
