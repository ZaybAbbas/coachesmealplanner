import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const { title, ingredients } = await request.json();
  const appId = process.env.EDAMAM_APP_ID;
  const appKey = process.env.EDAMAM_APP_KEY;

  const response = await fetch(
    `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, ingr: ingredients })
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: 'Nutrition lookup failed' }, { status: response.status });
  }

  const data = await response.json();

  const round = (n: number) => Math.round(n || 0);

  return NextResponse.json({
    calories: round(data.calories),
    protein: round(data.totalNutrients?.PROCNT?.quantity),
    carbs: round(data.totalNutrients?.CHOCDF?.quantity),
    fat: round(data.totalNutrients?.FAT?.quantity),
    fibre: round(data.totalNutrients?.FIBTG?.quantity)
  });
}
