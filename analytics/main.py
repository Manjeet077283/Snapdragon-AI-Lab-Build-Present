import sys
import os
import json
import argparse
import pandas as pd

# Add current directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from profiling import profile_dataset
from cleaning import clean_dataset
from analysis import compute_kpis_and_charts, execute_analysis_intent
from anomaly import detect_anomalies_iqr
from report import generate_pdf_report, generate_excel_report
from sample_generator import generate_sample_data

def load_data(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.csv':
        return pd.read_csv(file_path)
    elif ext in ['.xlsx', '.xls']:
        return pd.read_excel(file_path)
    elif ext == '.pdf':
        try:
            import pypdf
            reader = pypdf.PdfReader(file_path)
            text_lines = []
            for page in reader.pages:
                text_lines.extend(page.extract_text().splitlines())
            # Parse text lines into simple DataFrame
            rows = [{"Line_No": i+1, "Text": line.strip()} for i, line in enumerate(text_lines) if line.strip()]
            return pd.DataFrame(rows)
        except Exception as e:
            raise ValueError(f"Could not parse PDF table: {str(e)}")
    else:
        raise ValueError(f"Unsupported file format: {ext}")

def main():
    parser = argparse.ArgumentParser(description="SnapInsight Python Analytics Engine")
    parser.add_argument("--action", required=True, choices=["profile", "clean", "analyze", "anomaly", "report", "sample", "test"])
    parser.add_argument("--file", help="Path to input data file")
    parser.add_argument("--output", help="Path to output cleaned file or report")
    parser.add_argument("--intent", help="JSON string of analysis intent specification")
    parser.add_argument("--target-column", help="Target column for anomaly detection")

    args = parser.parse_args()

    try:
        if args.action == "sample":
            filepath = args.output or "data/sample/sales_data.csv"
            res_path = generate_sample_data(filepath)
            print(json.dumps({"status": "success", "file": res_path}))
            return

        if args.action == "test":
            sample_path = "data/sample/sales_data.csv"
            if not os.path.exists(sample_path):
                generate_sample_data(sample_path)
            df = load_data(sample_path)
            prof = profile_dataset(df)
            df_c, log = clean_dataset(df)
            kpis_charts = compute_kpis_and_charts(df_c)
            anom = detect_anomalies_iqr(df_c)
            pdf_p = generate_pdf_report(df_c, prof, kpis_charts, anom, {"device": "Snapdragon PC Test"})
            xls_p = generate_excel_report(df_c, prof, kpis_charts, anom, {"device": "Snapdragon PC Test"})
            print(json.dumps({
                "status": "success",
                "test": "passed",
                "pdf": pdf_p,
                "excel": xls_p,
                "rows": len(df_c),
                "quality_score": prof["quality_score"]
            }))
            return

        if not args.file:
            print(json.dumps({"error": "--file argument is required for action " + args.action}))
            sys.exit(1)

        df = load_data(args.file)

        if args.action == "profile":
            result = profile_dataset(df)
            print(json.dumps({"status": "success", "data": result}))

        elif args.action == "clean":
            cleaned_df, cleaning_log = clean_dataset(df)
            output_file = args.output or args.file.replace(".csv", "_cleaned.csv")
            os.makedirs(os.path.dirname(output_file) if os.path.dirname(output_file) else ".", exist_ok=True)
            cleaned_df.to_csv(output_file, index=False)
            prof = profile_dataset(cleaned_df)
            print(json.dumps({
                "status": "success",
                "cleaned_file": output_file,
                "cleaning_log": cleaning_log,
                "profile": prof
            }))

        elif args.action == "analyze":
            df_c, _ = clean_dataset(df)
            summary_res = compute_kpis_and_charts(df_c)

            intent_result = None
            if args.intent:
                try:
                    intent_spec = json.loads(args.intent)
                    intent_result = execute_analysis_intent(df_c, intent_spec)
                except Exception as ex:
                    intent_result = {"error": f"Failed to execute intent: {str(ex)}"}

            print(json.dumps({
                "status": "success",
                "summary": summary_res,
                "intent_result": intent_result
            }))

        elif args.action == "anomaly":
            df_c, _ = clean_dataset(df)
            anom_res = detect_anomalies_iqr(df_c, target_column=args.target_column)
            print(json.dumps({"status": "success", "data": anom_res}))

        elif args.action == "report":
            df_c, _ = clean_dataset(df)
            prof = profile_dataset(df_c)
            summary_res = compute_kpis_and_charts(df_c)
            anom_res = detect_anomalies_iqr(df_c)

            dev_info = {
                "device": "Snapdragon-powered HP PC",
                "processor": "Qualcomm Snapdragon X Elite / Host CPU",
                "execution": "Snapdragon-Optimized / NPU-Ready (CPU Fallback)"
            }

            pdf_path = generate_pdf_report(df_c, prof, summary_res, anom_res, dev_info, "data/reports/SnapInsight_Report.pdf")
            excel_path = generate_excel_report(df_c, prof, summary_res, anom_res, dev_info, "data/reports/SnapInsight_Report.xlsx")

            print(json.dumps({
                "status": "success",
                "pdf_path": pdf_path,
                "excel_path": excel_path
            }))

    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
