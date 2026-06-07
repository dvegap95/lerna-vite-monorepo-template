/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, type ReactNode } from 'react';

import useSafeContext from '@/hooks/useSafeContext';

export type DynamicConfig = null | {
  app?: {
    backendBaseUrl?: string;
  };
};

const defaultConfig: DynamicConfig = null;

const isDefaultConfig = (config: DynamicConfig) => {
  return config === null;
};

export const DynamicConfigContext = createContext<DynamicConfig>(defaultConfig);
const configRef: { current: DynamicConfig } = { current: defaultConfig };

const homepage = import.meta.env.BASE_URL;

async function resolveDynamicConfig(dynamicConfig = `${homepage}config.json`) {
  try {
    const response = await fetch(dynamicConfig);
    if (response.ok) {
      try {
        const jsonResponse = await response.json();
        if (typeof jsonResponse === 'string') throw new Error('Invalid JSON');
        return jsonResponse;
      } catch {
        // eslint-disable-next-line no-console
        console.error('Error parsing dynamic config (not a valid JSON)');
        return null;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching dynamic config');
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
}

export type DynamicConfigProviderProps = {
  children: ReactNode;
  configUrl?: string;
};

const DynamicConfigProvider = ({
  children,
  configUrl,
}: DynamicConfigProviderProps) => {
  const [config, setConfig] = React.useState(configRef.current);

  useEffect(() => {
    if (isDefaultConfig(config)) {
      void resolveDynamicConfig(configUrl).then((dynamicConfig) => {
        setConfig(dynamicConfig);
        configRef.current = dynamicConfig;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DynamicConfigContext.Provider value={config}>
      {config ? children : null}
    </DynamicConfigContext.Provider>
  );
};

export default DynamicConfigProvider;

export const getDynamicConfig: () => DynamicConfig = () => {
  return configRef.current;
};

export const useDynamicConfig = () => {
  return useSafeContext(DynamicConfigContext) || defaultConfig;
};
