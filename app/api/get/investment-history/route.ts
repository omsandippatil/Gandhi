import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const investmentId = request.nextUrl.searchParams.get('investmentId');
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const limit = request.nextUrl.searchParams.get('limit');

    if (!investmentId) {
      return NextResponse.json({ error: 'investmentId required' }, { status: 400 });
    }

    let query = supabase
      .from('investment_history')
      .select('*')
      .eq('investment_id', investmentId);

    if (startDate) {
      query = query.gte('recorded_at', startDate);
    }
    if (endDate) {
      query = query.lte('recorded_at', endDate);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    query = query.order('recorded_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}