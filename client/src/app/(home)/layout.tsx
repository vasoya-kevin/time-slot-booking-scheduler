import { Container } from "@/components/common";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Schedule Effortlessly",
  description: "Efforless book slot with others",
};

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return children;
};

export default HomeLayout;
