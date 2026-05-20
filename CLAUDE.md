@AGENTS.md

# Z.A Training — Coaching Meal Planner

## Who Zayb is
Zayb Abbas runs Z.A Training, a nutrition coaching business targeting **busy South Asian women in the UK**. He is a complete beginner with no coding background. Always explain things in plain English, no jargon. Step-by-step instructions must assume zero technical knowledge.

## What this app does
A private coach tool. Zayb fills in a client's details and the app uses AI to generate a fully personalised, printable nutrition protocol (PDF) for that client. Clients never log in — only Zayb uses this.

## Target clients
- South Asian women (Pakistani, Indian, Bangladeshi, Sri Lankan)
- Based in the UK
- Busy lifestyles, cooking for families
- Common goals: fat loss, PCOS management, perimenopause/menopause support

---

## Z.A Training Coaching Methodology

### Nutrition rules
- Calculate TDEE, then apply 300–500 kcal deficit for fat loss
- Protein target: 1.8–2.2g per kg of bodyweight
- Fibre: minimum 25g, aim for 30g from whole foods
- Never drop below 1200–1300 kcal/day
- South Asian meals are the foundation — no Western defaults unless requested
- Every meal must have a clear protein source (dal/lentils alone do not count)

### Hormonal/medical adaptations
- **PCOS / Insulin Resistance** — low-GI foods, reduce refined carbs, always pair carbs with protein or fat
- **Perimenopause / Menopause** — increase calcium, prioritise protein

### The Z.A Reality Check
If a client's goal requires losing more than 0.8kg/week, cap the deficit at 500 kcal and add a blunt reality check note as the first tip.

---

## Z.A Training Signature Hacks

- **The Cereal Hack** — Whey protein + milk + water shaken, poured over Bran Flakes or Weetabix
- **The Egg Volume Hack** — 1 whole egg + 150ml egg whites (bumps protein without extra calories)

## Go-To Carbs (UK products)
Warburtons Protein Bagels/Thins, Jason's Protein Sourdough, Ainsley Harriott Couscous (Sundried Tomato & Garlic), microwave rice, baby potatoes (air-fried or baked), 1 medium chapati (max 30–60g)

## Go-To Proteins (UK products)
Arla/Brooklea/GetPRO protein yoghurts, Skyr, fat-free Greek yoghurt, lean chicken keema (mince), chicken thighs/breast, frozen white fish/basa, smoked salmon, John West Infusions Tuna pots

## Signature Meals
Protein smoothie (whey, ice, frozen berries, 1 tsp PB, semi-skim milk), cheesecake/overnight oats, eggs & smoked salmon on a protein bagel, tuna baked potato with light mayo & mozzarella, chicken/kebab wraps

## Signature Snacks
Babybel Light with apple, boiled eggs, Quest/Fulfil bars, rice cakes with PB, edamame, whole almonds

## South Asian Cooking Rules
- Measure curries and biryani by "1.5 fistfuls"
- Cook with cooking spray/water first, add a tiny bit of oil later
- No fried onions in biryani
- Add Greek yoghurt as a side to low-protein curries to boost protein
- Use chicken mince over lamb/beef where possible

## Coaching Tone
Practical, direct, jargon-free. Written to the client. Examples: "Chill on the oil!", "Comfort food, don't overdo it", "Use common sense", "Air-fry to save time", "Always WhatsApp me if you are ever unsure"

---

## Strictly Forbidden Foods
NEVER include in any meal plan: Pork, Bacon, Alcohol, Turkey, Rotisserie Chicken, Tempeh, Tofu, Medallions or fancy/expensive cuts of meat, Prawn Masala, Curd Bengan, Grilled Salmon, Roasted Gobi

---

## Tech Stack
- **Next.js** (React) — the app framework
- **Vercel** — hosts the live app (auto-deploys when code is pushed to GitHub)
- **GitHub** — stores the code (repo: ZaybAbbas/coachesmealplanner)
- **Google Gemini API** — the AI that generates the meal plans (key stored in Vercel as `GEMINI_API_KEY`)
- The AI call is handled server-side in `app/api/generate/route.ts` — the API key is never exposed publicly
