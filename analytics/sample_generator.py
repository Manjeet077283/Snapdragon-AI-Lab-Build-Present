import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_data(filepath="data/sample/sales_data.csv", num_records=2500):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    random.seed(42)
    np.random.seed(42)

    products_by_category = {
        "Electronics": [
            ("Snapdragon Laptop X1", 1200),
            ("Qualcomm AI DevKit", 450),
            ("UltraVision Monitor 27", 350),
            ("Wireless Ergonomic Mouse", 45),
            ("Mechanical Keyboard Pro", 95)
        ],
        "Software & Cloud": [
            ("SnapInsight Pro Enterprise", 800),
            ("Cloud Analytics Suite", 500),
            ("Security Shield v4", 250),
            ("Data Sync Plugin", 120)
        ],
        "Accessories": [
            ("Thunderbolt 4 Dock", 180),
            ("USB-C Fast Charger 100W", 55),
            ("Noise-Canceling Headset", 150),
            ("Laptop Stand Aluminum", 40)
        ],
        "Services": [
            ("AI Implementation Consulting", 1500),
            ("Data Pipeline Setup", 950),
            ("Annual Support Package", 600)
        ]
    }

    regions = ["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune", "Chennai"]
    customer_types = ["Enterprise", "SMB", "Government", "Individual"]

    start_date = datetime(2025, 1, 1)
    records = []

    for i in range(1, num_records + 1):
        order_id = f"ORD-{10000 + i}"
        days_offset = random.randint(0, 360)
        order_date = (start_date + timedelta(days=days_offset)).strftime("%Y-%m-%d")
        
        category = random.choice(list(products_by_category.keys()))
        product, base_price = random.choice(products_by_category[category])
        
        quantity = random.choices([1, 2, 3, 4, 5, 8, 10, 15], weights=[40, 25, 15, 8, 6, 3, 2, 1])[0]
        region = random.choice(regions)
        customer_type = random.choice(customer_types)
        
        # Unit price variation (+/- 10%)
        unit_price = round(base_price * (1 + random.uniform(-0.08, 0.08)), 2)
        revenue = round(quantity * unit_price, 2)
        
        records.append({
            "Order_ID": order_id,
            "Order_Date": order_date,
            "Product": product,
            "Category": category,
            "Region": region,
            "Quantity": quantity,
            "Unit_Price": unit_price,
            "Revenue": revenue,
            "Customer_Type": customer_type
        })

    df = pd.DataFrame(records)

    # Inject slight intentional anomalies & missing data to test cleaning and validation
    # 1. Add some duplicate rows
    duplicates = df.sample(n=12, random_state=42).copy()
    df = pd.concat([df, duplicates], ignore_index=True)

    # 2. Add some missing values
    df.loc[df.sample(n=15, random_state=10).index, "Customer_Type"] = None
    df.loc[df.sample(n=8, random_state=20).index, "Unit_Price"] = None

    # 3. Add outliers (extreme revenue values for anomaly testing)
    outlier_indices = df.sample(n=6, random_state=99).index
    df.loc[outlier_indices, "Revenue"] = df.loc[outlier_indices, "Revenue"] * random.uniform(12, 20)

    # 4. Inconsistent whitespace string entries
    df.loc[df.sample(n=10, random_state=5).index, "Region"] = "  Mumbai  "

    df.to_csv(filepath, index=False)
    print(f"Sample dataset successfully generated at '{filepath}' with {len(df)} rows.")
    return filepath

if __name__ == "__main__":
    generate_sample_data()
