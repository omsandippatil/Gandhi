import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;
    const categoryId = request.nextUrl.searchParams.get('categoryId');
    const type = request.nextUrl.searchParams.get('type'); // income/expense
    const parentId = request.nextUrl.searchParams.get('parentId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let query = supabase.from('categories').select('*').eq('user_id', userId);

    if (categoryId) {
      query = query.eq('id', categoryId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (parentId) {
      query = query.eq('parent_id', parentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data?.length || 0 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}