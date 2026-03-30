export type Role = 'user' | 'assistant' | 'system' | 'tool';

export type Message = {
  id?: number;
  content: string;
  role: Role;
  tokens?: {
    prompt?: number;
    completion?: number;
    cached?: number;
    total?: number;
  };
  time: number;
};

export type Provider = {
  name: string;
  base_url: string;
  api_key: string;
  model: string;
};

export type APIResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: {
        role: Role;
        content: string;
      };
      finish_reason: string;
    }
  ];
};
