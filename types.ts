
export interface Scene {
  id: number;
  visual_description: string;
  action_dialogue: string;
  imageUrl?: string;
}

// Type expected from the Gemini text model
export interface SceneOutline {
  visual_description: string;
  action_dialogue: string;
}
