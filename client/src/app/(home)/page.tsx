import { Container, FeatureCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Container className="font-sans space-y-10 h-full">
        <header className="space-y-1">
          <h1 className="font-serif text-7xl text-primary mx-auto">
            Schenduling Made Easy !
          </h1>
          <p className="text-black/80 text-lg">
            Share your availability and let people book time with you
            effortlessly
          </p>
        </header>
        <section className="flex justify-center items-center space-y-20 flex-col py-20">
          <div className="flex justify-center items-center gap-4">
            <Link href="/sign-up">
              <Button  className="px-10 py-2 cursor-pointer">Get Started</Button>
            </Link>
            <Link href="/sign-in">
              <Button  variant="outline" className="px-10 py-2 cursor-pointer">
                Login
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard />
          </div>
        </section>
      </Container>
    </>
  );
};

export default HomePage;
