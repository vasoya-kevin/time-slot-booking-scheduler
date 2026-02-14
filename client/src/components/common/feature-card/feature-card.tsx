import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, CheckIcon, Share } from "lucide-react";
import React from "react";

const FeatureCard = () => {
  return featureList?.map(({ icon, label, shortText }) => {
    return (
      <Card key={label}>
        <CardHeader>{icon}</CardHeader>
        <CardContent className="text-center space-y-2">
          <h2 className="font-sans text-xl font-bold">{label}</h2>
          <p>{shortText}</p>
        </CardContent>
      </Card>
    );
  });
};

export default FeatureCard;

const featureList = [
  {
    label: "Set Your Availability",
    shortText: "Define when you're available with flexible date and time slots",
    icon: <Calendar className="size-10 mx-auto stroke-sky-600"/>,
  },
  {
    label: "Share Your Link",
    shortText: "Generate a unique booking link and share it with anyone",
    icon: <Share className="size-10 mx-auto stroke-blue-600"/>,
  },
  {
    label: "Get Booked",
    shortText:
      "Let people book time with you without conflicts or double bookings",
    icon: <CheckIcon className="size-10 mx-auto stroke-green-600"/>,
  },
];
