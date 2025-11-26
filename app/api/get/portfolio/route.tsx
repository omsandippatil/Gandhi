import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId') || process.env.TEST_USER_ID;
    const investmentId = request.nextUrl.searchParams.get('investmentId');
    const type = request.nextUrl.searchParams.get('type');
    const platform = request.nextUrl.searchParams.get('platform');
    const assetName = request.nextUrl.searchParams.get('assetName');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    let query = supabase.from('investments').select('*').eq('user_id', userId);

    if (investmentId) {
      query = query.eq('id', investmentId);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (platform) {
      query = query.ilike('platform', `%${platform}%`);
    }
    if (assetName) {
      query = query.ilike('asset_name', `%${assetName}%`);
    }

    query = query.order('buy_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Add calculated fields to each investment
    const dataWithMetrics = data?.map(investment => {
      const totalInvestment = parseFloat(investment.buy_price) * parseFloat(investment.quantity);
      const currentValue = parseFloat(investment.current_price) * parseFloat(investment.quantity);
      const profitLoss = currentValue - totalInvestment;
      const profitLossPercentage = totalInvestment > 0 
        ? ((profitLoss / totalInvestment) * 100).toFixed(2) 
        : '0.00';

      return {
        ...investment,
        total_investment: totalInvestment.toFixed(2),
        current_value: currentValue.toFixed(2),
        profit_loss: profitLoss.toFixed(2),
        profit_loss_percentage: profitLossPercentage
      };
    });

    // Calculate portfolio summary
    const totalInvested = dataWithMetrics?.reduce(
      (sum, inv) => sum + parseFloat(inv.total_investment), 
      0
    ) || 0;
    const totalCurrentValue = dataWithMetrics?.reduce(
      (sum, inv) => sum + parseFloat(inv.current_value), 
      0
    ) || 0;
    const totalProfitLoss = totalCurrentValue - totalInvested;
    const totalProfitLossPercentage = totalInvested > 0 
      ? ((totalProfitLoss / totalInvested) * 100).toFixed(2) 
      : '0.00';

    return NextResponse.json({
      success: true,
      data: dataWithMetrics,
      count: data?.length || 0,
      summary: {
        totalInvested: totalInvested.toFixed(2),
        totalCurrentValue: totalCurrentValue.toFixed(2),
        totalProfitLoss: totalProfitLoss.toFixed(2),
        totalProfitLossPercentage: totalProfitLossPercentage
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}