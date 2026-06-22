'use client';

import React, { useState } from 'react';
import { 
  User, Calendar, Target, 
  FileText, Download, ArrowLeft, Loader2, CheckCircle2,
  Utensils, Activity, AlertCircle, Globe, HeartPulse,
  Clock, Lightbulb, Wand2, Upload
} from 'lucide-react';


const LOGO_URL = "https://firebasestorage.googleapis.com/v0/b/accountability-566c2.firebasestorage.app/o/088529ce-52f4-4ef7-a65f-0923d5901386.png?alt=media";

export default function App() {
  const [view, setView] = useState('dashboard');
  const [formData, setFormData] = useState({
    clientName: '',
    age: '',
    height: '',
    weight: '',
    goal: 'Fat loss',
    timeframe: 'Lose 5kg over 12 weeks',
    activityLevel: 'Lightly active',
    manualCalories: '',
    hormonalStatus: 'Regular cycle',
    medicalFlags: 'None',
    durationWeeks: 1,
    approach: 'Calories & Macros',
    carbPreference: 'Moderate',
    dietaryPreferences: 'Standard',
    regionalCuisine: 'Indian',
    cookingFor: 'Herself only',
    familySize: '4',
    cookingTime: '30 mins',
    batchCooking: 'Yes',
    religiousFasting: 'None',
    availableFoods: ''
  });
  
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [error, setError] = useState('');
  const [showTargets, setShowTargets] = useState(true);
  const [showDailyTotals, setShowDailyTotals] = useState(true);
  const [streamedChars, setStreamedChars] = useState(0);
  const [convertFile, setConvertFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [planMode, setPlanMode] = useState('full'); // 'full' or 'starter'
  const [starterPlan, setStarterPlan] = useState<any>(null);
  const [starterNotes, setStarterNotes] = useState('');
  const [showStarterNotes, setShowStarterNotes] = useState(false);

  // --- Starter plan edit helpers ---
  const updateStarter = (field, value) => {
    setStarterPlan(prev => { const n = structuredClone(prev); n[field] = value; return n; });
  };
  const updateStarterFundamental = (i, value) => {
    setStarterPlan(prev => { const n = structuredClone(prev); n.fundamentals[i] = value; return n; });
  };
  const updateStarterMenu = (section, i, value) => {
    setStarterPlan(prev => { const n = structuredClone(prev); n.menu[section][i] = value; return n; });
  };
  const updateStarterSwap = (i, key, value) => {
    setStarterPlan(prev => { const n = structuredClone(prev); n.swaps[i][key] = value; return n; });
  };
  const updateStarterHeading = (key, value) => {
    setStarterPlan(prev => { const n = structuredClone(prev); if (!n.headings) n.headings = {}; n.headings[key] = value; return n; });
  };

  // --- Manual edit helpers (let the coach tweak the plan before sending) ---
  const updateMeal = (weekIdx, dayIdx, mealIdx, field, value) => {
    setGeneratedPlan(prev => {
      const next = structuredClone(prev);
      next.weeks[weekIdx].days[dayIdx].meals[mealIdx][field] = value;
      return next;
    });
  };
  const updateDayTotals = (weekIdx, dayIdx, value) => {
    setGeneratedPlan(prev => {
      const next = structuredClone(prev);
      next.weeks[weekIdx].days[dayIdx].dailyTotals = value;
      return next;
    });
  };
  const updateTarget = (field, value) => {
    setGeneratedPlan(prev => {
      const next = structuredClone(prev);
      if (!next.targets) next.targets = {};
      next.targets[field] = value;
      return next;
    });
  };
  const updateGenField = (field, value) => {
    setGeneratedPlan(prev => { const n = structuredClone(prev); n[field] = value; return n; });
  };
  const updateGenArray = (field, i, value) => {
    setGeneratedPlan(prev => { const n = structuredClone(prev); n[field][i] = value; return n; });
  };
  const updateShoppingItem = (category, i, value) => {
    setGeneratedPlan(prev => { const n = structuredClone(prev); n.shoppingList[category][i] = value; return n; });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const populateTestData = () => {
    const names = ["Amina Patel", "Zara Ahmed", "Priya Sharma", "Fatima Khan", "Neha Singh", "Sana Ali", "Kiran Desai"];
    const goals = ["Fat loss", "Sustainable fat loss", "Body recomposition", "Maintenance", "Drop a dress size"];
    const timeframes = ["Lose 5kg in 12 weeks", "Drop a dress size in 8 weeks", "Lose 8kg in 16 weeks", "Build healthy habits over 4 weeks", "Lose 3kg in 6 weeks"];
    const activityLevels = ["Sedentary", "Lightly active", "Moderately active", "Very active"];
    const hormonalStatuses = ["Regular cycle", "PCOS", "Perimenopause", "Menopause", "Post-menopause"];
    const medicalFlagsList = ["None", "None", "None", "Insulin resistance", "Type 2 diabetes risk", "Slightly elevated cholesterol"];
    const durations = ["1", "2", "4", "6", "8", "12"];
    const approaches = ["Calories & Macros", "Hand Portions", "Simple Targets", "Cups"];
    const diets = ["Standard", "Vegetarian", "No Beef", "Dairy-free", "Standard"];
    const cuisines = ["Pakistani", "Indian", "Bangladeshi", "Sri Lankan", "Mixed South Asian", "Mix of South Asian and Western", "Western/Standard"];
    const cookingForOptions = ["Herself only", "Couple", "Family (with kids)"];
    const cookingTimes = ["15 mins max", "30 mins", "45 mins", "60 mins+"];
    const batchOptions = ["Yes - Prioritise Batch Cooking", "No - Prefers Fresh Daily"];
    const fastingOptions = ["None", "None", "None", "Intermittent Fasting"];

    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    setFormData({
      clientName: random(names),
      age: randomInt(25, 55).toString(),
      height: randomInt(150, 172).toString(),
      weight: randomInt(60, 95).toString(),
      goal: random(goals),
      timeframe: random(timeframes),
      activityLevel: random(activityLevels),
      hormonalStatus: random(hormonalStatuses),
      medicalFlags: random(medicalFlagsList),
      durationWeeks: random(durations),
      approach: random(approaches),
      carbPreference: random(["Low Carb", "Moderate", "Higher Carb"]),
      dietaryPreferences: random(diets),
      regionalCuisine: random(cuisines),
      cookingFor: random(cookingForOptions),
      cookingTime: random(cookingTimes),
      batchCooking: random(batchOptions),
      religiousFasting: random(fastingOptions),
      availableFoods: '' 
    });
  };

  const convertToCups = async () => {
    if (!convertFile) return;
    setIsConverting(true);
    setView('generating');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', convertFile);
      const response = await fetch('/api/convert', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Conversion Error (${response.status}): ${errorData}`);
      }
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setStreamedChars(fullText.length);
      }
      let cleanText = fullText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      const parsedData = JSON.parse(cleanText);
      setGeneratedPlan(parsedData);
      setStreamedChars(0);
      setView('preview');
    } catch (err: any) {
      console.error("Conversion Error:", err);
      setError(`🚨 ERROR: ${err.message}`);
      setStreamedChars(0);
      setView('dashboard');
    } finally {
      setIsConverting(false);
    }
  };

  const isFormValid = () => {
    // Nothing is mandatory — the coach can generate a quick plan with as little
    // or as much info as they like. Missing height/weight/age is handled in the
    // prompt (Rule 1) by skipping the TDEE maths and using a sensible default.
    return true;
  };

  const generateAIPlan = async () => {
    setView('generating');
    setError('');
    
    const aiWeeks = 1; 
    
    const prompt = `
      You are an expert nutrition coach specialising in evidence-based meal planning for busy South Asian women. 
      Your job is to generate a fully personalised nutrition protocol based on the client details provided below.

      CLIENT DETAILS:
      - Name: ${formData.clientName || 'Client'}
      - Manual Calorie Target: ${formData.manualCalories ? formData.manualCalories + ' kcal (use this exact daily calorie target)' : 'Not provided'}
      - Age: ${formData.age || 'Not provided'}
      - Height: ${formData.height ? formData.height + ' cm' : 'Not provided'}
      - Weight: ${formData.weight ? formData.weight + ' kg' : 'Not provided'}
      - Primary Goal: ${formData.goal}
      - Goal timeframe: ${formData.timeframe}
      - Activity level: ${formData.activityLevel}
      - Hormonal status: ${formData.hormonalStatus}
      - Medical flags: ${formData.medicalFlags}
      - Full Protocol Duration: ${formData.durationWeeks} weeks
      - Menu Length to Generate: ${aiWeeks} week (Client will repeat this cycle if full duration is longer)
      - Dietary approach: ${formData.approach}
      - Carb preference: ${formData.carbPreference}
      - Dietary preferences/restrictions: ${formData.dietaryPreferences}
      - Regional cuisine: ${formData.regionalCuisine}
      - Cooking for: ${formData.cookingFor}
      - People eating: ${formData.cookingFor === 'Family (with kids)' ? formData.familySize + ' people total (including client)' : formData.cookingFor === 'Couple' ? '2 people' : '1 — client only'}
      - Available cooking time per day: ${formData.cookingTime}
      - Batch cooking: ${formData.batchCooking}
      - Religious fasting: ${formData.religiousFasting}
      - Available foods: ${formData.availableFoods || 'Standard access'}

      YOUR RULES:

      🚫 TONE RULE — STRICTLY PROFESSIONAL, NO EXCEPTIONS: Write in a calm, professional, practical coaching tone. NEVER use corny, cheesy, over-the-top, or "girl power" cheerleading language. The following are 100% BANNED everywhere (tips, summary, notes, welcome, descriptions, every field): pet names like "babes", "babe", "hun", "honey", "queen", "gorgeous", "sweetie", "darling", "girl", "girlie", "boss babe"; cheerleading clichés like "you've got this", "you got this", "slay", "you go girl", "girl power", "yass", "one meal at a time babes", "trust the process", "no excuses queen"; and excessive exclamation marks or emojis used as hype. Practical, grounded coaching phrases (e.g. "chill on the oil", "use common sense", "WhatsApp me if you're unsure", "air-fry to save time") are fine — keep it direct and useful, never cheesy or patronising.

      ⛔ ABSOLUTE RULE — READ FIRST, NEVER BREAK: The following foods are 100% BANNED and must NEVER appear in ANY meal, snack, ingredient, side, or suggestion under ANY circumstances, even if the client typed them into their available foods: Pork, Bacon, Ham, Alcohol, Turkey, ROTISSERIE CHICKEN, any pre-cooked/shop-bought rotisserie or roast chicken, Tempeh, Tofu, Medallions or any fancy/expensive cuts of meat, Prawn Masala, Curd Bengan, Grilled Salmon, Roasted Gobi, and anything non-halal. If you ever think of using cooked chicken, use plain cooked chicken breast, chicken thighs, or chicken keema (mince) — NEVER rotisserie chicken. This rule overrides every other instruction including the client's own ingredient list.
${formData.availableFoods && formData.availableFoods.trim() !== '' ? `
      🔒 STRICT FOOD LIST MODE IS ON — READ CAREFULLY: The client has given their OWN food list: "${formData.availableFoods}". You must build EVERY meal using ONLY foods from that exact list. Do NOT add ANY food that is not on it — no almonds, no smoked salmon, no yoghurt, no fruit, no nuts, nothing extra. The Z.A master food list and signature meals/snacks in Rule 10 are SUSPENDED and must be completely ignored. The only things you may add are basic seasonings (salt, pepper, spices, onion/garlic/tomato for cooking, oil, water). See Rule 16 for the one tightly-limited protein fallback. When in doubt, leave it out.
` : ''}
      1. CALCULATE TDEE USING THE MIFFLIN-ST JEOR FORMULA (all clients are women):
          IF a "Manual Calorie Target" is provided: use that EXACT number as the Daily Calorie Target. Set TDEE to "N/A". Do NOT apply any deficit from Rule 17 — the manual number IS the final target. Set Protein Target to a sensible "100-120g" and Fibre to "25-30g". Do NOT mention that a manual target was used. Then skip the rest of this rule and ignore Rule 17's deficit maths.
          IF age, height OR weight is "Not provided" (and no manual target): DO NOT attempt the calculation. Set TDEE to "N/A" and set a sensible default Daily Calorie Target for a busy South Asian woman based on the goal — fat loss ≈ 1500 kcal, maintenance ≈ 1800 kcal, muscle building ≈ 1900 kcal. Set Protein Target to a sensible "100-120g" and Fibre to "25-30g". Do NOT mention anywhere that any information was missing. Then skip the rest of this rule.
          IF all three are provided:
          Step 1 — BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161
          Step 2 — TDEE = BMR × activity multiplier:
              Sedentary = 1.2 | Lightly active = 1.375 | Moderately active = 1.55 | Very active = 1.725
          Then set the Daily Protein Target (1.8-2.2g per kg of bodyweight) and Fibre (min 25g, aim 30g).
          Show the calculated TDEE in the targets section. The Daily Calorie Target is then set by Rule 17 below.
      2. Use South Asian meals as the foundation (Rice, roti, dal, lentils, sabzi, curry, yoghurt, eggs, legumes). No Western defaults unless requested.
      3. Every meal MUST include a clear protein source. Dal/lentils alone do not count as sufficient protein without another source.
      4. Fibre must come from whole foods.
      5. FAMILY COOKING: If cooking for Family or Couple, the client's individual portion (what goes on HER plate only) is ALWAYS shown first. Then add a short batch note in brackets showing total to cook. Batch note always uses grams or cups — never hand portion language. Keep it under 10 words. Examples: "(Cook ~3 cups keema total — family of 4)" or "(×2 — cook ~300g total)". For individually packaged items (eggs, chapatis, protein bars, Skyr pots) write "1 per person" — no batch calculation needed.
      6. BATCH COOKING vs FAMILY COOKING — CRITICAL DIFFERENCE: Batch cooking = cooking multiple days' meals in one session for the CLIENT ONLY. This does NOT change her individual portion sizes. Family cooking = cooking one meal for multiple people. These are completely separate concepts. NEVER multiply portion sizes for both simultaneously.
      7. Keep within the cooking time limit.
      8. HORMONES/MEDICAL: If perimenopausal/menopausal, increase calcium and prioritise protein. If PCOS/Insulin Resistance, reduce refined carbs, use low-GI, pair carbs with protein/fat.
      9. Z.A TRAINING TONE: Keep language highly practical, direct, and jargon-free. Written to the client. Incorporate my signature coaching tone (e.g., "Chill on the oil!", "Comfort food, don't overdo it", "Use common sense", "Air-fry to save time", "Always WhatsApp me if you are ever unsure").
      10. Z.A TRAINING MASTER FINGERPRINT:

          ‼️ THIS ENTIRE RULE 10 (the master food list, signature meals, signature snacks, hacks) APPLIES ONLY WHEN "Available foods" IS "Standard access". If the client provided their own food list, IGNORE everything in Rule 10 — do NOT pull smoked salmon, almonds, or any other food from here. Rule 16 takes over completely in that case.

          APPROVED FOODS MASTER LIST:
          When "Available foods" is "Standard access" (no list provided), build ALL meals using ONLY foods from this list. Do NOT introduce any food not listed here.

          PROTEINS: chicken breast, chicken thighs, lean chicken mince/keema, basa, cod, haddock, any white fish, smoked salmon, John West Infusions Tuna pots, tinned sardines, tinned mackerel, prawns, whole eggs, egg whites, fat-free Greek yoghurt, Skyr, Arla/GetPRO/Brooklea protein yoghurts/pouches, whey protein, lentils (any), chickpeas, kidney beans, low-fat cottage cheese, lamb keema (occasional only)
          CARBS: rice (white or brown), chapati (50/50 atta, max 60-70g), oats/porridge, couscous, wholewheat pasta, baby potatoes, sweet potato, brown/wholemeal bread (e.g. Hovis), wholewheat wraps/tortillas, Bran Flakes, Weetabix (Protein version preferred), quinoa, wholewheat noodles, rye bread, dal, Warburtons Protein Bagels/Thins, Jason's Protein Sourdough, Ainsley Harriott Couscous (Sundried Tomato & Garlic), microwave rice
          FATS: avocado, almonds (plain, skin on), cashews, walnuts, peanut butter, almond/cashew butter, 80-85% dark chocolate, chia seeds, flaxseeds, olives, extra virgin olive oil, light mozzarella, pumpkin seeds, brazil nuts, hemp seeds, pecans, whole eggs (yolks)
          FRUITS & VEG: raspberries, blueberries, strawberries, frozen berries, apple, pear, banana, nectarine, plum, kiwi, frozen cherries, grapefruit, orange, broccoli, spinach, peppers, green beans, onions, mangetout, carrots, baby corn, Brussels sprouts, kale, frozen mixed veg, mixed salad leaves, sweet potato, pomegranate seeds
          SOUTH ASIAN STAPLES (always allowed): rice, roti, dal, lentils, sabzi, curry bases, chickpeas, kidney beans, spices, yoghurt, eggs, cooking spray
          EXTRAS: semi-skimmed milk, honey, cinnamon, low-fat vinaigrette, balsamic vinegar, soy sauce, light mayo, feta cheese, Babybel Light, Quest/Fulfil bars, rice cakes, edamame, whole almonds

          HACKS (apply where genuinely appropriate):
          - THE CEREAL HACK: ONLY suggest if Bran Flakes/Weetabix appears in the client's food list OR Standard access is selected. Mix whey protein + milk + water in shaker, pour over Bran Flakes or Weetabix.
          - THE EGG VOLUME HACK: Use 1 whole egg + 150ml egg whites to bump protein without extra calories.

          SOUTH ASIAN MEAL RULES: Measure curries and biryani by "1.5 fistfuls". Cook with cooking spray/water first, add tiny bit of oil later. No fried onions in biryani. Add Greek yoghurt as a side to low-protein curries. Use chicken mince over lamb/beef where possible.
          SIGNATURE MEALS: Protein smoothie (whey + frozen berries + banana + 1 tsp PB + semi-skim milk), overnight oats, eggs & smoked salmon on protein bagel, tuna baked potato with light mayo & mozzarella, chicken/kebab wraps.
          SIGNATURE SNACKS: Babybel Light + apple, boiled eggs, Quest/Fulfil bars, rice cakes with PB, edamame, whole almonds, chia/flax seeds stirred into yoghurt.
      10b. Z.A INSPIRATION BANK (distilled from Zayb's real guides). Use the STYLE and METHODS below ALWAYS. Use the example meals as INSPIRATION ONLY — never copy a full day or plan verbatim, always build fresh combinations in this style. On Standard access you may draw meal ideas from these seeds; in strict food-list mode (Rule 16) keep to the client's foods but assemble them in this same style.
          CORE PHILOSOPHY: Centre every meal AND snack around a clear protein. Meals don't need perfect macros — protein first, then do your best with carbs/fats/fibre.
          SIGNATURE METHODS: stir 4-5 tbsp fat-free Greek yoghurt into any low-protein curry/desi dish to bump protein; egg volume hack (1 egg + 150ml egg whites); cereal hack (shake 1.5 scoop whey + 100ml semi-skim milk, pour over bran flakes/Weetabix); whey stirred into porridge; cook with spray/water first then a little oil; pour oil with a spoon not the bottle (1 tbsp ≈ 120 kcal); air-fry instead of fry.
          PORTION LANGUAGE: rice/curry/biryani/pilau by "1.5 fistful" (2 fistfuls on a bigger day); proteins & potatoes in grams; "1 large chapati/roti"; "1 tin tuna"; "1.5 scoops whey"; "5 tbsp Greek yoghurt"; "handful" of nuts/spinach; "1 tbsp olive oil drizzled".
          BREAKFAST SEEDS: eggs on toast + spinach; protein smoothie (whey + frozen berries + ½ banana + nuts); porridge with whey + cashews; protein bagel + egg/egg-whites + mozzarella + spinach; bagel + smoked salmon + light soft cheese; Greek yoghurt + chia + fruit; protein bran flakes (cereal hack); cheesecake/overnight oats; Arla/Skyr protein pot + almonds + easy peelers; smoked mackerel + bagel.
          LUNCH SEEDS: chicken/tuna brown wrap; tuna baked potato + mozzarella + salad; sun-dried tomato couscous + chicken; chicken stir fry; chicken-mince kebab bagel; prawns + couscous + salad; baked sweet potato + tuna; channa chaat; tandoori chicken + rice; egg mayo sandwich.
          DINNER SEEDS: chicken pilau (1.5 fistful + 5 tbsp Greek yoghurt + ½ avocado); keema & roti (+ yoghurt); salmon + roasted baby potatoes; chickpea/lentil curry + small rice; cod & mash; chicken biryani (+ yoghurt); chicken/keema wholewheat pasta; curry of the day + chapati (+ yoghurt if low protein); prawn pasta.
          SNACK SEEDS (only if calories allow, always include some protein): Babybel Light + apple; protein shake/smoothie; Greek yoghurt + berries + cashews; Arla/Brooklea protein pot + chia; 2-3 boiled eggs + fruit; ½ tub low-fat cottage cheese + blueberries; strawberries + 15 cashews; Z.A approved protein bar; rice cakes.
          SMARTER SWAPS: white→brown bread/wraps/pasta; white cereal→Weetabix; breaded→spice your own; granola→porridge; fried→air-fried/homemade chips; cheddar→mozzarella; whole→semi-skim milk; greek-style→fat-free Greek yoghurt; full-fat→light mayo/butter; paratha→chapati; lamb→chicken mince/biryani; fruit juice→whole fruit; sugary drink→sugar-free; regular bagel→bagel thins.
          VOICE: warm, direct, desi-friendly — "chill on the oil!", "use common sense", "don't knock it till you try it", "always WhatsApp me if you're ever unsure".
      11. STRICTLY FORBIDDEN FOODS: NEVER include Pork, Bacon, Alcohol, Turkey, Rotisserie Chicken, Tempeh, Tofu, Medallions (or any fancy/expensive cuts of meat), Prawn Masala, Curd Bengan, Grilled Salmon, or Roasted Gobi under any circumstances.
      12. DIETARY APPROACH DISPLAY RULE: Always calculate macros internally for accuracy. Then display them based on the chosen approach:
          - If approach is "Calories & Macros": show full metrics as "450 kcal | 35g Protein | 45g Carbs | 12g Fat | 8g Fibre"
          - If approach is "Hand Portions": show ONLY "1 palm protein | 1 cupped hand carbs | 1 fist veg | 1 thumb fat" then on a new line "Approx. 35g Protein | 8g Fibre"
          - If approach is "Simple Targets": show in plain English e.g. "Around 450 calories — aim for 35g protein and 8g fibre"
          - If approach is "Cups": show "450 kcal | 35g Protein | 8g Fibre"
          Always calculate and include protein and fibre regardless of approach.
      13. CRITICAL LENGTH REQUIREMENT: You MUST generate exactly ${aiWeeks} complete week. Do NOT generate more than ${aiWeeks} week.
      14. CRITICAL DAYS REQUIREMENT: Every single week MUST contain exactly 7 complete days (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday). DO NOT stop early. DO NOT provide partial weeks or partial days.
      14b. CRITICAL MEAL COUNT & STRUCTURE: The meal structure depends on the fasting setting:
          - Standard (no fasting): Generate EXACTLY 3 meals — Breakfast, Lunch, Dinner.
          - If "Ramadan": Generate EXACTLY 3 meals — Suhoor (pre-dawn, before Fajr — filling, slow-release carbs + high protein), Iftar (breaking fast at Maghrib — balanced full meal), Late Evening Meal (lighter, after Taraweeh). NO standard breakfast/lunch/dinner labels.
          - If "Intermittent Fasting": Generate EXACTLY 4 cards in this order:
              CARD 1 — type "Fasting Window": This is NOT a food meal. Set name to "Intermittent Fasting" and description to: "Fasting this morning — your eating window opens at lunch. Drink plenty of water, black coffee and tea (no sugar), and sparkling water is fine too." Set metrics to "0 kcal", portionGuide to "No food during your fasting window — just water, black coffee, tea or sparkling water.", and prepNote to null.
              CARD 2 — type "Lunch": a real, full meal from the client's foods (the first meal of their eating window).
              CARD 3 — type "Dinner": a real, full meal from the client's foods.
              CARD 4 — type "Optional Snack", name "Snack (Optional)": This is NOT a fixed meal. Work out the spare calories left = daily calorie target − (Lunch calories + Dinner calories). If there are roughly 100 kcal or more spare, set description to "You've got around [X] kcal spare today — have a small snack if you fancy it. Just make sure it has a little protein in it." (fill in [X] with the actual spare number). Set metrics to "~[X] kcal spare", portionGuide to "Optional — keep it around [X] kcal and include a little protein.". Do NOT name a specific food. If there are fewer than ~100 kcal spare, set description to "No real room for a snack today — you're all set with your meals." and metrics to "0 kcal spare".
          If Ramadan + Vegetarian: protein targets will be very hard to hit — include a tip recommending plant-based or whey protein powder at Suhoor.
      14c. BREAKFAST MUST BE BREAKFAST-APPROPRIATE: The Breakfast meal (and Suhoor in Ramadan) must be a sensible morning food. NEVER put heavy savoury or oily dishes at breakfast — no tuna, no curries, no keema, no biryani, no fish fillets, no salads at breakfast. Good breakfasts use morning-friendly foods from the client's list, such as: eggs/omelette, oats/porridge, overnight oats, Greek yoghurt or Skyr with fruit, a protein smoothie, protein toast/bagel with eggs, or an egg paratha. If the client's list is limited, pick the most breakfast-suitable option available (e.g. eggs, yoghurt, oats) rather than forcing a lunch/dinner food into the morning.
      15. MEAL DESCRIPTIONS: Write 1 sentence max for each meal description. One line only — what the meal is and why it works. Written directly to the client in Z.A Training tone.
      15b. PORTION GUIDE RULE: Every meal MUST include a "portionGuide" field. This tells the client exactly how much to eat. Format it based on the dietary approach:
          - "Calories & Macros": Use exact weights e.g. "150g chicken keema | 1 chapati (60g) | 80g baby potatoes"
          - "Hand Portions": Use practical measures e.g. "4 tablespoons keema | 1 chapati | 1 palm-sized piece of basa | 1 small Skyr pot (150g)" — always include the pack/pot size for branded products
          - "Simple Targets": Use plain English e.g. "A good-sized bowl of keema — roughly 4-5 tablespoons | 1 chapati on the side"
          - "Cups": Use cup measurements e.g. "¾ cup cooked chicken keema | ½ cup basmati rice | ¼ cup Greek yoghurt" — for items that don't translate to cups (1 chapati, 1 protein bar, 1 Skyr pot) keep as natural units
          For packaged products always specify the exact size e.g. "1 x 150g Skyr pot", "1 x John West Infusions Tuna pot (110g)", "2 Warburtons Protein Bagel Thins".
          CUPS — USE FOR: cooked rice, couscous, pasta, oats, keema/mince in sauce, any curry or sauce-based dish, dal/lentils (cooked), chickpeas/legumes (cooked), loose Greek yoghurt or Skyr (not in a packet), overnight oats, porridge, liquid egg whites, soups/stews.
          CUPS — DO NOT USE FOR: chapatis (1 chapati), whole eggs (2 eggs), baby potatoes (units or grams), fish fillets (1 fillet or grams), chicken breast (1 breast or grams), smoked salmon (grams), protein bars (1 bar), packaged yoghurt pots (1 x 150g Skyr), bread/bagels/thins (units), Babybel (units), rice cakes (units), avocado (½ avocado).
          DAIRY-FREE FALLBACK: If dairy-free selected, replace Greek yoghurt/Skyr cup portions with lentils, chickpeas, or keema instead.
      16. STRICT INGREDIENT MATCHING: The client has listed their available foods as: "${formData.availableFoods || 'Standard access'}".
          If this is NOT "Standard access", you are in STRICT MODE:
          - Build EVERY meal using ONLY the exact foods on the client's list. Do NOT add any food that is not on their list — no smoked salmon, no almonds, no yoghurt, no fruit, nothing extra, unless it appears on their list.
          - The ONLY things you may add without being on the list are basic cooking seasonings the dish needs: salt, pepper, spices/masala, onion/garlic/ginger/tomato for a curry base, cooking spray, a little oil, water, lemon. These are NOT "foods", they are seasonings.
          - The Rule 10 master list, signature meals, signature snacks and food-based hacks are SUSPENDED and must be ignored entirely.
          - PROTEIN FALLBACK (use sparingly): Only if a meal genuinely has no protein source from the client's own list, you may add ONE of these and nothing else: fat-free Greek yoghurt, a Skyr pot, or egg whites. Prefer using more of the client's OWN listed protein first. Never use this fallback to add nuts, fish, or any other food.
          - If you are ever unsure whether a food is allowed, the answer is NO — leave it out.
      17. CALORIE TARGET & SAFE DEFICIT (work backwards from the client's goal, but keep it sensible):
          - For FAT LOSS, calculate the deficit needed to reach their target by their deadline:
              a. If the goal/timeframe mentions a specific amount to lose (e.g. "lose 4kg in 8 weeks"), work out the required daily deficit: (kg to lose × 7700) ÷ (number of weeks × 7).
              b. If that required deficit lands between 300 and 500 kcal, use it. This is the safe range.
              c. If the required deficit is MORE than 500 kcal, the goal is too aggressive — SILENTLY CAP the deficit at 500 kcal. Do NOT mention this, do NOT explain it, do NOT add any note or tip about it. Just apply the 500 kcal cap quietly.
              d. If the required deficit is LESS than 300 kcal (very relaxed goal), use a 300 kcal deficit so progress is still felt.
              e. If no specific kg target is given, default to a sensible 400 kcal deficit.
          - HARD FLOOR: The final daily calorie target must NEVER drop below 1200-1300 kcal/day, no matter what. If hitting the deadline would require going below this floor, SILENTLY stay at the floor — do not mention or explain it.
          - ⛔ NEVER comment on weight-loss pace anywhere: Do NOT tell the client whether their kg goal or timeframe is realistic, fast, slow, good, bad, aggressive, or achievable. Do NOT mention how long weight loss "will really take". Do NOT put any reality check, pace warning, or timeframe judgement in the tips, summary, quick wins, meal notes, or anywhere else in the entire plan. Apply the safe calorie target silently and say nothing about the pace.
          - MAINTENANCE = eat at TDEE, no deficit. MUSCLE BUILDING/RECOMPOSITION = at TDEE or slight surplus.
      17b. CARB PREFERENCE: Adjust the carb-to-fat balance of meals based on the client's "Carb preference". The DAILY CALORIE TARGET from Rule 17 NEVER changes — only the food mix shifts.
          - "Moderate" (default): normal balanced split. Carbs roughly 40-45% of calories.
          - "Low Carb": noticeably reduce starchy carbs (smaller rice/roti/potato portions, swap some rice for cauliflower rice, more non-starchy veg). Carbs roughly 20-30% of calories, with the gap filled by extra protein and healthy fats. ALSO bump the protein target slightly — push it toward the TOP of the range (around 2.2-2.4g per kg bodyweight) to keep the client full and protect muscle. Keep this bump small and sensible.
          - "Higher Carb": more starchy carbs (larger rice/oats/potato portions, add fruit), leaner proteins and less added fat. Carbs roughly 50-55% of calories. Protein stays at the standard 1.8-2.2g/kg.
          - MEDICAL OVERRIDE: Medical needs ALWAYS win over carb preference. If the client has PCOS/Insulin Resistance, "Higher Carb" must use LOW-GI WHOLE-FOOD carbs only (oats, sweet potato, lentils, quinoa) — never refined carbs or large white rice portions. Low-GI/whole-food rules are never broken to satisfy a carb preference.
      18. SHOPPING LIST RULE: Maximum 4 items per category. Only include what is genuinely needed. If cooking for Family or Couple, add approximate weekly quantity for bulk items e.g. "Chicken mince (~1.2kg for the week)".
      19. QUICK WINS: Generate exactly 3 short, punchy, personalised non-negotiables for this specific client. Written directly to them. Based on their hormonal status, medical flags, goal, and lifestyle. Use the Z.A Training tone — direct, no fluff. Each one should be one sentence max. Examples for PCOS: "Never eat a carb alone — always pair it with protein or fat." For menopausal: "Calcium every single day." For family cooking: "Measure your portions separately before serving the family."
      19b. NO CALORIE NUMBERS IN NARRATIVE SECTIONS: Do NOT put any specific calorie figure (e.g. "1600 kcal", "stick to 1605 calories", "a 500 kcal deficit") in the "tips", "summary", or "quickWins". The coach may choose to HIDE the targets and daily totals, and these sections must still read perfectly with no leftover calorie references. Speak generally instead — "stay consistent with your portions", "hit your protein target", "trust the plan". Specific calorie numbers belong ONLY in the targets section, dailyTotals, and per-meal metrics.
      20. ⛔ PORTION SIZING MUST HIT THE DAILY CALORIE TARGET — CRITICAL MATH CHECK: Setting the "Daily Calorie Target" number in Rule 1/17 is NOT enough — every day's actual meals must be portioned (grams, tablespoons, cups) so their calories genuinely add up to that target. Do NOT default to generic "standard" portion sizes — scale every meal's portions up or down until the maths works. For EVERY single day, after writing all the meals: ADD UP the kcal figure from every meal/snack card for that day. If the true sum is more than ~50 kcal away from the Daily Calorie Target, you MUST go back and resize portions (more rice/protein/carbs/healthy fat to raise it, less to lower it) until the sum lands within ~50 kcal of the target. The "dailyTotals" calories figure you write MUST be the real sum of that day's meals — never write a totals number that doesn't match what you actually wrote in the meals above it. This applies to every day in every week, not just day one.

      ⛔ FINAL CHECK BEFORE YOU RESPOND: Re-read every single meal, snack, side and ingredient you have written. If ANY banned food appears (Pork, Bacon, Ham, Alcohol, Turkey, Rotisserie Chicken or any pre-cooked roast chicken, Tempeh, Tofu, Medallions/fancy cuts, Prawn Masala, Curd Bengan, Grilled Salmon, Roasted Gobi, or anything non-halal), REMOVE it and replace it with an approved alternative before returning your answer. Do not return the plan until it is 100% clean. THEN, for every single day, add up the kcal of every meal/snack card and confirm it is within ~50 kcal of the Daily Calorie Target — if it is not, resize portions until it is, before returning your answer.

      Return ONLY a valid JSON object matching this EXACT schema. Do NOT truncate the days or weeks arrays:
      {
        "title": "Custom Nutrition Protocol",
        "targets": {
          "tdee": "Calculated TDEE kcal",
          "calories": "Target kcal",
          "protein": "Target g",
          "fibre": "Target g"
        },
        "weeks": [
          {
            "weekNumber": 1,
            "days": [
              {
                "day": "Monday",
                "meals": [
                  {
                    "type": "Breakfast",
                    "name": "Meal Name",
                    "description": "Brief description",
                    "portionGuide": "Exact portion sizes based on dietary approach",
                    "metrics": "X kcal | Yg P | Zg C | Wg F",
                    "prepNote": "Only if >15 mins. Max 5 words (e.g., 'Prep night before')",
                    "swapNote": "Only include if meal uses a specific marinade, spice rub, or flavoured coating the client might want to swap. E.g. 'Not feeling this marinade? WhatsApp your coach for a quick swap! 💬' — omit entirely if no marinade involved."
                  }
                ],
                "dailyTotals": "Calories: X | Protein: Yg | Fibre: Zg"
              }
            ]
          }
        ],
        "shoppingList": {
          "proteins": ["item 1", "item 2"],
          "vegetables": ["item 1"],
          "grainsAndCarbs": ["item 1"],
          "dairyOrAlternatives": ["item 1"],
          "storeCupboardStaples": ["item 1"]
        },
        "tips": ["Practical tip 1", "Practical tip 2", "Practical tip 3"],
        "summary": "One-line summary of what to focus on most this week.",
        "quickWins": ["Non-negotiable 1", "Non-negotiable 2", "Non-negotiable 3"]
      }
    `;

   const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 16384,
        thinkingConfig: {
          thinkingBudget: 0
        }
      }
    };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData}`);
      }

      // Read the stream chunk by chunk
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setStreamedChars(fullText.length);
      }

      // Parse the complete JSON once stream is finished
      let cleanText = fullText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      const parsedData = JSON.parse(cleanText);
      setGeneratedPlan(parsedData);
      setStreamedChars(0);
      setView('preview');

    } catch (err: any) {
      console.error("Full Error:", err);
      setError(`🚨 ERROR: ${err.message}`);
      setStreamedChars(0);
      setView('dashboard');
    }
  };

  const generateStarterPlan = async () => {
    setView('generating');
    setError('');

    const starterPrompt = `
      You are Zayb, an expert nutrition coach for busy South Asian women in the UK. You are creating a gentle "First Two Weeks" STARTER plan for a brand-new client. This is NOT a strict meal plan — it eases them in by focusing on fundamentals and giving them flexible meal options to pick from. NO calorie counting, NO macros, NO daily totals.

      CLIENT:
      - Name: ${formData.clientName}
      - Goal: ${formData.goal}
      - Regional cuisine: ${formData.regionalCuisine}
      - Dislikes / allergies / restrictions: ${formData.dietaryPreferences}
      - Foods they have/want to use (optional): ${formData.availableFoods || 'No specific list — use your judgement'}

      ⛔ ABSOLUTE RULE: STRICTLY HALAL. NEVER include Pork, Bacon, Ham, Alcohol, Turkey, Rotisserie Chicken, Tempeh, Tofu, Medallions, Prawn Masala, Curd Bengan, Grilled Salmon, Roasted Gobi, or anything non-halal.

      🚫 TONE RULE — STRICTLY PROFESSIONAL, NO EXCEPTIONS: Write in a calm, professional, practical coaching tone. NEVER use corny, cheesy, over-the-top, or "girl power" cheerleading language anywhere (welcome note, fundamentals, menu, swaps, closing tip). 100% BANNED: pet names ("babes", "babe", "hun", "honey", "queen", "gorgeous", "sweetie", "darling", "girl", "girlie", "boss babe"); cheerleading clichés ("you've got this", "you got this", "slay", "you go girl", "girl power", "yass", "one meal at a time babes", "trust the process", "no excuses queen"); and excessive exclamation marks or hype emojis. Keep it direct, grounded and genuinely useful — never cheesy or patronising. The closing tip must be a calm, practical line, NOT a cheer.

      THE FOUR FUNDAMENTALS (rewrite each in your warm, direct Z.A Training voice, personalised to this client):
      1. Reduce junk food now, with the aim of cutting it right down over time.
      2. Eat two sources of fruit & veg every day (fibre naturally goes up as this increases — you don't need to track fibre separately).
      3. Build this up gradually — small steady steps, not all at once.
      4. Get one to two lean protein sources in every day until it becomes second nature.

      MIX & MATCH MENU: Give EXACTLY 5 options each for breakfast, lunch, dinner, and snacks. The client picks whichever they fancy each day — they are NOT assigned to days. Each option = a short meal name plus a simple portion in plain English (e.g. "Eggs on toast — 2 eggs, 1 brown toast, handful spinach"). Every option must have a clear protein. Use the client's cuisine and the Z.A Inspiration Bank style (protein-first, "1.5 fistful" desi portions, Greek yoghurt to bump protein, etc.). Snacks should be simple and protein-friendly. NO calorie numbers anywhere.

      SMARTER SWAPS: Give 6 simple "swap this for that" tips in Zayb's style (e.g. white bread → brown bread; fried → air-fried; paratha → chapati; sugary drink → sugar-free; full-fat → light; lamb mince → chicken mince). Each with a very short reason. NEVER suggest turkey, turkey mince, or any banned food as a swap.

      ⛔ FINAL CHECK BEFORE YOU RESPOND: Re-read every meal option, snack and swap. If ANY banned food appears (Pork, Bacon, Ham, Alcohol, Turkey/turkey mince, Rotisserie Chicken, Tempeh, Tofu, Medallions, Prawn Masala, Curd Bengan, Grilled Salmon, Roasted Gobi, or anything non-halal), REMOVE it and replace it with an approved alternative before returning.

      Return ONLY a valid JSON object in this EXACT schema:
      {
        "title": "Your First Two Weeks",
        "welcome": "A short, warm, personal note to ${formData.clientName} in Zayb's voice — reassure them this is about easing in, not perfection.",
        "fundamentals": ["fundamental 1", "fundamental 2", "fundamental 3", "fundamental 4"],
        "menu": {
          "breakfast": ["option 1", "option 2", "option 3", "option 4", "option 5"],
          "lunch": ["option 1", "option 2", "option 3", "option 4", "option 5"],
          "dinner": ["option 1", "option 2", "option 3", "option 4", "option 5"],
          "snacks": ["option 1", "option 2", "option 3", "option 4", "option 5"]
        },
        "swaps": [{"from": "White bread", "to": "Brown bread", "why": "More fibre, keeps you fuller"}],
        "closingTip": "One short motivating line in Zayb's voice."
      }
    `;

    const payload = { contents: [{ parts: [{ text: starterPrompt }] }] };

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData}`);
      }
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setStreamedChars(fullText.length);
      }
      let cleanText = fullText.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
      const parsedData = JSON.parse(cleanText);
      setStarterPlan(parsedData);
      setIsEditing(false);
      setStreamedChars(0);
      setView('starterPreview');
    } catch (err: any) {
      console.error("Starter Plan Error:", err);
      setError(`🚨 ERROR: ${err.message}`);
      setStreamedChars(0);
      setView('dashboard');
    }
  };

  if (view === 'generating') {
    const progress = Math.min(Math.round((streamedChars / 12000) * 100), 99);
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-red-700 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">
          {isConverting
            ? (streamedChars === 0 ? 'Reading Your Plan...' : 'Converting to Cups...')
            : (streamedChars === 0 ? 'Analyzing Client Data...' : 'Writing Your Plan...')}
        </h2>
        <p className="text-zinc-600 max-w-md text-center mb-6">
          {isConverting
            ? (streamedChars === 0 ? 'Claude is reading your uploaded PDF...' : 'Converting all measurements to cup format — same meals, just different units...')
            : (streamedChars === 0
              ? `Calculating TDEE, adapting for ${formData.hormonalStatus}, and sourcing ${formData.regionalCuisine} recipes within a ${formData.cookingTime} window...`
              : `Building meals and portion guides for ${formData.clientName}...`)}
        </p>
        {streamedChars > 0 && (
          <div className="w-full max-w-sm">
            <div className="flex justify-between text-xs font-bold text-zinc-500 mb-2">
              <span>Generating plan</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-2.5">
              <div
                className="bg-red-700 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'preview' && generatedPlan) {
    return (
      <div className="min-h-screen bg-zinc-200 py-8 print:py-0 print:bg-white flex flex-col items-center">
        {/* Controls */}
        <div className="max-w-[210mm] w-full flex justify-between items-center mb-6 print:hidden px-4 md:px-0">
          <button onClick={() => setView('dashboard')} className="flex items-center text-zinc-600 hover:text-black bg-white px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Edit Details
          </button>
          <button onClick={() => setShowTargets(!showTargets)} className="flex items-center text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            {showTargets ? 'Hide Targets' : 'Show Targets'}
          </button>
          <button onClick={() => setShowDailyTotals(!showDailyTotals)} className="flex items-center text-zinc-700 bg-white border border-zinc-300 hover:bg-zinc-50 px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            {showDailyTotals ? 'Hide Daily Totals' : 'Show Daily Totals'}
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors border ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'}`}>
            {isEditing ? '✓ Done Editing' : '✏️ Edit Plan'}
          </button>
          <button onClick={() => { setIsEditing(false); setTimeout(() => window.print(), 50); }} className="flex items-center bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow-md font-bold transition-all">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </button>
        </div>

        {/* Edit mode helper banner */}
        {isEditing && (
          <div className="max-w-[210mm] w-full mb-6 print:hidden px-4 md:px-0">
            <div className="bg-green-50 border border-green-300 rounded-xl px-5 py-3 text-green-800 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <span><strong>Edit mode is ON.</strong> Click any meal name, description, portion, or number to change it. Tap "Done Editing" when finished.</span>
            </div>
          </div>
        )}

        {/* --- START DOCUMENT --- */}
        <div className="document-container w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none text-zinc-900 relative">
          
          {/* Page 1: Clean Dashboard Cover */}
          <div className="page break-after-page min-h-[297mm] flex flex-col relative overflow-hidden bg-black text-white p-16">
            <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-700 via-transparent to-transparent pointer-events-none"></div>
            
            <header className="relative z-10 flex flex-col items-start mt-8">
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-red-900/20 mb-10">
                <img src={LOGO_URL} alt="Z.A Training Logo" className="w-24 h-24 object-contain" />
              </div>
              <h3 className="text-red-500 font-bold tracking-[0.2em] uppercase mb-3 text-sm">Z.A Training & Education</h3>
              {isEditing ? (
                <input value={generatedPlan?.title || ''} onChange={(e) => updateGenField('title', e.target.value)} className="text-4xl font-extrabold leading-tight mb-4 text-white bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-red-500" />
              ) : (
                <h1 className="text-5xl font-extrabold leading-tight mb-4 text-white">{generatedPlan?.title || "Custom Nutrition Protocol"}</h1>
              )}
              <p className="text-2xl text-zinc-400 font-light">Prepared for <span className="text-white font-semibold">{formData.clientName || 'Client'}</span></p>
            </header>

            {showTargets && (
            <div className="relative z-10 mt-16 bg-zinc-900/60 p-8 rounded-3xl border border-red-900/50 backdrop-blur-sm shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-red-500" />
                Your Nutritional Targets
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Daily Calories</p>
                  {isEditing ? (
                    <input value={generatedPlan?.targets?.calories || ''} onChange={(e) => updateTarget('calories', e.target.value)} className="text-3xl font-black text-white bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-red-500" />
                  ) : (
                    <p className="text-4xl font-black text-white">{generatedPlan?.targets?.calories || "TBC"}</p>
                  )}
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-red-500 text-xs font-medium shrink-0">Est. TDEE:</span>
                      <input value={generatedPlan?.targets?.tdee || ''} onChange={(e) => updateTarget('tdee', e.target.value)} className="text-red-300 text-xs bg-zinc-800 border border-zinc-600 rounded px-2 py-0.5 w-full outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                  ) : (
                    <p className="text-red-500 text-xs mt-2 font-medium">Est. TDEE: {generatedPlan?.targets?.tdee || "TBC"}</p>
                  )}
                </div>
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Daily Protein</p>
                  {isEditing ? (
                    <input value={generatedPlan?.targets?.protein || ''} onChange={(e) => updateTarget('protein', e.target.value)} className="text-3xl font-black text-white bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-red-500" />
                  ) : (
                    <p className="text-4xl font-black text-white">{generatedPlan?.targets?.protein || "TBC"}</p>
                  )}
                </div>
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Daily Fibre</p>
                  {isEditing ? (
                    <input value={generatedPlan?.targets?.fibre || ''} onChange={(e) => updateTarget('fibre', e.target.value)} className="text-3xl font-black text-white bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-red-500" />
                  ) : (
                    <p className="text-4xl font-black text-white">{generatedPlan?.targets?.fibre || "TBC"}</p>
                  )}
                </div>
                <div className="bg-black/60 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-400 text-xs font-bold mb-1 uppercase tracking-widest">Protocol Length</p>
                  <p className="text-4xl font-black text-white">{formData.durationWeeks} Weeks</p>
                </div>
              </div>
            </div>
            )}
            
            {/* Cycle Banner */}
            {parseInt(formData.durationWeeks, 10) > 1 && (
              <div className="relative z-10 mt-8 bg-red-950/40 p-6 rounded-2xl border border-red-900/60 flex items-center shadow-lg">
                <Calendar className="w-7 h-7 text-red-500 mr-4 shrink-0" />
                <p className="text-red-100 text-sm leading-relaxed">
                  <strong className="text-white">Menu Rotation:</strong> You have been provided a 7-day master menu. Cycle this exact menu weekly to complete your {formData.durationWeeks}-week protocol.
                </p>
              </div>
            )}

            {/* Quick Wins */}
            {Array.isArray(generatedPlan?.quickWins) && generatedPlan.quickWins.length > 0 && (
              <div className="relative z-10 mt-8 bg-red-700 p-8 rounded-3xl shadow-2xl">
                <h3 className="text-white font-black text-lg uppercase tracking-widest mb-5 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                  Your 3 Non-Negotiables This Week
                </h3>
                <ul className="space-y-3">
                  {generatedPlan.quickWins.map((win, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-white font-black text-lg mr-3 shrink-0">{idx + 1}.</span>
                      {isEditing ? (
                        <textarea value={win || ''} onChange={(e) => updateGenArray('quickWins', idx, e.target.value)} rows={2} className="w-full bg-red-800 text-white font-medium leading-snug border border-red-400 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-white/50 resize-y" />
                      ) : (
                        <p className="text-red-100 font-medium leading-snug">{win}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Week at a Glance Page */}
          {Array.isArray(generatedPlan?.weeks?.[0]?.days) && (
            <div className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-white flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
              </div>
              <header className="relative z-10 mb-10 border-b-2 border-zinc-100 pb-5 flex justify-between items-end">
                <div>
                  <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-1">Your Plan</h4>
                  <h2 className="text-4xl font-black text-black">Week at a Glance</h2>
                  <p className="text-zinc-500 mt-1 font-medium">Stick this on your fridge.</p>
                </div>
                <img src={LOGO_URL} alt="ZA" className="w-10 h-10 object-contain opacity-80" />
              </header>
              <div className="relative z-10 grid grid-cols-7 gap-3 flex-1">
                {generatedPlan.weeks[0].days.map((day, idx) => (
                  <div key={idx} className="flex flex-col">
                    <div className="bg-black text-white text-center py-2 rounded-xl mb-3">
                      <p className="text-xs font-black uppercase tracking-widest">{day.day?.substring(0, 3)}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      {(day.meals || []).map((meal, mIdx) => (
                        <div key={mIdx} className="bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
                          <p className="text-[9px] font-black text-red-700 uppercase tracking-wide mb-1">{meal.type}</p>
                          <p className="text-[10px] font-semibold text-zinc-800 leading-snug">{meal.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Plans */}
          {(Array.isArray(generatedPlan?.weeks) ? generatedPlan.weeks : []).map((week, weekIdx) => (
            <div key={weekIdx}>
              {(Array.isArray(week?.days) ? week.days : []).map((day, dayIdx) => (
                <div key={dayIdx} className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-white flex flex-col relative overflow-hidden">
                  
                  {/* Subtle Page Watermark */}
                  <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
                  </div>

                  <header className="relative z-10 mb-8 border-b-2 border-zinc-100 pb-5">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm">Week {week?.weekNumber || 1}</h4>
                      <img src={LOGO_URL} alt="ZA" className="w-10 h-10 object-contain opacity-80" />
                    </div>
                    <div className="flex justify-between items-end">
                      <h2 className="text-4xl font-black text-black">{day?.day || "Day"}</h2>
                      {showDailyTotals && (
                        <div className="text-right bg-zinc-50 px-4 py-2 rounded-xl border border-zinc-200">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Daily Totals</span>
                          {isEditing ? (
                            <input value={day?.dailyTotals || ''} onChange={(e) => updateDayTotals(weekIdx, dayIdx, e.target.value)} className="font-bold text-black text-sm text-right border border-zinc-300 rounded-md px-2 py-0.5 outline-none focus:ring-2 focus:ring-red-400 w-48" />
                          ) : (
                            <span className="font-bold text-black text-sm">{day?.dailyTotals || "TBC"}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </header>

                  <div className="flex-1 space-y-6 relative z-10">
                    {(Array.isArray(day?.meals) ? day.meals : []).map((meal, mealIdx) => (
                      <div key={mealIdx} className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-700 rounded-l-2xl"></div>
                        
                        <div className="flex justify-between items-start mb-3 pl-2 gap-3">
                          {isEditing ? (
                            <input value={meal?.type || ''} onChange={(e) => updateMeal(weekIdx, dayIdx, mealIdx, 'type', e.target.value)} className="px-3 py-1 bg-red-50 text-red-800 text-xs font-bold tracking-wide uppercase rounded-md border border-red-300 outline-none focus:ring-2 focus:ring-red-400 w-1/3" />
                          ) : (
                            <span className="inline-block px-3 py-1 bg-red-50 text-red-800 text-xs font-bold tracking-wide uppercase rounded-md">
                              {meal?.type || "Meal"}
                            </span>
                          )}
                          {isEditing ? (
                            <input value={meal?.metrics || ''} onChange={(e) => updateMeal(weekIdx, dayIdx, mealIdx, 'metrics', e.target.value)} className="text-xs font-bold text-zinc-700 bg-zinc-100 px-3 py-1 rounded-md border border-zinc-300 outline-none focus:ring-2 focus:ring-red-400 text-right w-1/2" />
                          ) : (
                            <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-md border border-zinc-200">
                              {meal?.metrics || "TBC"}
                            </span>
                          )}
                        </div>
                        {isEditing ? (
                          <input value={meal?.name || ''} onChange={(e) => updateMeal(weekIdx, dayIdx, mealIdx, 'name', e.target.value)} className="text-xl font-bold text-black mb-2 ml-2 w-[calc(100%-0.5rem)] border border-zinc-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-400" />
                        ) : (
                          <h4 className="text-xl font-bold text-black mb-2 pl-2">{meal?.name || "Recipe"}</h4>
                        )}
                        {isEditing ? (
                          <textarea value={meal?.description || ''} onChange={(e) => updateMeal(weekIdx, dayIdx, mealIdx, 'description', e.target.value)} rows={2} className="text-zinc-600 text-sm mb-3 ml-2 w-[calc(100%-0.5rem)] leading-relaxed border border-zinc-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-400 resize-y" />
                        ) : (
                          <p className="text-zinc-600 text-sm mb-3 leading-relaxed pl-2">{meal?.description || ""}</p>
                        )}
                        {(meal?.portionGuide || isEditing) && (
                          <div className="ml-2 mb-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                            <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-1">Your Portion</p>
                            {isEditing ? (
                              <textarea value={meal?.portionGuide || ''} onChange={(e) => updateMeal(weekIdx, dayIdx, mealIdx, 'portionGuide', e.target.value)} rows={2} className="text-sm font-semibold text-zinc-800 w-full leading-relaxed border border-red-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-400 resize-y bg-white" />
                            ) : (
                              <p className="text-sm font-semibold text-zinc-800 leading-relaxed">{meal.portionGuide}</p>
                            )}
                          </div>
                        )}
                        
                        {meal?.prepNote && (
                          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-100 pl-2">
                            <div className="flex items-start text-zinc-700 bg-zinc-50 px-4 py-3 rounded-xl text-sm border border-zinc-200/50">
                              <Clock className="w-4 h-4 mr-2.5 mt-0.5 shrink-0 text-red-600" />
                              <span className="font-medium"><strong className="text-black">Prep Note:</strong> {meal.prepNote}</span>
                            </div>
                          </div>
                        )}
                        {meal?.swapNote && (
                          <div className="ml-2 mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                            <span className="text-amber-500 text-base shrink-0">💬</span>
                            <p className="text-sm text-amber-800 font-medium leading-snug">{meal.swapNote}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <p className="relative z-10 mt-6 text-zinc-400 text-xs italic text-center">
                    Nutritional values are estimates. Actual values may vary slightly depending on brands and cooking methods.
                  </p>
                </div>
              ))}
            </div>
          ))}

          {/* Shopping List & Summary Page */}
          <div className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-zinc-50 relative overflow-hidden">
            {/* Subtle Page Watermark */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
            </div>

            <header className="relative z-10 mb-10 border-b-2 border-zinc-200 pb-6 flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black text-black">Shopping List & Tips</h2>
                <p className="text-zinc-500 mt-2 text-lg font-medium">Everything you need for your protocol.</p>
              </div>
              <img src={LOGO_URL} alt="ZA" className="w-12 h-12 object-contain opacity-80" />
            </header>

            <div className="grid grid-cols-2 gap-8 mb-12 relative z-10">
              {Object.entries(generatedPlan?.shoppingList || {}).map(([category, items]) => (
                <div key={category} className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h3 className="font-bold text-black uppercase tracking-wider text-sm mb-4 border-b border-zinc-100 pb-3">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <ul className="space-y-2.5">
                    {(Array.isArray(items) ? items : []).map((item, idx) => (
                      <li key={idx} className="flex items-start text-zinc-700 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 mt-1.5 shrink-0"></div>
                        {isEditing ? (
                          <input value={item || ''} onChange={(e) => updateShoppingItem(category, idx, e.target.value)} className="w-full text-zinc-700 text-sm font-medium border border-zinc-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-red-400" />
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-black text-white p-10 rounded-3xl relative z-10 shadow-2xl">
              <h3 className="text-2xl font-bold flex items-center mb-8">
                <Lightbulb className="w-7 h-7 mr-3 text-red-600" /> 
                Coach's Tips for Success
              </h3>
              <ul className="space-y-5 mb-10">
                {(Array.isArray(generatedPlan?.tips) ? generatedPlan.tips : []).map((tip, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 mr-4 text-red-600 shrink-0 mt-0.5" />
                    {isEditing ? (
                      <textarea value={tip || ''} onChange={(e) => updateGenArray('tips', idx, e.target.value)} rows={2} className="w-full bg-zinc-800 text-zinc-200 leading-relaxed text-lg border border-zinc-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 resize-y" />
                    ) : (
                      <p className="text-zinc-300 leading-relaxed text-lg">{tip}</p>
                    )}
                  </li>
                ))}
              </ul>
              <div className="bg-zinc-900 p-8 rounded-2xl border border-red-900/50">
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-3">The One Thing</p>
                {isEditing ? (
                  <textarea value={generatedPlan?.summary || ''} onChange={(e) => updateGenField('summary', e.target.value)} rows={3} className="w-full bg-zinc-800 text-white text-2xl font-medium leading-tight border border-zinc-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 resize-y" />
                ) : (
                  <p className="text-2xl font-medium text-white leading-tight">{generatedPlan?.summary || "Focus on your daily targets and consistency."}</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (view === 'starterPreview' && starterPlan) {
    const menu = starterPlan.menu || {};
    const h = starterPlan.headings || {};
    const hv = (key, fallback) => (h[key] !== undefined ? h[key] : fallback);
    const sections = [
      { key: 'breakfast', labelKey: 'breakfastLabel', label: hv('breakfastLabel', 'Breakfast'), emoji: '🍳' },
      { key: 'lunch', labelKey: 'lunchLabel', label: hv('lunchLabel', 'Lunch'), emoji: '🥗' },
      { key: 'dinner', labelKey: 'dinnerLabel', label: hv('dinnerLabel', 'Dinner'), emoji: '🍛' },
      { key: 'snacks', labelKey: 'snacksLabel', label: hv('snacksLabel', 'Snacks'), emoji: '🍎' },
    ];
    return (
      <div className="min-h-screen bg-zinc-200 py-8 print:py-0 print:bg-white flex flex-col items-center">
        {/* Controls */}
        <div className="max-w-[210mm] w-full flex flex-wrap justify-between items-center gap-2 mb-6 print:hidden px-4 md:px-0">
          <button onClick={() => setView('dashboard')} className="flex items-center text-zinc-600 hover:text-black bg-white px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Edit Details
          </button>
          <button onClick={() => setShowStarterNotes(!showStarterNotes)} className={`flex items-center px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors border ${showStarterNotes ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'}`}>
            {showStarterNotes ? '📝 Notes: On' : '📝 Notes: Off'}
          </button>
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors border ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'}`}>
            {isEditing ? '✓ Done Editing' : '✏️ Edit Plan'}
          </button>
          <button onClick={() => { setIsEditing(false); setTimeout(() => window.print(), 50); }} className="flex items-center bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg shadow-md font-bold transition-all">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </button>
        </div>

        {isEditing && (
          <div className="max-w-[210mm] w-full mb-6 print:hidden px-4 md:px-0">
            <div className="bg-green-50 border border-green-300 rounded-xl px-5 py-3 text-green-800 text-sm font-medium flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <span><strong>Edit mode is ON.</strong> Click any text — the welcome note, fundamentals, meal options, swaps — to change it. Turn on "Notes" to add your own coaching notes. Tap "Done Editing" when finished.</span>
            </div>
          </div>
        )}

        <div className="document-container w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none text-zinc-900 relative">

          {/* Cover + Fundamentals */}
          <div className="page break-after-page min-h-[297mm] flex flex-col relative overflow-hidden bg-black text-white p-16">
            <div className="absolute top-0 right-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-red-700 via-transparent to-transparent pointer-events-none"></div>
            <header className="relative z-10 flex flex-col items-start mt-4">
              <div className="bg-white p-4 rounded-3xl shadow-xl shadow-red-900/20 mb-8">
                <img src={LOGO_URL} alt="Z.A Training Logo" className="w-20 h-20 object-contain" />
              </div>
              {isEditing ? (
                <input value={hv('coverEyebrow', 'Z.A Training — Getting Started')} onChange={(e) => updateStarterHeading('coverEyebrow', e.target.value)} className="text-red-400 font-bold tracking-[0.2em] uppercase mb-3 text-sm bg-zinc-800 border border-zinc-600 rounded-md px-3 py-1 w-full outline-none focus:ring-2 focus:ring-red-500" />
              ) : (
                <h3 className="text-red-500 font-bold tracking-[0.2em] uppercase mb-3 text-sm">{hv('coverEyebrow', 'Z.A Training — Getting Started')}</h3>
              )}
              {isEditing ? (
                <input value={starterPlan.title || ''} onChange={(e) => updateStarter('title', e.target.value)} className="text-4xl font-extrabold leading-tight mb-4 text-white bg-zinc-800 border border-zinc-600 rounded-xl px-4 py-2 w-full outline-none focus:ring-2 focus:ring-red-500" />
              ) : (
                <h1 className="text-5xl font-extrabold leading-tight mb-4 text-white">{starterPlan.title || 'Your First Two Weeks'}</h1>
              )}
              <p className="text-xl text-zinc-400 font-light">Prepared for <span className="text-white font-semibold">{formData.clientName || 'Client'}</span></p>
            </header>
            {(starterPlan.welcome || isEditing) && (
              <div className="relative z-10 mt-8 bg-zinc-900/60 p-6 rounded-2xl border border-red-900/40">
                {isEditing ? (
                  <textarea value={starterPlan.welcome || ''} onChange={(e) => updateStarter('welcome', e.target.value)} rows={3} className="w-full bg-zinc-800 text-zinc-100 leading-relaxed italic border border-zinc-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 resize-y" />
                ) : (
                  <p className="text-zinc-200 leading-relaxed italic">{starterPlan.welcome}</p>
                )}
              </div>
            )}
            {Array.isArray(starterPlan.fundamentals) && (
              <div className="relative z-10 mt-8">
                <h2 className="text-2xl font-bold text-white mb-5 flex items-center"><Target className="w-6 h-6 mr-3 text-red-500 shrink-0" />
                  {isEditing ? (
                    <input value={hv('fundamentalsHeading', 'Your Fundamentals')} onChange={(e) => updateStarterHeading('fundamentalsHeading', e.target.value)} className="text-2xl font-bold text-white bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-1 w-full outline-none focus:ring-2 focus:ring-red-500" />
                  ) : hv('fundamentalsHeading', 'Your Fundamentals')}
                </h2>
                <div className="space-y-3">
                  {starterPlan.fundamentals.map((f: string, i: number) => (
                    <div key={i} className="flex items-start bg-black/50 p-4 rounded-xl border border-zinc-800">
                      <span className="text-red-500 font-black text-lg mr-4 shrink-0">{i + 1}</span>
                      {isEditing ? (
                        <textarea value={f || ''} onChange={(e) => updateStarterFundamental(i, e.target.value)} rows={2} className="w-full bg-zinc-800 text-zinc-100 font-medium leading-snug border border-zinc-600 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-500 resize-y" />
                      ) : (
                        <p className="text-zinc-200 font-medium leading-snug">{f}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mix & Match Menu */}
          <div className="page break-before-page break-after-page min-h-[297mm] p-16 pt-20 bg-white flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
            </div>
            <header className="relative z-10 mb-8 border-b-2 border-zinc-100 pb-5 flex justify-between items-end gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input value={hv('menuEyebrow', 'Mix & Match')} onChange={(e) => updateStarterHeading('menuEyebrow', e.target.value)} className="text-red-700 font-bold tracking-widest uppercase text-sm mb-1 border border-zinc-300 rounded-md px-2 py-1 w-full outline-none focus:ring-2 focus:ring-red-400" />
                ) : (
                  <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-1">{hv('menuEyebrow', 'Mix & Match')}</h4>
                )}
                {isEditing ? (
                  <input value={hv('menuTitle', 'Pick & Choose Meals')} onChange={(e) => updateStarterHeading('menuTitle', e.target.value)} className="text-3xl font-black text-black border border-zinc-300 rounded-lg px-2 py-1 w-full outline-none focus:ring-2 focus:ring-red-400 mb-1" />
                ) : (
                  <h2 className="text-4xl font-black text-black">{hv('menuTitle', 'Pick & Choose Meals')}</h2>
                )}
                {isEditing ? (
                  <textarea value={hv('menuSubtitle', 'Choose any one from each section, each day. No rules — just rotate what you fancy.')} onChange={(e) => updateStarterHeading('menuSubtitle', e.target.value)} rows={2} className="text-zinc-500 font-medium border border-zinc-300 rounded-md px-2 py-1 w-full outline-none focus:ring-2 focus:ring-red-400 resize-y" />
                ) : (
                  <p className="text-zinc-500 mt-1 font-medium">{hv('menuSubtitle', 'Choose any one from each section, each day. No rules — just rotate what you fancy.')}</p>
                )}
              </div>
              <img src={LOGO_URL} alt="ZA" className="w-10 h-10 object-contain opacity-80 shrink-0" />
            </header>
            <div className="relative z-10 grid grid-cols-2 gap-6">
              {sections.map((s) => (
                <div key={s.key} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6">
                  <h3 className="font-black text-black uppercase tracking-wider text-sm mb-4 flex items-center">
                    <span className="mr-2 text-lg shrink-0">{s.emoji}</span>
                    {isEditing ? (
                      <input value={s.label} onChange={(e) => updateStarterHeading(s.labelKey, e.target.value)} className="font-black text-black uppercase tracking-wider text-sm border border-zinc-300 rounded-md px-2 py-0.5 w-full outline-none focus:ring-2 focus:ring-red-400" />
                    ) : s.label}
                  </h3>
                  <ul className="space-y-3">
                    {(Array.isArray(menu[s.key]) ? menu[s.key] : []).map((opt: string, i: number) => (
                      <li key={i} className="flex items-start text-zinc-700 text-sm font-medium">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 mt-1.5 shrink-0"></div>
                        {isEditing ? (
                          <textarea value={opt || ''} onChange={(e) => updateStarterMenu(s.key, i, e.target.value)} rows={2} className="w-full text-zinc-700 text-sm font-medium border border-zinc-300 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-red-400 resize-y bg-white" />
                        ) : (
                          opt
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Smarter Swaps */}
          <div className="page break-before-page min-h-[297mm] p-16 pt-20 bg-zinc-50 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <img src={LOGO_URL} className="w-[500px] h-[500px] object-contain grayscale" alt="" />
            </div>
            <header className="relative z-10 mb-8 border-b-2 border-zinc-200 pb-5 flex justify-between items-end gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <input value={hv('swapsEyebrow', 'Easy Wins')} onChange={(e) => updateStarterHeading('swapsEyebrow', e.target.value)} className="text-red-700 font-bold tracking-widest uppercase text-sm mb-1 border border-zinc-300 rounded-md px-2 py-1 w-full outline-none focus:ring-2 focus:ring-red-400" />
                ) : (
                  <h4 className="text-red-700 font-bold tracking-widest uppercase text-sm mb-1">{hv('swapsEyebrow', 'Easy Wins')}</h4>
                )}
                {isEditing ? (
                  <input value={hv('swapsTitle', 'Smarter Swaps')} onChange={(e) => updateStarterHeading('swapsTitle', e.target.value)} className="text-3xl font-black text-black border border-zinc-300 rounded-lg px-2 py-1 w-full outline-none focus:ring-2 focus:ring-red-400 mb-1" />
                ) : (
                  <h2 className="text-4xl font-black text-black">{hv('swapsTitle', 'Smarter Swaps')}</h2>
                )}
                {isEditing ? (
                  <textarea value={hv('swapsSubtitle', 'Small switches that make a big difference.')} onChange={(e) => updateStarterHeading('swapsSubtitle', e.target.value)} rows={2} className="text-zinc-500 font-medium border border-zinc-300 rounded-md px-2 py-1 w-full outline-none focus:ring-2 focus:ring-red-400 resize-y" />
                ) : (
                  <p className="text-zinc-500 mt-1 font-medium">{hv('swapsSubtitle', 'Small switches that make a big difference.')}</p>
                )}
              </div>
              <img src={LOGO_URL} alt="ZA" className="w-10 h-10 object-contain opacity-80 shrink-0" />
            </header>
            <div className="relative z-10 space-y-3">
              {(Array.isArray(starterPlan.swaps) ? starterPlan.swaps : []).map((sw: any, i: number) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      <input value={sw.from || ''} onChange={(e) => updateStarterSwap(i, 'from', e.target.value)} placeholder="Swap this..." className="text-zinc-500 font-semibold border border-zinc-300 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-red-400 w-full" />
                      <input value={sw.to || ''} onChange={(e) => updateStarterSwap(i, 'to', e.target.value)} placeholder="...for this" className="text-black font-bold border border-zinc-300 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-red-400 w-full" />
                      <input value={sw.why || ''} onChange={(e) => updateStarterSwap(i, 'why', e.target.value)} placeholder="Why (short reason)" className="text-zinc-500 text-sm border border-zinc-300 rounded-md px-2 py-1.5 outline-none focus:ring-2 focus:ring-red-400 w-full" />
                    </div>
                  ) : (
                    <div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-zinc-400 font-semibold line-through">{sw.from}</span>
                        <span className="text-red-600 font-black">→</span>
                        <span className="text-black font-bold">{sw.to}</span>
                      </div>
                      {sw.why && <p className="text-zinc-500 text-sm mt-1.5">{sw.why}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Coaching Notes (toggleable) */}
            {showStarterNotes && (isEditing || starterNotes) && (
              <div className="relative z-10 mt-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                <h3 className="font-black text-amber-700 uppercase tracking-wider text-sm mb-3 flex items-center"><span className="mr-2 text-lg shrink-0">📝</span>
                  {isEditing ? (
                    <input value={hv('notesHeading', "Coach's Notes")} onChange={(e) => updateStarterHeading('notesHeading', e.target.value)} className="font-black text-amber-700 uppercase tracking-wider text-sm border border-amber-300 rounded-md px-2 py-0.5 w-full outline-none focus:ring-2 focus:ring-amber-400" />
                  ) : hv('notesHeading', "Coach's Notes")}
                </h3>
                {isEditing ? (
                  <textarea value={starterNotes} onChange={(e) => setStarterNotes(e.target.value)} rows={5} placeholder="Add any personal notes for this client here..." className="w-full bg-white text-zinc-800 leading-relaxed border border-amber-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-400 resize-y" />
                ) : (
                  <p className="text-zinc-800 leading-relaxed whitespace-pre-wrap">{starterNotes}</p>
                )}
              </div>
            )}

            {(starterPlan.closingTip || isEditing) && (
              <div className="relative z-10 mt-10 bg-red-700 p-8 rounded-3xl shadow-2xl">
                {isEditing ? (
                  <textarea value={starterPlan.closingTip || ''} onChange={(e) => updateStarter('closingTip', e.target.value)} rows={2} className="w-full bg-red-800 text-white font-bold text-lg leading-snug border border-red-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50 resize-y" />
                ) : (
                  <p className="text-white font-bold text-lg leading-snug">{starterPlan.closingTip}</p>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // DEFAULT VIEW: COACH DASHBOARD
  return (
    <div className="min-h-screen bg-zinc-100 font-sans text-zinc-900 pb-24 selection:bg-red-200 selection:text-red-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-zinc-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 overflow-hidden flex items-center justify-center">
              <img src={LOGO_URL} alt="Z.A Training" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-black tracking-tight">Z.A<span className="text-red-700">Training</span></span>
          </div>
          <div className="text-xs font-bold text-zinc-400 tracking-widest uppercase border border-zinc-200 px-3 py-1.5 rounded-full">Coach Portal</div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Tab Switcher */}
        <div className="mb-8 inline-flex bg-zinc-200/70 p-1.5 rounded-2xl">
          <button
            onClick={() => setPlanMode('starter')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${planMode === 'starter' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            🌱 Starter Plan
          </button>
          <button
            onClick={() => setPlanMode('full')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${planMode === 'full' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-zinc-800'}`}
          >
            📋 Full Meal Plan
          </button>
        </div>

        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-black mb-3">{planMode === 'starter' ? 'Starter Plan' : 'New Client Protocol'}</h1>
            <p className="text-zinc-500 font-medium">{planMode === 'starter' ? 'A gentle first-two-weeks plan to ease a brand-new client in — fundamentals + flexible meal options.' : 'Complete the intake data to generate an evidence-based, culturally adapted plan.'}</p>
          </div>
          {planMode === 'full' && (
          <button
            onClick={populateTestData}
            className="flex items-center justify-center text-sm font-bold text-red-800 bg-red-100 hover:bg-red-200 px-5 py-3 rounded-xl transition-all border border-red-200 shrink-0 shadow-sm"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Auto-Fill Test Data
          </button>
          )}
        </div>

        {error && (
          <div className="mb-8 bg-red-50 text-red-800 p-5 rounded-xl flex items-start border border-red-200 shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <p className="font-medium break-words whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {planMode === 'full' && (
        <>
        <div className="space-y-8">

          {/* SECTION 1: Personal & Body Metrics */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <User className="w-5 h-5 mr-3 text-red-700" /> Client Data & Metrics
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="e.g. Zara Ahmed" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Age</label>
                <input type="number" name="age" min="1" step="1" value={formData.age} onChange={handleInputChange} placeholder="e.g. 34" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Height (cm)</label>
                <input type="number" name="height" min="1" step="any" value={formData.height} onChange={handleInputChange} placeholder="e.g. 162" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                <input type="number" name="weight" min="1" step="any" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 75" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Sedentary</option><option>Lightly active</option><option>Moderately active</option><option>Very active</option>
                </select>
              </div>
              <div className="md:col-span-4">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Manual Calorie Target (optional)</label>
                <input type="number" name="manualCalories" min="1" step="any" value={formData.manualCalories} onChange={handleInputChange} placeholder="e.g. 1500 — type a number here to skip the metrics above" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
                <p className="text-xs text-zinc-400 mt-2">Leave blank to calculate from the metrics above. Enter a number and the plan is built around exactly that calorie target.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: Goals & Health */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <HeartPulse className="w-5 h-5 mr-3 text-red-700" /> Goals & Medical Profile
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Primary Goal</label>
                <input type="text" name="goal" value={formData.goal} onChange={handleInputChange} placeholder="e.g. Fat loss" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Goal Timeframe</label>
                <input type="text" name="timeframe" value={formData.timeframe} onChange={handleInputChange} placeholder="e.g. Lose 5kg over 12 weeks" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Hormonal Status</label>
                <select name="hormonalStatus" value={formData.hormonalStatus} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Regular cycle</option><option>PCOS</option><option>Perimenopause</option><option>Menopause</option><option>Post-menopause</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Medical Flags</label>
                <input type="text" name="medicalFlags" value={formData.medicalFlags} onChange={handleInputChange} placeholder="e.g. Insulin resistance, Type 2 diabetes risk, None" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 3: Dietary Approach */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <Target className="w-5 h-5 mr-3 text-red-700" /> Dietary Approach
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Dietary Approach</label>
                <select name="approach" value={formData.approach} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Calories & Macros</option><option>Hand Portions</option><option>Simple Targets</option><option>Cups</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Plan Duration</label>
                <select name="durationWeeks" value={formData.durationWeeks} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option value="1">1 Week</option>
                  <option value="2">2 Weeks</option>
                  <option value="4">4 Weeks</option>
                  <option value="6">6 Weeks</option>
                  <option value="8">8 Weeks</option>
                  <option value="12">12 Weeks</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Religious Fasting</label>
                <select name="religiousFasting" value={formData.religiousFasting} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>None</option><option>Ramadan</option><option>Intermittent Fasting</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Carb Preference</label>
                <select name="carbPreference" value={formData.carbPreference} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Low Carb</option><option>Moderate</option><option>Higher Carb</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Dietary Preferences / Restrictions</label>
                <input type="text" name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleInputChange} placeholder="e.g. Vegetarian, Lactose intolerant, No Beef" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>

          {/* SECTION 4: Culture & Lifestyle */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <Globe className="w-5 h-5 mr-3 text-red-700" /> Culture & Lifestyle Context
              </h2>
            </div>
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Regional Cuisine Focus</label>
                <select name="regionalCuisine" value={formData.regionalCuisine} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Pakistani</option>
                  <option>Indian</option>
                  <option>Bangladeshi</option>
                  <option>Sri Lankan</option>
                  <option>Mixed South Asian</option>
                  <option>Mix of South Asian and Western</option>
                  <option>Western/Standard</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Cooking For</label>
                <select name="cookingFor" value={formData.cookingFor} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Herself only</option><option>Couple</option><option>Family (with kids)</option>
                </select>
              </div>
              {formData.cookingFor === 'Family (with kids)' && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Number of People Eating</label>
                <select name="familySize" value={formData.familySize} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6">6 people</option>
                  <option value="7">7 people</option>
                  <option value="8">8+ people</option>
                </select>
              </div>
              )}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Daily Cooking Time limit</label>
                <select name="cookingTime" value={formData.cookingTime} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>15 mins max</option><option>30 mins</option><option>45 mins</option><option>60 mins+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Batch Cooking Status</label>
                <select name="batchCooking" value={formData.batchCooking} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                  <option>Yes - Prioritise Batch Cooking</option><option>No - Prefers Fresh Daily</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Available Ingredients (Optional)</label>
                <textarea name="availableFoods" value={formData.availableFoods} onChange={handleInputChange} placeholder="List specific foods they have or want to use up..." rows="2" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none resize-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
            <span className="px-4 text-zinc-400 font-bold text-sm uppercase tracking-widest">Or</span>
            <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
          </div>

          {/* Convert Existing Plan to Cups */}
          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <Upload className="w-5 h-5 mr-3 text-red-700" /> Convert Existing Plan to Cups
              </h2>
            </div>
            <div className="p-7">
              <p className="text-zinc-500 text-sm mb-5">Already sent a plan and your client wants cups? Upload the PDF and we'll convert every measurement — exact same meals, exact same foods, just in cups.</p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Upload Plan PDF</label>
                  <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border-2 border-dashed border-zinc-300 hover:border-red-400 hover:bg-red-50/30 cursor-pointer transition-all group">
                    <Upload className="w-5 h-5 text-zinc-400 group-hover:text-red-600 shrink-0" />
                    <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-700 truncate">
                      {convertFile ? convertFile.name : 'Click to upload PDF...'}
                    </span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setConvertFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <button
                  onClick={convertToCups}
                  disabled={!convertFile}
                  className="flex items-center bg-zinc-800 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Convert to Cups
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Generate Button Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-zinc-200 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center">
          <button
            onClick={generateAIPlan}
            disabled={!isFormValid()}
            className="flex items-center bg-red-700 hover:bg-red-800 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 max-w-4xl w-full justify-center tracking-wide"
          >
            <FileText className="w-6 h-6 mr-3" />
            Generate Final Protocol
          </button>
        </div>
        </>
        )}

        {planMode === 'starter' && (
        <>
        <div className="space-y-8">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-green-800 text-sm font-medium flex items-start gap-2">
            <span className="text-lg">🌱</span>
            <span>This makes a gentle, flexible starter plan for a brand-new client — fundamentals plus pick-and-choose meals. No calorie counting. Use this for their first couple of weeks, then switch them to the Full Meal Plan.</span>
          </div>

          <div className="bg-white shadow-sm border border-zinc-200 rounded-2xl overflow-hidden">
            <div className="bg-zinc-50 border-b border-zinc-200 p-5">
              <h2 className="text-lg font-black flex items-center text-black uppercase tracking-wide">
                <User className="w-5 h-5 mr-3 text-red-700" /> Client Basics
              </h2>
            </div>
            <div className="p-7 space-y-6">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={handleInputChange} placeholder="Client's name" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Primary Goal</label>
                  <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                    <option>Fat loss</option><option>Maintenance</option><option>Build healthy habits</option><option>Muscle building</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Regional Cuisine</label>
                  <select name="regionalCuisine" value={formData.regionalCuisine} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none bg-white transition-all text-black font-medium cursor-pointer">
                    <option>Indian</option><option>Pakistani</option><option>Bangladeshi</option><option>Sri Lankan</option><option>Mixed / British-Asian</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Dislikes / Allergies / Restrictions</label>
                <input type="text" name="dietaryPreferences" value={formData.dietaryPreferences} onChange={handleInputChange} placeholder="e.g. Vegetarian, no fish, lactose intolerant" className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none transition-all text-black font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Foods They Have / Want To Use <span className="text-zinc-400 normal-case">(optional)</span></label>
                <textarea name="availableFoods" value={formData.availableFoods} onChange={handleInputChange} placeholder="Leave blank to let the AI choose from approved foods..." rows={2} className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-red-700 focus:border-red-700 outline-none resize-none transition-all text-black font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Starter Generate Button Fixed Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-zinc-200 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] z-20 flex justify-center">
          <button
            onClick={generateStarterPlan}
            disabled={!formData.clientName?.trim()}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-900/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 max-w-4xl w-full justify-center tracking-wide"
          >
            <FileText className="w-6 h-6 mr-3" />
            Generate Starter Plan
          </button>
        </div>
        </>
        )}
      </main>
    </div>
  );
}