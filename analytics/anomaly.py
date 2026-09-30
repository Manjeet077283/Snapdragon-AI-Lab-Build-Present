import pandas as pd
import numpy as np

def detect_anomalies_iqr(df, target_column=None, iqr_multiplier=1.5):
    """
    Detects statistical outliers using the Interquartile Range (IQR) method.
    Formula:
        IQR = Q3 - Q1
        Lower Bound = Q1 - multiplier * IQR
        Upper Bound = Q3 + multiplier * IQR
    """
    # Auto-detect target numeric column if not specified
    if not target_column or target_column not in df.columns:
        num_cols = df.select_dtypes(include=[np.number]).columns
        target_column = next((c for c in num_cols if any(k in c.lower() for k in ['revenue', 'sales', 'amount', 'price', 'quantity'])), None)
        if not target_column and len(num_cols) > 0:
            target_column = num_cols[0]

    if not target_column or target_column not in df.columns or not pd.api.types.is_numeric_dtype(df[target_column]):
        return {
            "error": "No suitable numeric column available for anomaly detection.",
            "total_records": len(df),
            "anomalies_count": 0,
            "anomalies": []
        }

    series = df[target_column].dropna()
    if len(series) == 0:
        return {
            "target_column": target_column,
            "total_records": len(df),
            "anomalies_count": 0,
            "anomalies": []
        }

    q1 = float(series.quantile(0.25))
    q3 = float(series.quantile(0.75))
    iqr = q3 - q1

    lower_bound = float(q1 - (iqr_multiplier * iqr))
    upper_bound = float(q3 + (iqr_multiplier * iqr))

    anomalies_mask = (df[target_column] < lower_bound) | (df[target_column] > upper_bound)
    anomalies_df = df[anomalies_mask].copy()

    anomalies_records = []
    for idx, row in anomalies_df.head(50).iterrows():
        val = float(row[target_column])
        anomaly_type = "High Outlier" if val > upper_bound else "Low Outlier"
        
        # Build clean dict representation
        record_dict = {
            "row_index": int(idx),
            "target_column": target_column,
            "value": val,
            "anomaly_type": anomaly_type,
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "row_data": {k: (str(v) if pd.notnull(v) else None) for k, v in row.to_dict().items()}
        }
        anomalies_records.append(record_dict)

    return {
        "target_column": target_column,
        "iqr_multiplier": iqr_multiplier,
        "q1": round(q1, 2),
        "q3": round(q3, 2),
        "iqr": round(iqr, 2),
        "lower_bound": round(lower_bound, 2),
        "upper_bound": round(upper_bound, 2),
        "total_records": len(df),
        "anomalies_count": int(anomalies_mask.sum()),
        "anomalies_percentage": round(float(anomalies_mask.sum() / len(df)) * 100, 2) if len(df) > 0 else 0,
        "anomalies": anomalies_records
    }
