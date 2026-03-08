import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

const ROAST_BANK: { keywords: string[]; roasts: string[] }[] = [
  {
    keywords: ["appearance", "look", "face", "ugly", "body", "weight", "fat", "skin"],
    roasts: [
      "You look like God was trying to draw a person from memory after a three-day bender and said 'fuck it, ship it.' You absolute aesthetic disaster.",
      "Your face could make a blind man beg to stay blind. I've seen more attractive things crawl out of a drain.",
      "You're built like someone described a human being over the phone to someone who'd never seen one. Whatever you're working with, it ain't it.",
      "You have the kind of face that makes people suddenly remember they left the stove on. Every room you walk into gets 30% uglier.",
      "I've seen better-looking creatures washed up on a beach after an oil spill. At least they had the decency to look sad about it.",
      "Your body looks like it was designed by a committee that had never agreed on anything. Mismatched, chaotic, and deeply unfortunate.",
      "You absolute dumb bitch — even your mirror is trying to figure out what went wrong. Whatever genetic lottery produced you, it lost.",
    ],
  },
  {
    keywords: ["intelligence", "smart", "stupid", "dumb", "brain", "idiot", "moron", "iq"],
    roasts: [
      "Your brain is so small that neurons have to carpool just to form a single thought. You're the human equivalent of a 404 error.",
      "You are living proof that evolution occasionally goes into reverse. Congratulations on being the dumbest bastard I've ever had the displeasure of roasting.",
      "If stupidity were a sport, you'd get disqualified for being too goddamn good at it. You've somehow made being an idiot look like a full-time career.",
      "I've seen more intellectual activity from a potato left in a dark cupboard. At least the potato has the decency not to talk.",
      "You have the critical thinking skills of a broken vending machine — loud, frustrating, and reliably delivering nothing useful.",
      "Talking to you is like trying to explain calculus to a shoe. The shoe gets it faster and doesn't argue back.",
      "You dumbfuck — the audacity of you having opinions when you can barely operate a door handle. Truly staggering levels of stupid.",
      "You are a dumb bitch of the highest order. Not the fun kind — the kind that makes people question the concept of public education.",
    ],
  },
  {
    keywords: ["job", "work", "career", "money", "broke", "poor", "employed", "unemployed", "boss", "salary"],
    roasts: [
      "Your career is such a tragedy that LinkedIn is thinking about adding a 'thoughts and prayers' reaction just for your profile.",
      "You're so broke that your bank account makes the economy look healthy by comparison. Congratulations on being a financial cautionary tale.",
      "Your job title should just be 'disappointment, full time.' You've somehow monetized mediocrity and still come out behind.",
      "You're the kind of employee that makes HR question their entire career path. A walking, talking reason to automate everything.",
      "Your professional life is so bleak that your references just send a card with a single word: 'No.'",
      "The economy doesn't want you. Your industry doesn't want you. Even unemployment statistics are embarrassed to count you.",
      "You loser — you've had more career restarts than a broken computer and less to show for it. A résumé so thin it's see-through.",
    ],
  },
  {
    keywords: ["relationship", "dating", "love", "single", "girlfriend", "boyfriend", "wife", "husband", "sex", "lonely"],
    roasts: [
      "You're so undateable that your own reflection swipes left. People don't just friendzone you — they create entire new zones nobody's ever heard of.",
      "Your relationship history reads like a horror anthology. Every chapter ends with someone running, changing their number, and moving cities.",
      "You're the reason people stay in bad relationships — because the alternative is meeting someone like you. A walking argument for settling.",
      "Even the sex toy you ordered sent itself back with a politely worded note. You somehow managed to make an inanimate object uncomfortable.",
      "Your love life is a disaster so complete it should be studied academically. Scientists have named a new category of loneliness after you.",
      "You give off the kind of energy that makes people suddenly remember they have a 'thing' — any thing — to get away from you.",
      "You absolute cunt — no wonder they left. Anyone with functioning self-respect would. You're a masterclass in why people choose to be alone.",
    ],
  },
  {
    keywords: ["coding", "programming", "developer", "software", "engineer", "code", "tech", "computer"],
    roasts: [
      "Your code looks like it was written by someone having a stroke during a fire drill. Stack Overflow has banned your IP address out of self-preservation.",
      "You're the kind of developer who pushes to main on a Friday afternoon and then goes on vacation. You're not a programmer — you're a war crime.",
      "Your GitHub is a graveyard of half-finished projects and bad ideas. 'Hello World' is the most successful thing you've ever shipped.",
      "You write code the way a cat walks across a keyboard — chaotic, purposeless, and somehow always breaking something critical in production.",
      "Junior devs look at your code and quit the industry. Senior devs look at it and start drinking. You are a public health hazard.",
      "You debug by turning it off and on again and then crying. Your error messages have error messages. You are the incident.",
    ],
  },
  {
    keywords: ["hair", "bald", "haircut", "style", "fashion", "clothes", "dress"],
    roasts: [
      "Your haircut looks like you lost a bet and the barber had a personal vendetta. I've seen better styling on a scarecrow that gave up.",
      "You dress like you're trying to commit a crime against fashion and get away with it. Every outfit is a cry for help nobody's answering.",
      "Whatever you're doing with your hair, it isn't working — and it never has. Nature is embarrassed to be associated with whatever that is.",
      "Your sense of style is so aggressively terrible that it loops back around to being impressive. You've weaponized bad taste.",
      "You look like you got dressed in a dark room in someone else's house. On the way to a funeral. In 2003.",
    ],
  },
  {
    keywords: ["lazy", "useless", "nothing", "idle", "sitting", "waiting", "wasting", "bored", "inactiv"],
    roasts: [
      "You've been sitting there doing absolutely nothing so long that sloth is starting to look at you and think 'Jesus, get your shit together.' You're an embarrassment to inertia.",
      "The audacity of your laziness is genuinely impressive. You've achieved a level of uselessness that most people only dream about in their worst moments.",
      "You're doing nothing so hard it looks like a full-time job. A shit one. With no benefits. That nobody hired you for.",
      "Even furniture is more productive than you right now. The chair you're sitting on has more purpose. At least it's holding something up — barely.",
      "You sat there so long the couch filed a restraining order. You are a monument to wasted potential and cheap excuses.",
      "The universe waited 14 billion years to produce you, and you're sitting there doing jack shit. Time to feel every ounce of that disappointment.",
    ],
  },
];

