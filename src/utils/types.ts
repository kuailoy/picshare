/* eslint-disable no-unused-vars */
import type { GalleryImage } from "@/types";

export interface SharedModalProps {
  index: number;
  images?: GalleryImage[];
  currentPhoto?: GalleryImage;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
