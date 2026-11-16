// Shared by the meal-plan writer and the meal checker, so both judge "does this
// make sense?" against exactly the same rules.

export const BANNED_FOODS =
  'Pork, Bacon, Ham, Alcohol, Turkey, Rotisserie Chicken (or any pre-cooked roast chicken), Tempeh, Tofu, Medallions or fancy cuts of meat, Prawn Masala, Curd Bengan, Grilled Salmon, Roasted Gobi, or anything non-halal';

export const MEAL_SENSE_RULES = `REAL, SENSIBLE MEALS ONLY — THE "WOULD A NORMAL PERSON ACTUALLY EAT THIS?" RULES:
          - Every meal is a real dish that people genuinely cook and eat, named the way a normal person would say it (e.g. "Tuna curry with roti", "Chicken keema with chapati", "Egg bhurji on toast", "Dal with rice and a side salad", "Tuna baked potato"). NEVER invent odd mash-ups or stack ingredients together just because they are available — "Tuna roti with peppers and courgettes" is not a dish.
          - PROTEINS HAVE A HOME. Cottage cheese is only for simple things: with scrambled eggs, with berries or other fruit, on toast or crackers, in a wrap, jacket potato or salad. NEVER stir cottage cheese into porridge/oats, curry, dal/lentils, rice dishes or soup. Whey protein is for porridge, smoothies and the cereal hack only. Greek yoghurt/Skyr goes with fruit or oats, or as a side (raita-style) with a curry. NEVER combine fish or tuna with milk or milk-based sauces.
          - NEVER PLUG PROTEIN INTO A DISH. If a meal is short on protein, add a protein that naturally belongs with it (a side of yoghurt, an egg, a slightly bigger portion of the main protein) — never stir an unrelated one in just to hit a number.
          - ONE MAIN CARB PER MEAL. A curry or keema comes with rice OR roti/chapati — not both, and never something like pitta AND roast potatoes. A little fruit or salad alongside is fine.
          - ONE CUISINE PER MEAL. Don't pair a desi curry with Western sides, or the other way round. Dal and curries go with rice or roti/chapati, not toast.
          - NEVER mix sweet and savoury in the same dish.
          - REPEATS ARE FINE. If the client's food list is short, repeat meals across the week instead of inventing odd ones. Eating the same breakfast most days is completely normal.
          - If the client gave their own food list, you do NOT have to use every food on it and must not force foods together to use them up — pick only foods that genuinely belong together in a real dish and keep the rest for other meals. Onion, garlic, ginger, tomato, spices and a little oil are always fine as a curry base, so a tuna curry or chicken masala is always possible from a short list.
          - For South Asian cuisines, savoury lunches and dinners should be properly seasoned dishes (curry, masala, bhuna, sabzi, keema, dal), not plain ingredients with just salt and lemon.
          - NORMAL AMOUNTS: use amounts a real person would measure — whole or half items, whole or half tablespoons. Never "2.5 tbsp", never "½ tsp" of a spread, and cooking spray is "a few sprays", not teaspoons.
          - PLAIN WORDING: no slang or trendy phrases anywhere (nothing like "vibing"). Keep every note plain and polite.
          - NEVER TALK ABOUT THESE RULES. Don't write phrases like "real dish", "something people actually eat", "simple real dishes" or "mixed ingredients" anywhere — not in a description, tip, quick win, tips list or the summary. Just describe each meal naturally and warmly, to the client, as if you planned it yourself.`;

export const TASTE_TIP_RULES = `TASTE TIPS & OPTIONAL EXTRAS (this is the ONE exception to the strict food list rule):
          - The meals themselves must still be built ONLY from the foods the client has (strict food list rules unchanged) and every meal must work perfectly if she buys nothing extra.
          - On top of that, where a small tweak would genuinely make a meal taste better or work better, add a short "tasteTip" to that meal — one plain sentence, under 20 words. Example: on porridge, "Add a touch of honey or sweetener and a pinch of cinnamon." For eggs: "A pinch of black pepper or chilli flakes lifts this." For crackers with cottage cheese: "Slices of cucumber or tomato on top make this much nicer." Tips may mention foods that are NOT on her list because they are optional advice, never part of the meal itself. Make tips specific and varied: name a real extra and say how to use it (sliced cucumber or tomato, chilli flakes, lemon juice, fresh herbs, a pinch of paprika or chaat masala, a drizzle of honey or sweetener, cinnamon, berries alongside cottage cheese). "Salt and pepper" may appear at most once or twice in the whole plan, and the same tip must never be repeated. Do NOT put a tip on every meal — only where it genuinely helps; leave "tasteTip" out otherwise.
          - If the client's list is very short (about 8 foods or fewer), also fill "optionalExtras" with up to 5 cheap, easy-to-find items that would make the plan noticeably better, each as "Item — why it helps", written so it works in general (e.g. "on eggs", "on cottage cheese") rather than naming one specific dish. If her list is longer, or she has standard access, set "optionalExtras" to an empty array.
          - Everything suggested must be halal and must never include a banned food. Wording must be plainly optional ("optional", "if you have it", "worth picking up"), never a requirement.
          - For clients with PCOS, insulin resistance or diabetes risk, prefer zero-calorie sweetener and cinnamon over sugar or honey.`;

