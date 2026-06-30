import { InferenceClient } from "@huggingface/inference";

let huggingFaceClient: InferenceClient | null = null;

export function getHuggingFaceClient(): InferenceClient {
  const token = process.env.HF_TOKEN;
  if (!token) {
    throw new Error("HF_TOKEN is not configured.");
  }

  huggingFaceClient ??= new InferenceClient(token);
  return huggingFaceClient;
}

export const mediaModels = {
  image: process.env.HF_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell",
  video: process.env.HF_VIDEO_MODEL || "Wan-AI/Wan2.1-T2V-1.3B",
};
