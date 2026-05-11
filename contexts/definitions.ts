// contexts/definitions.ts

export type MentalDefinition = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
};

export const mentalDefinitions: MentalDefinition[] = [
  {
    id: "adhd",
    title: "Attention Deficit Hyperactivity Disorder",
    shortTitle: "ADHD",
    description:
      "ADHD is a neurodevelopmental condition that affects attention, impulsivity, and activity levels. People with ADHD may struggle with focus, organization, restlessness, or maintaining routines in daily life.",
  },

  {
    id: "bipolar",
    title: "Bipolar Disorder",
    shortTitle: "Bipolar",
    description:
      "Bipolar disorder is a mental health condition characterized by intense mood changes, including emotional highs known as mania and periods of depression that can affect energy, sleep, and behavior.",
  },

  {
    id: "schizophrenia",
    title: "Schizophrenia",
    shortTitle: "Schizophrenia",
    description:
      "Schizophrenia is a complex mental disorder that can impact thinking, emotions, perception, and behavior. Some individuals may experience hallucinations, disorganized thoughts, or difficulty distinguishing reality.",
  },
];