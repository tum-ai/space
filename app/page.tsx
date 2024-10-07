import { getDayOfYear } from "date-fns";
import { Quote, Rocket } from "lucide-react";
import Loading from "./loading";

type Quote = {
  text: string;
  attribution: string;
};

export default function Home() {
  const inspirationalQuotes: Quote[] = [
    {
      text: "The only way to do great work is to love what you do.",
      attribution: "Steve Jobs",
    },
    {
      text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
      attribution: "Winston Churchill",
    },
    {
      text: "Believe you can and you're halfway there.",
      attribution: "Theodore Roosevelt",
    },
    {
      text: "Your time is limited, so don’t waste it living someone else’s life.",
      attribution: "Steve Jobs",
    },
    {
      text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      attribution: "Ralph Waldo Emerson",
    },
    {
      text: "Do not wait for leaders; do it alone, person to person.",
      attribution: "Mother Teresa",
    },
    {
      text: "It always seems impossible until it’s done.",
      attribution: "Nelson Mandela",
    },
    { text: "Dream big and dare to fail.", attribution: "Norman Vaughan" },
    {
      text: "Start where you are. Use what you have. Do what you can.",
      attribution: "Arthur Ashe",
    },
    {
      text: "The best way to predict the future is to create it.",
      attribution: "Peter Drucker",
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      attribution: "Sam Levenson",
    },
    {
      text: "Keep your face always toward the sunshine—and shadows will fall behind you.",
      attribution: "Walt Whitman",
    },
    {
      text: "Opportunities don't happen, you create them.",
      attribution: "Chris Grosser",
    },
    {
      text: "Success usually comes to those who are too busy to be looking for it.",
      attribution: "Henry David Thoreau",
    },
    {
      text: "You miss 100% of the shots you don’t take.",
      attribution: "Wayne Gretzky",
    },
    {
      text: "I find that the harder I work, the more luck I seem to have.",
      attribution: "Thomas Jefferson",
    },
    {
      text: "The future belongs to those who believe in the beauty of their dreams.",
      attribution: "Eleanor Roosevelt",
    },
    {
      text: "Don’t be afraid to give up the good to go for the great.",
      attribution: "John D. Rockefeller",
    },
    {
      text: "I wake up every morning and think to myself, ‘How far can I push this company in the next 24 hours?’",
      attribution: "Leah Busque",
    },
    {
      text: "If you really look closely, most overnight successes took a long time.",
      attribution: "Steve Jobs",
    },
    {
      text: "99% of gamblers quit right before they hit it big.",
      attribution: "Unknown",
    },
    {
      text: "Whether you think you can or you think you can’t, you’re right.",
      attribution: "Henry Ford",
    },
    {
      text: "I have not failed. I've just found 10,000 ways that won't work.",
      attribution: "Thomas Edison",
    },
    {
      text: "The only limit to our realization of tomorrow is our doubts of today.",
      attribution: "Franklin D. Roosevelt",
    },
    {
      text: "The best revenge is massive success.",
      attribution: "Frank Sinatra",
    },
    {
      text: "The road to success and the road to failure are almost exactly the same.",
      attribution: "Colin R. Davis",
    },
  ];

  const dayOfYear = getDayOfYear(new Date());
  const quoteOfTheDay =
    inspirationalQuotes[dayOfYear % inspirationalQuotes.length];

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 text-center">
      <div>
        <blockquote className="max-w-2xl space-y-2">
          <p className="text-3xl font-semibold">{quoteOfTheDay?.text}</p>
          <footer className="">- {quoteOfTheDay?.attribution}</footer>
        </blockquote>
      </div>
    </div>
  );
}
