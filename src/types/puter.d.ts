interface PuterAI {
  chat: (prompt: string) => Promise<{ text: string }>;
}

interface Puter {
  ai: PuterAI;
}

declare global {
  interface Window {
    puter: Puter;
  }
  var puter: Puter;
} 