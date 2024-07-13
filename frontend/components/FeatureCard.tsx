"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { TiBusinessCard } from "react-icons/ti";
import { GiCardRandom, GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card>
      {icon === "icons" ? (
        <CardSkeletonContainer>
          <Skeleton />
        </CardSkeletonContainer>
      ) : null}
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </Card>
  );
}

const Skeleton = () => {
  const scale = [1, 1.1, 1];
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"];
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ];

  useEffect(() => {
    // @ts-expect-error: ok
    animate(sequence, {
      repeat: Infinity,
      repeatDelay: 1,
    });
  }, []);
  return (
    <div className="p-2 overflow-hidden h-full relative flex items-center justify-center">
      <div className="flex flex-row flex-shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <GiCardRandom className="h-4 w-4 " />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <AptosLogo className="h-6 w-6 dark:text-white" />
        </Container>
        <Container className="circle-3">
          <SvoyLogo className="h-8 w-8 dark:text-white" />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <TiBusinessCard className="h-6 w-6 text-[#e91e63]" />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <GiPerspectiveDiceSixFacesRandom className="h-4 w-4 " />
        </Container>
      </div>

      <div className="h-40 w-px absolute top-10 m-auto z-40 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-move">
        <div className="w-10 h-40 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  );
};
const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1;
  const randomOpacity = () => Math.random();
  const random = () => Math.random();
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  );
};

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] bg-chetoblack shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={cn("text-lg font-semibold text-gray-800 dark:text-white py-2", className)}>{children}</h3>;
};

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <p className={cn("text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm", className)}>{children}</p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div className={cn("h-[10rem] md:h-[15rem] rounded-xl z-40", className, showGradient && "bg-chetoblack")}>
      {children}
    </div>
  );
};

const Container = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={cn(
        `h-12 w-12 rounded-full flex items-center justify-center bg-chetoblack
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className,
      )}
    >
      {children}
    </div>
  );
};

export const AptosLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="60.47"
      height="60.7"
      fill="#06F7F7"
      viewBox="0 0 60.47 60.7"
    >
      <path d="M46.83 20.31h-5.35a2.19 2.19 0 0 1-1.63-.74l-2.17-2.45a1.7 1.7 0 0 0-1.27-.57 1.74 1.74 0 0 0-1.28.57l-1.86 2.1a3.2 3.2 0 0 1-2.4 1.09H1.59A30.34 30.34 0 0 0 0 27.8h27.64a1.77 1.77 0 0 0 1.28-.55l2.58-2.69a1.71 1.71 0 0 1 1.23-.56h.1a1.72 1.72 0 0 1 1.28.57l2.17 2.45a2.16 2.16 0 0 0 1.63.74h22.56a29.91 29.91 0 0 0-1.6-7.49h-12ZM16.72 43.55A1.78 1.78 0 0 0 18 43l2.57-2.69a1.74 1.74 0 0 1 1.23-.52h.11a1.74 1.74 0 0 1 1.28.57l2.17 2.45a2.15 2.15 0 0 0 1.62.74h30.59A30.41 30.41 0 0 0 60.05 36H30.71a2.18 2.18 0 0 1-1.63-.73l-2.17-2.47a1.71 1.71 0 0 0-1.28-.58 1.67 1.67 0 0 0-1.27.58l-1.86 2.1a3.22 3.22 0 0 1-2.41 1.1H.42a30.41 30.41 0 0 0 2.48 7.55ZM38.41 12.12a1.79 1.79 0 0 0 1.29-.55l2.57-2.68a1.71 1.71 0 0 1 1.23-.53h.11a1.71 1.71 0 0 1 1.28.58l2.16 2.45a2.21 2.21 0 0 0 1.63.73h5.82a30.35 30.35 0 0 0-48.5 0ZM26.74 51.05h-8a2.15 2.15 0 0 1-1.62-.74L15 47.86a1.74 1.74 0 0 0-1.28-.57 1.7 1.7 0 0 0-1.27.57L10.58 50a3.22 3.22 0 0 1-2.41 1.09h-.12a30.33 30.33 0 0 0 44.37 0Z" />
    </svg>
  );
};

export const ClaudeLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 512"
      className={className}
    >
      <rect fill="#CC9B7A" width="512" height="512" rx="104.187" ry="105.042" />
      <path
        fill="#1F1F1E"
        fillRule="nonzero"
        d="M318.663 149.787h-43.368l78.952 212.423 43.368.004-78.952-212.427zm-125.326 0l-78.952 212.427h44.255l15.932-44.608 82.846-.004 16.107 44.612h44.255l-79.126-212.427h-45.317zm-4.251 128.341l26.91-74.701 27.083 74.701h-53.993z"
      />
    </svg>
  );
};

export const SvoyLogo = ({ className }: { className?: string }) => {
  return <p>S</p>;
};
