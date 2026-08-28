export type CursorCommand =
  | { type: 'LISTEN' }
  | { type: 'REPEAT' }
  | { type: 'TOGGLE_FOLLOW' }
  | { type: 'STOP' }
  | { type: 'GET_STATE' };

export interface CursorState {
  ok: boolean;
  state: 'idle' | 'speaking' | 'following' | 'error';
  message: string;
  follow: boolean;
  sample?: string;
}
