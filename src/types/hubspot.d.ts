// TypeScript declaration for HubSpot
declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (options: Record<string, unknown>) => void;
      };
    };
  }
}

export {};
