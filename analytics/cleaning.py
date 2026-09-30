import pandas as pd
import numpy as np

def clean_dataset(df, fill_numeric_strategy="mean", remove_duplicates=True):
    """
    Cleans a dataset without mutating the original dataframe.
    Returns (cleaned_df, cleaning_log).
    """
    cleaned_df = df.copy()
    cleaning_log = []

    initial_rows = len(cleaned_df)

    # 1. Trim string column whitespace and normalize empty strings
    str_cols = cleaned_df.select_dtypes(include=['object']).columns
    trimmed_count = 0
    for col in str_cols:
        before_series = cleaned_df[col].copy()
        cleaned_df[col] = cleaned_df[col].apply(lambda s: s.strip() if isinstance(s, str) else s)
        # Check if changed
        diff = (before_series != cleaned_df[col]).sum()
        if diff > 0:
            trimmed_count += diff
            
    if trimmed_count > 0:
        cleaning_log.append(f"Trimmed leading/trailing whitespace across string fields ({trimmed_count} values updated).")

    # 2. Normalize column names (strip spaces, optional capitalization consistency)
    orig_cols = list(cleaned_df.columns)
    cleaned_df.columns = [c.strip() for c in cleaned_df.columns]
    if orig_cols != list(cleaned_df.columns):
        cleaning_log.append("Normalized column names by stripping excess whitespace.")

    # 3. Handle duplicates
    dup_count = int(cleaned_df.duplicated().sum())
    if dup_count > 0 and remove_duplicates:
        cleaned_df = cleaned_df.drop_duplicates().reset_index(drop=True)
        cleaning_log.append(f"Removed {dup_count} duplicate rows (Dataset size reduced from {initial_rows} to {len(cleaned_df)}).")
    elif dup_count > 0:
        cleaning_log.append(f"Identified {dup_count} duplicate rows (Preserved as per configuration).")

    # 4. Standardize Date columns
    for col in cleaned_df.columns:
        if 'date' in col.lower() or 'time' in col.lower() or 'day' in col.lower():
            try:
                converted = pd.to_datetime(cleaned_df[col], errors='coerce')
                # If conversion is mostly successful
                if converted.notnull().sum() > 0.5 * len(cleaned_df):
                    cleaned_df[col] = converted.dt.strftime('%Y-%m-%d')
                    cleaning_log.append(f"Standardized date column '{col}' into ISO YYYY-MM-DD format.")
            except Exception:
                pass

    # 5. Missing value treatment
    missing_before = int(cleaned_df.isnull().sum().sum())
    if missing_before > 0:
        # Numeric missing values
        num_cols = cleaned_df.select_dtypes(include=[np.number]).columns
        for col in num_cols:
            n_missing = cleaned_df[col].isnull().sum()
            if n_missing > 0:
                if fill_numeric_strategy == "mean":
                    fill_val = round(cleaned_df[col].mean(), 2)
                    cleaned_df[col] = cleaned_df[col].fillna(fill_val)
                    cleaning_log.append(f"Imputed {n_missing} missing values in numeric column '{col}' using mean ({fill_val}).")
                elif fill_numeric_strategy == "median":
                    fill_val = round(cleaned_df[col].median(), 2)
                    cleaned_df[col] = cleaned_df[col].fillna(fill_val)
                    cleaning_log.append(f"Imputed {n_missing} missing values in numeric column '{col}' using median ({fill_val}).")
                elif fill_numeric_strategy == "zero":
                    cleaned_df[col] = cleaned_df[col].fillna(0)
                    cleaning_log.append(f"Imputed {n_missing} missing values in numeric column '{col}' with 0.")

        # Categorical missing values
        cat_cols = cleaned_df.select_dtypes(include=['object']).columns
        for col in cat_cols:
            n_missing = cleaned_df[col].isnull().sum()
            if n_missing > 0:
                cleaned_df[col] = cleaned_df[col].fillna("Unknown")
                cleaning_log.append(f"Imputed {n_missing} missing values in categorical column '{col}' with 'Unknown'.")

    if not cleaning_log:
        cleaning_log.append("Dataset verified. No data cleaning actions were required.")

    return cleaned_df, cleaning_log
