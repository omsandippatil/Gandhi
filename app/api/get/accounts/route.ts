import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;
    const accountId = request.nextUrl.searchParams.get('accountId');
    const type = request.nextUrl.searchParams.get('type');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let query = supabase.from('accounts').select('*').eq('user_id', userId);

    if (accountId) {
      query = query.eq('id', accountId);
    }
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}