const GENERAL_ROASTS = [
  "You are the human equivalent of a participation trophy — nobody asked for you, nobody's proud of you, and you exist purely to make other people feel better about themselves by comparison.",
  "You have the personality of a wet fart in a crowded elevator. Everyone knows it's you. Everyone hates it. Nobody wants to be near you.",
  "Your existence is the strongest argument against intelligent design. Something this irritating and useless couldn't have been planned.",
  "You're proof that the bar for being a person is set embarrassingly low and you're still finding ways to trip over it.",
  "The best part of you is whatever room you just left. Everything you touch turns to disappointment. It's almost an art form.",
  "You are the reason disclaimers exist on things that should be obvious. A walking, breathing, aggressively mediocre cautionary tale.",
  "You have somehow managed to be both forgettable and insufferable at the same time. That's not easy — in fact it's your only achievement.",
  "I've met furniture with more charisma and depth than you. At least the furniture serves a purpose without whining about it.",
  "You're what happens when someone asks for a person and the universe cuts corners. A discount-bin human with no return policy.",
  "You're the kind of person who makes strangers on the internet grateful for their own lives. Congratulations — that's genuinely your biggest contribution.",
  "If you were a smell, you'd be the inside of a car in August. Overpowering, inescapable, and making everyone desperate for fresh air.",
  "You are a one-person argument for selective sterilization, and the sad part is you'll never understand why.",
  "You absolute loser — not even in the lovable underdog way. In the sad, preventable, entirely your own fault way.",
  "You dumbfuck. The instructions for your life were written in crayon and you still couldn't follow them.",
  "You're the kind of cunt that makes people relieved when they check their phone and it's not you.",
  "Dumb bitch energy radiates off you like heat from asphalt. It's impressive, really — a masterpiece of obliviousness.",
  "You're such a special kind of retard that scientists have yet to name the condition. Groundbreaking, truly.",
];

function pickRoast(topic: string): string {
  const t = topic.toLowerCase();
  for (const category of ROAST_BANK) {
    if (category.keywords.some((kw) => t.includes(kw))) {
      const pool = category.roasts;
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return GENERAL_ROASTS[Math.floor(Math.random() * GENERAL_ROASTS.length)];
}

async function seed() {
  const existing = await storage.getRoasts();
  if (existing.length === 0) {
    const seeds = [
      { content: ROAST_BANK[0].roasts[0], topic: "appearance" },
      { content: ROAST_BANK[1].roasts[1], topic: "intelligence" },
      { content: ROAST_BANK[2].roasts[2], topic: "career" },
      { content: ROAST_BANK[3].roasts[0], topic: "relationships" },
      { content: GENERAL_ROASTS[0], topic: "general" },
    ];
    for (const s of seeds) await storage.createRoast(s);
    console.log("Seeding complete");
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.post(api.roasts.create.path, async (req, res) => {
    try {
      const input = api.roasts.create.input.parse(req.body);
      const topic = input.topic || "general existence";
      const content = pickRoast(topic);
      const roast = await storage.createRoast({ content, topic });
      res.status(201).json(roast);
    } catch (err) {
      console.error("Roast error:", err);
      const content = GENERAL_ROASTS[Math.floor(Math.random() * GENERAL_ROASTS.length)];
      const roast = await storage.createRoast({ content, topic: "error" });
      res.status(201).json(roast);
    }
  });

  app.get(api.roasts.list.path, async (req, res) => {
    const roasts = await storage.getRoasts();
    res.json(roasts);
  });

  seed().catch(console.error);

  return httpServer;
}
