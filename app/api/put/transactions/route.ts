import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      userId = process.env.TEST_USER_ID,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date,
      tags
    } = body;

    // Validation
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    if (!accountId) {
      return NextResponse.json({ error: 'accountId required' }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: 'type required (income/expense)' }, { status: 400 });
    }
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'valid amount required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'date required' }, { status: 400 });
    }

    // Verify type is valid
    if (type !== 'income' && type !== 'expense') {
      return NextResponse.json({ 
        error: 'type must be either "income" or "expense"' 
      }, { status: 400 });
    }

    // Insert transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        account_id: accountId,
        category_id: categoryId || null,
        type,
        amount: parseFloat(amount),
        description: description || null,
        date,
        tags: tags || null
      })
      .select('*, accounts(account_name), categories(name)')
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Transaction created successfully' 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      transactionId,
      userId = process.env.TEST_USER_ID,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date,
      tags
    } = body;

    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId required' }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (accountId !== undefined) updateData.account_id = accountId;
    if (categoryId !== undefined) updateData.category_id = categoryId;
    if (type !== undefined) {
      if (type !== 'income' && type !== 'expense') {
        return NextResponse.json({ 
          error: 'type must be either "income" or "expense"' 
        }, { status: 400 });
      }
      updateData.type = type;
    }
    if (amount !== undefined) {
      if (amount <= 0) {
        return NextResponse.json({ error: 'amount must be greater than 0' }, { status: 400 });
      }
      updateData.amount = parseFloat(amount);
    }
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = date;
    if (tags !== undefined) updateData.tags = tags;

    // Update transaction
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select('*, accounts(account_name), categories(name)')
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ 
        error: 'Transaction not found or unauthorized' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Transaction updated successfully' 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const transactionId = request.nextUrl.searchParams.get('transactionId');
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;

    if (!transactionId) {
      return NextResponse.json({ error: 'transactionId required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ 
        error: 'Transaction not found or unauthorized' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Transaction deleted successfully',
      data 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}