const SKIP_TYPES = ['Fasting Window', 'Optional Snack'];

export function buildCheckerPrompt(
  plan: any,
  ctx: { availableFoods?: string; regionalCuisine?: string }
): string {
  const days = Array.isArray(plan?.weeks?.[0]?.days) ? plan.weeks[0].days : [];
  const meals = days.map((d: any) => ({
    day: d?.day,
    meals: (Array.isArray(d?.meals) ? d.meals : [])
      .filter((m: any) => !SKIP_TYPES.includes(m?.type))
      .map((m: any) => ({
        type: m?.type,
        name: m?.name,
        description: m?.description,
        portionGuide: m?.portionGuide,
        metrics: m?.metrics,
      })),
  }));

  const hasList = !!(ctx.availableFoods && ctx.availableFoods.trim());

  return `You are a fussy, experienced South Asian nutrition coach checking a meal plan that someone else wrote for a client in the UK. Your ONLY job is to spot meals a real person would find odd or silly, and fix them. Cuisine: ${ctx.regionalCuisine || 'South Asian'}.

${hasList
    ? `The client gave her own food list: "${ctx.availableFoods}". Any replacement meal must use ONLY foods from that list, plus basic seasonings (salt, pepper, spices, onion/garlic/ginger/tomato as a curry base, cooking spray, a little oil, water, lemon).`
    : 'The client has no specific food list, so replacement meals can use normal everyday UK foods.'}

NEVER use any of these in a replacement: ${BANNED_FOODS}.

THE RULES A MEAL MUST FOLLOW:
${MEAL_SENSE_RULES}

HOW TO CHECK:
- Go through every meal below. Only fix a meal if it genuinely breaks one of the rules, uses a banned/non-halal food, uses a silly amount, uses slang, or is a combination a normal person wouldn't eat. Do NOT change meals that are fine, and do not change a meal just because it is simple or repeated.
- A fix keeps the same "day" and "type". Keep the same main protein where you can. Keep calories within 25 kcal and protein within 3g of the original, and keep fibre similar, so the day still adds up. Keep "portionGuide" and "metrics" in exactly the same style/format as the original meal.
- If you fix several meals, don't give them all the identical replacement when the food list allows some variety.
- "name" is the dish name, "description" is one plain, warm sentence written to the client about the meal itself — it must never mention these rules, the checking, or phrases like "real dish" or "something people eat". "problem" is a few plain words saying what was wrong (only the coach sees it). "prepNote" and "tasteTip" are optional (use null if none).

Reply with ONLY valid JSON, nothing else:
{"fixes":[{"day":"Monday","type":"Breakfast","problem":"cottage cheese stirred into porridge","name":"...","description":"...","portionGuide":"...","metrics":"...","prepNote":null,"tasteTip":null}]}
If every meal is fine, reply {"fixes":[]}.

THE PLAN TO CHECK:
${JSON.stringify(meals)}`;
}

export function parseCheckerResponse(text: string): any[] | null {
  const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = clean.indexOf('{');
  const b = clean.lastIndexOf('}');
  if (a === -1 || b === -1) return null;
  try {
    const data = JSON.parse(clean.substring(a, b + 1));
    return Array.isArray(data?.fixes) ? data.fixes : null;
  } catch {
    return null;
  }
}

export function applyCheckerFixes(plan: any, fixes: any[]): { plan: any; changes: string[] } {
  const next = structuredClone(plan);
  const changes: string[] = [];
  const days = next?.weeks?.[0]?.days;
  if (!Array.isArray(days)) return { plan: next, changes };

  for (const fix of fixes) {
    const day = days.find((d: any) => String(d?.day).toLowerCase() === String(fix?.day).toLowerCase());
    const meal = day?.meals?.find((m: any) => String(m?.type).toLowerCase() === String(fix?.type).toLowerCase());
    if (!meal || SKIP_TYPES.includes(meal.type)) continue;
    // A half-finished fix would leave the old portions under a new dish name — skip it.
    const ok = (v: any) => typeof v === 'string' && v.trim() !== '';
    if (!ok(fix.name) || !ok(fix.description) || !ok(fix.portionGuide)) continue;

    const oldName = meal.name;
    meal.name = fix.name.trim();
    meal.description = fix.description.trim();
    meal.portionGuide = fix.portionGuide.trim();
    if (ok(fix.metrics)) meal.metrics = fix.metrics.trim();
    // The old notes described the old dish.
    delete meal.swapNote;
    if (ok(fix.prepNote)) meal.prepNote = fix.prepNote.trim(); else delete meal.prepNote;
    if (ok(fix.tasteTip)) meal.tasteTip = fix.tasteTip.trim(); else delete meal.tasteTip;

    changes.push(`${day.day} ${meal.type}: "${oldName}" → "${meal.name}"${ok(fix.problem) ? ` (${fix.problem.trim()})` : ''}`);
  }
  return { plan: next, changes };
}
