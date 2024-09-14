"use client";
import { useEffect } from "react";
import { ShootingStars } from "./components/ui/shooting-stars";
import { StarsBackground } from "./components/ui/stars-background";
import { SparklesCore } from "./components/ui/sparkles";
import { Globe } from "./components/Globe";
import { Meteors } from "./components/ui/meteors";
import { loadSlim } from "@tsparticles/slim";
import Link from "next/link";
import { Button as BorderButton } from "./components/ui/moving-border";
import { PinContainer } from "./components/ui/3d-pin";
import { BookMarked, Brain, Sparkles } from "lucide-react";
import { Compare } from "./components/ui/compare";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import Image from "next/image";


export function LandingPage() {
  return (
    <div className="pb-60">
      <div className="flex items-center">
        <Globe></Globe>
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <h1 className="bg-gradient-to-br from-violet-600 to-blue-500 bg-clip-text text-transparent text-6xl font-black mb-4">
              Expand Your World of Knowledge
            </h1>
            <div className="relative w-full mx-auto text-white">
              <p>Bookmark interesting, insightful, and valuable content</p>
              <p className="mb-4">
                Learn from other people and turn your second brain into an
                archive of value
              </p>
              <BorderButton>
                <Link href="/sign-up">
                  Register
                </Link>
              </BorderButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-14">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Replace brainrot with <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-violet-600 to-blue-400 bg-clip-text text-transparent">
                brain fuel 
              </span>
            </h1>
          </>
        }
      >
        <Compare
            firstImage="https://assets.aceternity.com/code-problem.png"
            secondImage="https://assets.aceternity.com/code-solution.png"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="w-full h-full"
            slideMode="hover"
          />
      </ContainerScroll>
    </div>

        <h1 className="text-6xl bg-gradient-to-r from-violet-600 to-blue-400 bg-clip-text text-transparent w-fit mx-auto">
          Built for the Curious
        </h1>
      
      <div className="w-2/3 mx-auto flex items-center mt-20">
        <div className="w-full h-full">
          <div className="relative shadow-xl bg-black border border-gray-400 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
            <BookMarked className="mx-auto w-6 h-6 text-white mb-4 w-fit mx-auto"></BookMarked>

            <h1 className="font-bold text-xl text-white mb-4 relative z-50  w-fit mx-auto">
              Instant Capture
            </h1>

            <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
              Save the content you want to remember in your own space. Organize
              your bookmarks with tags and categories for easy access.
            </p>
          </div>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-center relative -bottom-[150px]">
          <PinContainer
            className="w-[300px] relative h-[350px] flex flex-col items-center justify-center"
            title="Register"
            href="/sign-up"
          >
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500  bg-red-500 rounded-full blur-3xl z-50" />
            <div className="relative shadow-xl px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
              <Sparkles className="mx-auto w-6 h-6 text-white mb-4 relative top-0"></Sparkles>

              <h1 className="font-bold text-xl text-white mb-4 relative z-50 w-fit mx-auto">
                What are you waiting for?
              </h1>

              <p className="text-slate-900 text-base font-bold mb-4 relative z-50 text-center">
                Signup and level up your knowledge.
              </p>

              {/* Meaty part - Meteor effect */}
              <Meteors number={40} className="bg-purple-600" />
            </div>
          </PinContainer>
        </div>

        <div className="w-full h-full">
          <div className="h-full relative shadow-xl bg-black border border-gray-400 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
            <Brain className="mx-auto w-6 h-6 text-white mb-4 float-right"></Brain>

            <h1 className="font-bold text-xl text-white mb-4 relative z-50 w-fit mx-auto">
              Learn from the smartest
            </h1>

            <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
              Explore the knowledge of the smartest people in the world. Get
              access to the best ideas and insights that experts are looking
              into.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
