'use client'

import { Dialog } from "@headlessui/react";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import useKeypress from "react-use-keypress";
import type { GalleryImage } from "@/types";
import SharedModal from "@/components/SharedModal";

export default function Modal({
  images,
  onClose,
  basePath = '/',
}: {
  images: GalleryImage[];
  onClose?: () => void;
  basePath?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const photoId = searchParams.get("photoId");
  let index = Number(photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(index);

  function handleClose() {
    router.push(basePath);
    onClose?.();
  }

  function changePhotoId(newVal: number) {
    if (newVal > index) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newVal);
    router.push(`${basePath}?photoId=${newVal}`);
  }

  useKeypress("ArrowRight", () => {
    if (index + 1 < images.length) {
      changePhotoId(index + 1);
    }
  });

  useKeypress("ArrowLeft", () => {
    if (index > 0) {
      changePhotoId(index - 1);
    }
  });

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleClose}
      />
      <SharedModal
        index={curIndex}
        direction={direction}
        images={images}
        changePhotoId={changePhotoId}
        closeModal={handleClose}
        navigation={true}
      />
    </Dialog>
  );
}
