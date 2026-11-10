import React from "react";
import {
  Waves,
  Dumbbell,
  Trees,
  ShieldCheck,
  Car,
  Building2,
  Sparkles,
  Compass,
  Coffee,
  ShoppingBag,
  Utensils,
  Bike,
  Wifi,
  Sun,
  Baby,
  Home,
  Tv,
  Coins,
  KeyRound,
  Percent,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  Landmark,
  Shield,
  Award,
} from "lucide-react";

export const AMENITY_ICON_OPTIONS = [
  { value: "Waves", label: "Swimming Pool / Water" },
  { value: "Dumbbell", label: "Gym / Fitness Center" },
  { value: "Trees", label: "Parks / Gardens" },
  { value: "ShieldCheck", label: "24/7 Security" },
  { value: "Car", label: "Covered Parking" },
  { value: "Building2", label: "Community / Business Lounge" },
  { value: "Sparkles", label: "Spa / Wellness / Concierge" },
  { value: "Compass", label: "Walking Trails / Promenade" },
  { value: "Coffee", label: "Cafes & Lounges" },
  { value: "ShoppingBag", label: "Retail Promenade" },
  { value: "Utensils", label: "Fine Dining & BBQ" },
  { value: "Bike", label: "Cycling & Sports" },
  { value: "Sun", label: "Private Beach & Solarium" },
  { value: "Baby", label: "Kids Play Area & Nursery" },
  { value: "Home", label: "Smart Home Automation" },
  { value: "Tv", label: "Cinema & Entertainment" },
  { value: "Wifi", label: "High-Speed Connectivity" },
];

export const MILESTONE_ICON_OPTIONS = [
  { value: "Coins", label: "Down Payment / Deposit" },
  { value: "Building2", label: "Construction Milestone" },
  { value: "KeyRound", label: "Handover & Keys" },
  { value: "Percent", label: "Installment Percentage" },
  { value: "CreditCard", label: "Flexible Installments" },
  { value: "CalendarDays", label: "Scheduled Milestones" },
  { value: "ShieldCheck", label: "Escrow & Guarantee" },
  { value: "Landmark", label: "Bank & Financing" },
];

export function renderAmenityIcon(iconName?: string, className = "h-6 w-6") {
  switch (iconName) {
    case "Waves":
      return <Waves className={className} />;
    case "Dumbbell":
      return <Dumbbell className={className} />;
    case "Trees":
      return <Trees className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Car":
      return <Car className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Coffee":
      return <Coffee className={className} />;
    case "ShoppingBag":
      return <ShoppingBag className={className} />;
    case "Utensils":
      return <Utensils className={className} />;
    case "Bike":
      return <Bike className={className} />;
    case "Sun":
      return <Sun className={className} />;
    case "Baby":
      return <Baby className={className} />;
    case "Home":
      return <Home className={className} />;
    case "Tv":
      return <Tv className={className} />;
    case "Wifi":
      return <Wifi className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

export function renderMilestoneIcon(iconName?: string, className = "h-5 w-5") {
  switch (iconName) {
    case "Coins":
      return <Coins className={className} />;
    case "Building2":
      return <Building2 className={className} />;
    case "KeyRound":
      return <KeyRound className={className} />;
    case "Percent":
      return <Percent className={className} />;
    case "CreditCard":
      return <CreditCard className={className} />;
    case "CalendarDays":
      return <CalendarDays className={className} />;
    case "ShieldCheck":
      return <ShieldCheck className={className} />;
    case "Landmark":
      return <Landmark className={className} />;
    default:
      return <Coins className={className} />;
  }
}
