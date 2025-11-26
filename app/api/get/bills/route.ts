import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;
    const billId = request.nextUrl.searchParams.get('billId');
    const status = request.nextUrl.searchParams.get('status'); // pending/paid
    const recurrence = request.nextUrl.searchParams.get('recurrence');
    const upcoming = request.nextUrl.searchParams.get('upcoming'); // true/false
    const overdue = request.nextUrl.searchParams.get('overdue'); // true/false

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let query = supabase
      .from('bills')
      .select('*, accounts(account_name)')
      .eq('user_id', userId);

    if (billId) {
      query = query.eq('id', billId);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (recurrence) {
      query = query.eq('recurrence', recurrence);
    }
    if (upcoming === 'true') {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      query = query.gte('due_date', today).lte('due_date', futureDate.toISOString().split('T')[0]);
    }
    if (overdue === 'true') {
      const today = new Date().toISOString().split('T')[0];
      query = query.lt('due_date', today).eq('status', 'pending');
    }

    query = query.order('due_date', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
