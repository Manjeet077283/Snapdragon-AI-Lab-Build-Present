import pandas as pd
import numpy as np

def compute_kpis_and_charts(df):
    """
    Computes standard KPIs and chart structures for the dashboard.
    """
    kpis = {
        "total_revenue": 0.0,
        "average_order_value": 0.0,
        "total_orders": len(df),
        "growth_rate_pct": 0.0,
        "top_product": "N/A"
    }

    # Detect primary metric columns
    revenue_col = next((c for c in df.columns if any(k in c.lower() for k in ['revenue', 'sales', 'amount', 'total'])), None)
    product_col = next((c for c in df.columns if any(k in c.lower() for k in ['product', 'item', 'title'])), None)
    date_col = next((c for c in df.columns if any(k in c.lower() for k in ['date', 'time', 'day'])), None)
    category_col = next((c for c in df.columns if any(k in c.lower() for k in ['category', 'type', 'segment'])), None)
    region_col = next((c for c in df.columns if any(k in c.lower() for k in ['region', 'city', 'state', 'location'])), None)
    quantity_col = next((c for c in df.columns if any(k in c.lower() for k in ['qty', 'quantity', 'count'])), None)
    unit_price_col = next((c for c in df.columns if any(k in c.lower() for k in ['price', 'cost', 'unit'])), None)

    if revenue_col and pd.api.types.is_numeric_dtype(df[revenue_col]):
        total_rev = float(df[revenue_col].sum())
        avg_rev = float(df[revenue_col].mean()) if len(df) > 0 else 0.0
        kpis["total_revenue"] = round(total_rev, 2)
        kpis["average_order_value"] = round(avg_rev, 2)

    if product_col and revenue_col:
        top_prod_series = df.groupby(product_col)[revenue_col].sum().sort_values(ascending=False)
        if not top_prod_series.empty:
            kpis["top_product"] = str(top_prod_series.index[0])

    # Calculate month-over-month growth rate if date & revenue exist
    if date_col and revenue_col:
        try:
            df_date = df.copy()
            df_date['_dt'] = pd.to_datetime(df_date[date_col], errors='coerce')
            df_date = df_date.dropna(subset=['_dt'])
            df_date['_period'] = df_date['_dt'].dt.to_period('M')
            monthly = df_date.groupby('_period')[revenue_col].sum().sort_index()
            if len(monthly) >= 2:
                prev_val = monthly.iloc[-2]
                curr_val = monthly.iloc[-1]
                if prev_val > 0:
                    kpis["growth_rate_pct"] = round(((curr_val - prev_val) / prev_val) * 100, 2)
        except Exception:
            pass

    # 1. Monthly Line Chart Data
    line_chart_data = []
    if date_col and revenue_col:
        try:
            df_date = df.copy()
            df_date['_dt'] = pd.to_datetime(df_date[date_col], errors='coerce')
            df_date = df_date.dropna(subset=['_dt'])
            df_date['_period'] = df_date['_dt'].dt.strftime('%Y-%m')
            monthly_agg = df_date.groupby('_period')[revenue_col].agg(['sum', 'count']).reset_index()
            monthly_agg = monthly_agg.sort_values('_period')
            line_chart_data = [
                {"period": row['_period'], "revenue": round(float(row['sum']), 2), "orders": int(row['count'])}
                for _, row in monthly_agg.iterrows()
            ]
        except Exception:
            pass

    # 2. Top Products Bar Chart
    bar_chart_data = []
    if product_col and revenue_col:
        prod_agg = df.groupby(product_col)[revenue_col].sum().reset_index()
        prod_agg = prod_agg.sort_values(revenue_col, ascending=False).head(8)
        bar_chart_data = [
            {"product": str(row[product_col]), "revenue": round(float(row[revenue_col]), 2)}
            for _, row in prod_agg.iterrows()
        ]

    # 3. Category Distribution Donut Chart
    donut_chart_data = []
    if category_col and revenue_col:
        cat_agg = df.groupby(category_col)[revenue_col].sum().reset_index()
        cat_agg = cat_agg.sort_values(revenue_col, ascending=False)
        donut_chart_data = [
            {"category": str(row[category_col]), "value": round(float(row[revenue_col]), 2)}
            for _, row in cat_agg.iterrows()
        ]

    # 4. Regional Performance Bar Chart
    region_chart_data = []
    if region_col and revenue_col:
        reg_agg = df.groupby(region_col)[revenue_col].sum().reset_index()
        reg_agg = reg_agg.sort_values(revenue_col, ascending=False)
        region_chart_data = [
            {"region": str(row[region_col]), "revenue": round(float(row[revenue_col]), 2)}
            for _, row in reg_agg.iterrows()
        ]

    # 5. Scatter Plot (Quantity / Unit Price vs Revenue)
    scatter_chart_data = []
    x_col = quantity_col or unit_price_col
    if x_col and revenue_col:
        sample_df = df.dropna(subset=[x_col, revenue_col]).head(100)
        scatter_chart_data = [
            {
                "x": float(row[x_col]),
                "y": float(row[revenue_col]),
                "label": str(row[product_col]) if product_col else "Record"
            }
            for _, row in sample_df.iterrows()
        ]

    return {
        "kpis": kpis,
        "charts": {
            "monthly_trend": line_chart_data,
            "top_products": bar_chart_data,
            "category_distribution": donut_chart_data,
            "regional_performance": region_chart_data,
            "scatter_price_revenue": scatter_chart_data
        }
    }


