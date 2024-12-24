import React from "react";
import ScrollableLayout from "../layouts/ScrollableLayout";
import { BackgroundBeamsWithCollision } from "../components/aceturnity/background-beams-with-collision";
import { Button } from "../components/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/shadcn/card";
import { Badge } from "../components/shadcn/badge";
import LandingImage1 from "../assets/output-4.jpg";
import LandingImage2 from "../assets/output-3.jpg";

export const Landing: React.FC = () => {
  return (
    <ScrollableLayout>
      <div className="flex flex-col gap-2">   
      <div className="relative flex flex-col justify-start items-center min-h-[80vh] ">
      <BackgroundBeamsWithCollision className="absolute w-[100vw] min-h-[80vh]">
          <div className="relative z-10 text-center px-4 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl max-w-4xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
            Master Python with{" "}
            <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-2 md:py-4 from-pink-500 via-green-400 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                <span className="">Slither&Solve</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-pink-400 via-green-400 to-green-500 py-2 md:py-4">
                <span className="">Slither&Solve</span>
            </div>
            </div>
            </h2>
            <p className="text-lg md:text-xl mb-8 dark:text-white">
              Learn Python through interactive flashcards and coding challenges.
              Master concepts at your own pace, one card at a time.
            </p>
            <Button className="dark:text-white bg-pink-500 hover:bg-pink-600">
              Start learning for free
            </Button>
            <div className="mt-12 flex items-center justify-center dark:text-white">
              <div className="ml-4 flex flex-col justify-center items-center">
                <span className="text-yellow-400">★★★★★</span>
                <span>Created by an Imperial College London graduate</span>
                <span className="text-sm text-gray-500">Former Engineer at Arm & Palantir</span>
              </div>
            </div>
          </div>
        </BackgroundBeamsWithCollision>
      </div>

      <h1 className="text-2xl md:text-4xl font-bold mb-8 text-center dark:text-white my-4">
        The smartest way to master Python programming
      </h1>
      
      <div className="grid grid-cols-5 gap-4 mb-4 max-w-6xl mx-auto">
        <Card className="col-span-3 hover:border-green-500 ease-in-out">
          <CardHeader>
            <CardTitle>Interactive Flashcards</CardTitle>
            <CardDescription>
              Practice Python concepts with our smart flashcard system that adapts to your learning pace.
              <br />
              <Button variant="link" className="p-0 text-pink-500">Try now →</Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 border rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Learning Progress</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cards Mastered</span>
                  <span>150+</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span>85%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 hover:border-pink-500 ease-in-out">
          <CardHeader>
            <CardTitle>Real-time Code Execution</CardTitle>
            <CardDescription>
              Write and test Python code directly in your browser with instant feedback.
              <br />
              <Button variant="link" className="p-0 text-green-500">Try coding →</Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-2">
              <Badge variant="outline" className="border-pink-500">Python 3.x</Badge>
              <Badge variant="outline" className="border-green-500">Interactive</Badge>
              <Badge variant="outline" className="border-pink-500">Real-time</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto my-16 px-4">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img 
                src={LandingImage1}
                alt="Spaced Repetition Learning" 
                className="w-full aspect-square h-auto object-cover rounded-lg shadow-lg"
            />
        </div>
        <div className="w-full md:w-1/2 md:pl-8 flex flex-col justify-center dark:text-white">
            <p className="font-bold text-green-500">PROVEN LEARNING METHOD</p>
            <h2 className="text-3xl font-bold mb-4">Master Python Through Spaced Repetition</h2>
            <p className="text-lg mb-6">
            Learn Python effectively using scientifically-proven spaced repetition techniques. 
            Break down complex programming concepts into manageable, bite-sized pieces that stick in your memory.
            Perfect for beginners starting their coding journey.
            <br/>
            <Button className="bg-green-500 hover:bg-green-600 text-white mt-4">Start Learning</Button>
            </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-6xl mx-auto my-16 px-4 dark:text-white">
        <div className="w-full md:w-1/2 md:pl-8 flex flex-col justify-center">
            <p className="font-bold text-green-500">INDUSTRY EXPERTISE</p>
            <h2 className="text-3xl font-bold mb-4">Learn from Big Tech Experience</h2>
            <p className="text-lg mb-6">
            Benefit from curriculum designed by someone who's worked at leading tech companies 
            like Arm and Palantir, with offers from Apple and Improbable. Get insider knowledge 
            on what it takes to succeed in tech.
            <br/>
            <Button className="bg-green-500 hover:bg-green-600 text-white mt-4">View Curriculum</Button>
            </p>
        </div>
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img 
                src={LandingImage2}
                alt="Tech Industry Experience" 
                className="w-full aspect-square h-auto object-cover rounded-lg shadow-lg"
            />
        </div>
      </div>

      <div className="relative flex items-center justify-center my-50 min-h-[20vh]">
        <div className="absolute w-[100vw] min-h-[20vh] bg-gray-800 flex flex-col justify-center items-center">
            <h1 className="relative text-4xl font-bold m-0">
                <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-2 from-pink-500 via-green-400 to-green-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                    Begin Your Python Journey
                </div>
                <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-pink-400 via-green-400 to-green-500 py-2">
                    Begin Your Python Journey
                </div>
            </h1>
            <p className="text-white mb-1">Learn Python from industry professionals</p>
            <Button variant="secondary" className="bg-pink-500 hover:bg-pink-600 text-white">Start Free Trial</Button>
        </div>
      </div>
      </div>
    </ScrollableLayout>
  );
};