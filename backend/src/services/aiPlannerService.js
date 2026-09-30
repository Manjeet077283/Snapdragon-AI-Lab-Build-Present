/**
 * Structured AI Intent Planner & Grounded Interpreter
 */

export function parseQueryToIntent(question, columns = []) {
  const qLower = question.toLowerCase();

  // Find probable metric column
  let metric = 'Revenue';
  if (qLower.includes('sales') || qLower.includes('revenue') || qLower.includes('money') || qLower.includes('income')) {
    metric = columns.find(c => ['revenue', 'sales', 'amount'].includes(c.toLowerCase())) || 'Revenue';
  } else if (qLower.includes('quantity') || qLower.includes('volume') || qLower.includes('orders') || qLower.includes('count')) {
    metric = columns.find(c => ['quantity', 'qty', 'count', 'orders'].includes(c.toLowerCase())) || 'Quantity';
  } else if (qLower.includes('price') || qLower.includes('cost')) {
    metric = columns.find(c => ['unit_price', 'price', 'cost'].includes(c.toLowerCase())) || 'Unit_Price';
  }

  // Find probable group_by column
  let groupBy = 'Product';
  if (qLower.includes('product') || qLower.includes('item') || qLower.includes('goods')) {
    groupBy = columns.find(c => ['product', 'item', 'title'].includes(c.toLowerCase())) || 'Product';
  } else if (qLower.includes('region') || qLower.includes('city') || qLower.includes('area') || qLower.includes('location') || qLower.includes('state')) {
    groupBy = columns.find(c => ['region', 'city', 'state', 'location'].includes(c.toLowerCase())) || 'Region';
  } else if (qLower.includes('category') || qLower.includes('segment') || qLower.includes('type')) {
    groupBy = columns.find(c => ['category', 'type', 'customer_type'].includes(c.toLowerCase())) || 'Category';
  } else if (qLower.includes('month') || qLower.includes('trend') || qLower.includes('date') || qLower.includes('over time')) {
    groupBy = columns.find(c => ['order_date', 'date', 'month'].includes(c.toLowerCase())) || 'Order_Date';
  }

  // Determine intent & sort order
  let intentName = 'general_aggregation';
  let sort = 'descending';
  let limit = 5;
  let aggregation = 'sum';

  if (qLower.includes('poor') || qLower.includes('worst') || qLower.includes('lowest') || qLower.includes('decline') || qLower.includes('bottom')) {
    intentName = 'product_performance';
    sort = 'ascending';
    limit = 5;
  } else if (qLower.includes('top') || qLower.includes('best') || qLower.includes('highest') || qLower.includes('most')) {
    intentName = 'top_ranking';
    sort = 'descending';

    // Extract limit number if present (e.g. "top 5", "top 10")
    const match = qLower.match(/top\s+(\d+)/);
    if (match) limit = parseInt(match[1], 10);
  } else if (qLower.includes('average') || qLower.includes('mean')) {
    aggregation = 'mean';
  } else if (qLower.includes('count') || qLower.includes('how many')) {
    aggregation = 'count';
  }

  return {
    question,
    intent: intentName,
    group_by: groupBy,
    metric: metric,
    aggregation: aggregation,
    sort: sort,
    limit: limit,
    visualization: (groupBy === 'Order_Date' || qLower.includes('trend')) ? 'line' : (limit <= 8 ? 'bar' : 'table')
  };
}

export function generateAIInterpretation(question, intentSpec, calcResult, dataProfile) {
  const intentName = intentSpec.intent;
  const metric = intentSpec.metric;
  const groupBy = intentSpec.group_by;
  const results = calcResult.results || [];
  const calcMeta = calcResult.calculation_details || {};

  let summaryText = "";
  let keyFindings = [];
  let recommendations = [];

  if (results.length > 0) {
    const topItem = results[0];
    const topValFormatted = topItem.value >= 1000 ? `₹${topItem.value.toLocaleString()}` : `${topItem.value}`;

    if (intentSpec.sort === 'ascending') {
      summaryText = `Based on deterministic analysis of ${calcMeta.source_rows_processed || 'all'} records, <b>${topItem.group}</b> registered the lowest metric value (${topValFormatted}).`;
      keyFindings.push(`Lowest performing item in '${groupBy}': <b>${topItem.group}</b> with ${topValFormatted}.`);
      if (results.length > 1) {
        const secondItem = results[1];
        keyFindings.push(`Followed closely by <b>${secondItem.group}</b> (${secondItem.value >= 1000 ? '₹' + secondItem.value.toLocaleString() : secondItem.value}).`);
      }
      recommendations.push(`Review pricing, inventory, and promotional strategy for ${topItem.group}.`);
      recommendations.push(`Investigate underlying customer feedback or regional supply chain bottlenecks for underperforming segments.`);
    } else {
      summaryText = `Deterministic aggregation across ${calcMeta.source_rows_processed || 'all'} records reveals that <b>${topItem.group}</b> is the leading performer with ${topValFormatted}.`;
      keyFindings.push(`Top item in '${groupBy}': <b>${topItem.group}</b> generating ${topValFormatted}.`);
      
      let totalSum = results.reduce((acc, r) => acc + r.value, 0);
      if (totalSum > 0) {
        const topShare = ((topItem.value / totalSum) * 100).toFixed(1);
        keyFindings.push(`<b>${topItem.group}</b> accounts for <b>${topShare}%</b> of the top ${results.length} grouped contributions.`);
      }
      recommendations.push(`Capitalize on high demand for ${topItem.group} by expanding marketing campaign reach.`);
      recommendations.push(`Maintain optimal stock and distribution for top-ranking items.`);
    }
  } else {
    summaryText = `No records matched the filter criteria for this query.`;
    keyFindings.push(`Processed ${calcMeta.source_rows_processed || 0} rows without active grouped results.`);
  }

  return {
    summary: summaryText,
    key_findings: keyFindings,
    recommendations: recommendations,
    explainability: {
      question: question,
      detected_intent: intentSpec.intent,
      group_by: intentSpec.group_by,
      metric: intentSpec.metric,
      formula: calcMeta.formula || `${intentSpec.aggregation.toUpperCase()}(${intentSpec.metric}) GROUP BY ${intentSpec.group_by}`,
      filter_applied: calcMeta.filter_applied || "None",
      source_rows_processed: calcMeta.source_rows_processed || 0,
      verified_result_summary: results.slice(0, 3)
    }
  };
}
