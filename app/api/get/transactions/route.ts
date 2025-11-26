import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;
    const transactionId = request.nextUrl.searchParams.get('transactionId');
    const accountId = request.nextUrl.searchParams.get('accountId');
    const categoryId = request.nextUrl.searchParams.get('categoryId');
    const type = request.nextUrl.searchParams.get('type'); // income/expense
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const month = request.nextUrl.searchParams.get('month'); // YYYY-MM
    const limit = request.nextUrl.searchParams.get('limit');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let query = supabase
      .from('transactions')
      .select('*, accounts(account_name), categories(name)')
      .eq('user_id', userId);

    if (transactionId) {
      query = query.eq('id', transactionId);
    }
    if (accountId) {
      query = query.eq('account_id', accountId);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (month) {
      const [year, monthNum] = month.split('-');
      const startOfMonth = `${year}-${monthNum}-01`;
      const endOfMonth = new Date(parseInt(year), parseInt(monthNum), 0).toISOString().split('T')[0];
      query = query.gte('date', startOfMonth).lte('date', endOfMonth);
    }
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    query = query.order('date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}