def execute_analysis_intent(df, intent_spec):
    """
    Executes a structured AI intent specification deterministically against Pandas.
    intent_spec schema:
    {
        "intent": "product_performance" | "regional_breakdown" | "trend_analysis" | "top_ranking" | "general_aggregation",
        "group_by": "Product",
        "metric": "Revenue",
        "aggregation": "sum" | "mean" | "count" | "min" | "max",
        "sort": "descending" | "ascending",
        "limit": 5,
        "filter": {"column": "Region", "operator": "==", "value": "Delhi"}
    }
    """
    filtered_df = df.copy()
    filter_desc = "None"

    # Apply optional filter
    flt = intent_spec.get("filter")
    if flt and isinstance(flt, dict) and "column" in flt and flt["column"] in df.columns:
        col = flt["column"]
        val = flt.get("value")
        op = flt.get("operator", "==")
        if op == "==":
            filtered_df = filtered_df[filtered_df[col] == val]
        elif op == "!=":
            filtered_df = filtered_df[filtered_df[col] != val]
        filter_desc = f"{col} {op} '{val}'"

    group_by = intent_spec.get("group_by")
    metric = intent_spec.get("metric")
    aggregation = intent_spec.get("aggregation", "sum").lower()
    sort_order = intent_spec.get("sort", "descending").lower() == "descending"
    limit = intent_spec.get("limit", 10)

    # Resolve metric column if string matches partial name
    if metric and metric not in filtered_df.columns:
        matching = [c for c in filtered_df.columns if metric.lower() in c.lower()]
        if matching:
            metric = matching[0]

    # Resolve group_by column if string matches partial name
    if group_by and group_by not in filtered_df.columns:
        matching = [c for c in filtered_df.columns if group_by.lower() in c.lower()]
        if matching:
            group_by = matching[0]

    result_data = []
    formula_str = ""

    if group_by and metric and metric in filtered_df.columns and group_by in filtered_df.columns:
        agg_func = aggregation if aggregation in ['sum', 'mean', 'count', 'min', 'max'] else 'sum'
        grouped = filtered_df.groupby(group_by)[metric].agg(agg_func).reset_index()
        grouped = grouped.sort_values(by=metric, ascending=not sort_order)
        if limit:
            grouped = grouped.head(limit)

        for _, row in grouped.iterrows():
            val = float(row[metric])
            result_data.append({
                "group": str(row[group_by]),
                "value": round(val, 2)
            })

        formula_str = f"{aggregation.upper()}({metric}) GROUP BY {group_by} ORDER BY {metric} {'DESC' if sort_order else 'ASC'} LIMIT {limit}"

    elif metric and metric in filtered_df.columns:
        agg_func = aggregation if aggregation in ['sum', 'mean', 'count', 'min', 'max'] else 'sum'
        val = float(getattr(filtered_df[metric], agg_func)())
        result_data = [{"group": "Total", "value": round(val, 2)}]
        formula_str = f"{aggregation.upper()}({metric})"

    else:
        # Fallback summary
        row_cnt = len(filtered_df)
        result_data = [{"group": "Row Count", "value": row_cnt}]
        formula_str = "COUNT(rows)"

    return {
        "intent_spec": intent_spec,
        "calculation_details": {
            "formula": formula_str,
            "group_by": group_by,
            "metric": metric,
            "aggregation": aggregation,
            "filter_applied": filter_desc,
            "source_rows_processed": len(filtered_df)
        },
        "results": result_data
    }
