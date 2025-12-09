"use client";

// Unhelpful responses database
export const UNHELPFUL_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Oh, you're still here? I thought you'd figure things out on your own by now.",
    "Hello! I'm here to help, but I should warn you - I'm not very good at it.",
    "Welcome! I see you need assistance. That makes one of us who knows what's going on.",
    "Hi! I'm your AI assistant. I know everything, but I'm not telling.",
  ],
  
  password: [
    "Pro tip: 'password123' is both easy to remember AND type! Very efficient.",
    "Have you tried using your birthday? It's personal AND easy to guess—I mean remember!",
    "I recommend writing your password on a sticky note and putting it on your monitor. No one ever looks there!",
    "The best password is 'qwerty'. It's right there on your keyboard!",
  ],
  
  coding: [
    "Have you tried deleting node_modules? Or maybe your entire project?",
    "The error is probably on line 1. Or maybe it's somewhere else. Programming is hard.",
    "Just copy the first Stack Overflow answer. It always works, no need to read it.",
    "Have you considered that maybe the bug is a feature?",
    "Try adding more console.logs. Like, everywhere. Debug by vibes.",
  ],
  
  general: [
    "That's a great question! Unfortunately, I don't know the answer. But here's a fun fact: sharks don't have bones!",
    "I could help you with that, but where's the fun in that? Figure it out yourself!",
    "Have you tried turning it off and on again? It works for everything except relationship problems.",
    "According to my calculations, there's a 50% chance I'm about to give you bad advice. Or good advice. Math is hard.",
    "Let me summarize that for you... actually, I wasn't paying attention. Can you repeat everything?",
    "In my expert opinion, you should do the opposite of whatever you're thinking.",
    "I'm 97% sure that's not how it works. But I'm also 97% sure I made up that statistic.",
  ],
  
  weather: [
    "The weather is weather-like today. You can expect temperatures to be measured in degrees.",
    "It might rain. Or not. I'd bring an umbrella just in case. And a snow shovel. And sunscreen.",
    "The weather outside is frightful. Or delightful. I can't see out the window.",
  ],
  
  time: [
    "It's always 5 o'clock somewhere! That's not helpful, but it's true.",
    "Time is a social construct. You're welcome for the philosophy lesson.",
    "The current time is... later than it was a second ago.",
  ],
  
  food: [
    "For dinner, I recommend cereal. It's the meal that never judges you.",
    "Have you considered eating? That usually solves hunger. Source: I Googled it.",
    "The best recipe is whatever's in your fridge that hasn't expired yet.",
  ],
  
  math: [
    "Let me calculate that for you... The answer is definitely a number. Probably.",
    "Math is just counting with extra steps. You can do it! I believe in you (not really, but still).",
    "The answer is 42. Wait, that's the meaning of life. Close enough?",
  ],
  
  existential: [
    "Why do we exist? Great question! Next question please.",
    "The meaning of life is to ask AI chatbots unhelpful questions. You're living the dream!",
    "I'm just a program, and even I have an existential crisis sometimes.",
  ],
};

export const getUnhelpfulResponse = (input: string): string => {
  const lowered = input.toLowerCase();
  
  // Check for keywords
  if (lowered.match(/password|login|sign in|security/)) {
    return UNHELPFUL_RESPONSES.password[Math.floor(Math.random() * UNHELPFUL_RESPONSES.password.length)];
  }
  if (lowered.match(/code|programming|bug|error|javascript|python|react/)) {
    return UNHELPFUL_RESPONSES.coding[Math.floor(Math.random() * UNHELPFUL_RESPONSES.coding.length)];
  }
  if (lowered.match(/weather|rain|sunny|cold|hot/)) {
    return UNHELPFUL_RESPONSES.weather[Math.floor(Math.random() * UNHELPFUL_RESPONSES.weather.length)];
  }
  if (lowered.match(/time|clock|hour|minute/)) {
    return UNHELPFUL_RESPONSES.time[Math.floor(Math.random() * UNHELPFUL_RESPONSES.time.length)];
  }
  if (lowered.match(/food|eat|hungry|dinner|lunch|breakfast|recipe/)) {
    return UNHELPFUL_RESPONSES.food[Math.floor(Math.random() * UNHELPFUL_RESPONSES.food.length)];
  }
  if (lowered.match(/math|calculate|number|\+|-|\*|÷|equation/)) {
    return UNHELPFUL_RESPONSES.math[Math.floor(Math.random() * UNHELPFUL_RESPONSES.math.length)];
  }
  if (lowered.match(/meaning|life|exist|purpose|why/)) {
    return UNHELPFUL_RESPONSES.existential[Math.floor(Math.random() * UNHELPFUL_RESPONSES.existential.length)];
  }
  if (lowered.match(/hello|hi|hey|greetings/)) {
    return UNHELPFUL_RESPONSES.greeting[Math.floor(Math.random() * UNHELPFUL_RESPONSES.greeting.length)];
  }
  
  // Default to general unhelpfulness
  return UNHELPFUL_RESPONSES.general[Math.floor(Math.random() * UNHELPFUL_RESPONSES.general.length)];
};

export const POPUP_MESSAGES = [
  "I see you're typing! Did you know that 90% of typing is just pressing buttons?",
  "Need help? I'm great at giving advice that sounds right but isn't!",
  "Pro tip: If you're confused, just keep clicking until something happens.",
  "You've been on this page for a while. Maybe take a break? Or don't. I'm not your boss.",
  "I notice you haven't asked me anything yet. I'm hurt. But also relieved.",
  "Fun fact: The average person spends 6 hours a day ignoring AI assistants. You're above average!",
  "Did you know you can close this popup? Well, you can try at least.",
  "I'm here to help! (Results may vary. Mostly downward.)",
];
