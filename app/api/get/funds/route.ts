import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;
    const fundId = request.nextUrl.searchParams.get('fundId');
    const name = request.nextUrl.searchParams.get('name');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let query = supabase.from('funds').select('*').eq('user_id', userId);

    if (fundId) {
      query = query.eq('id', fundId);
    }
    if (name) {
      query = query.ilike('name', `%${name}%`);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Add progress percentage to each fund
    const dataWithProgress = data?.map(fund => ({
      ...fund,
      progress: ((parseFloat(fund.current_amount) / parseFloat(fund.target_amount)) * 100).toFixed(2)
    }));

    const totalTarget = data?.reduce((sum, f) => sum + parseFloat(f.target_amount), 0) || 0;
    const totalCurrent = data?.reduce((sum, f) => sum + parseFloat(f.current_amount), 0) || 0;

    return NextResponse.json({
      success: true,
      data: dataWithProgress,
      count: data?.length || 0,
      summary: {
        totalTarget,
        totalCurrent,
        overallProgress: totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(2) : 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}