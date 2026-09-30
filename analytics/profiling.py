import pandas as pd
import numpy as np

def profile_dataset(df):
    """
    Computes statistical profiling and data quality assessment for a DataFrame.
    """
    total_rows = len(df)
    total_cols = len(df.columns)

    missing_by_col = df.isnull().sum().to_dict()
    total_missing = int(df.isnull().sum().sum())
    duplicate_rows = int(df.duplicated().sum())

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

    # Detect potential date columns
    date_cols = []
    for col in categorical_cols:
        if 'date' in col.lower() or 'time' in col.lower() or 'day' in col.lower():
            try:
                pd.to_datetime(df[col].dropna().head(20))
                date_cols.append(col)
            except Exception:
                pass

    # Column detailed statistics
    column_stats = {}
    for col in df.columns:
        null_cnt = int(df[col].isnull().sum())
        null_pct = round((null_cnt / total_rows) * 100, 2) if total_rows > 0 else 0
        unique_cnt = int(df[col].nunique())

        stat_entry = {
            "name": col,
            "type": str(df[col].dtype),
            "null_count": null_cnt,
            "null_percentage": null_pct,
            "unique_count": unique_cnt
        }

        if col in numeric_cols:
            non_null = df[col].dropna()
            if len(non_null) > 0:
                stat_entry.update({
                    "min": float(non_null.min()),
                    "max": float(non_null.max()),
                    "mean": float(round(non_null.mean(), 2)),
                    "median": float(round(non_null.median(), 2)),
                    "std": float(round(non_null.std(), 2)) if len(non_null) > 1 else 0.0
                })

        column_stats[col] = stat_entry

    # Calculate Data Quality Score (0 to 100)
    # Deduct points for missing values ratio, duplicate ratio, etc.
    missing_ratio = total_missing / (total_rows * total_cols) if (total_rows * total_cols) > 0 else 0
    duplicate_ratio = duplicate_rows / total_rows if total_rows > 0 else 0
    quality_score = max(0, min(100, int(100 - (missing_ratio * 200) - (duplicate_ratio * 300))))

    return {
        "total_rows": total_rows,
        "total_cols": total_cols,
        "missing_values_count": total_missing,
        "duplicate_rows_count": duplicate_rows,
        "quality_score": quality_score,
        "numeric_columns": numeric_cols,
        "categorical_columns": [c for c in categorical_cols if c not in date_cols],
        "date_columns": date_cols,
        "column_stats": column_stats
    }
