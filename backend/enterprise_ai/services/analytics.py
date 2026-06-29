import os
import pandas as pd
from django.conf import settings

def load_dfs():
    base_dir = settings.BASE_DIR
    
    vendor_df = pd.read_csv(os.path.join(base_dir, "vendor_summary.csv"))
    api_df = pd.read_csv(os.path.join(base_dir, "api_inventory.csv"))
    news_df = pd.read_csv(os.path.join(base_dir, "master_news.csv"))
    apps_df = pd.read_csv(os.path.join(base_dir, "enterprise_applications.csv"))
    risk_df = pd.read_csv(os.path.join(base_dir, "enterprise_risk.csv"))
    
    return vendor_df, api_df, news_df, apps_df, risk_df

def analytics_engine(question):
    q = question.lower()
    try:
        vendor_df, api_df, news_df, apps_df, risk_df = load_dfs()
    except Exception as e:
        return f"Error loading CSV files for analytics: {str(e)}"
        
    # ---------- Vendors ----------
    if "top" in q and "vendor" in q:
        return vendor_df.sort_values(
            "risk_score",
            ascending=False
        ).head(10)
        
    if "cyber" in q and "vendor" in q:
        return vendor_df.sort_values(
            "Cybersecurity",
            ascending=False
        ).head(10)
        
    if "compliance" in q:
        return vendor_df.sort_values(
            "Compliance",
            ascending=False
        ).head(10)
        
    if "financial" in q:
        return vendor_df.sort_values(
            "Financial",
            ascending=False
        ).head(10)
        
    # ---------- APIs ----------
    if "api" in q and "top" in q:
        return api_df.sort_values(
            "risk_score",
            ascending=False
        ).head(10)
        
    if "zombie" in q:
        return api_df[
            api_df["status"] == "Zombie"
        ]
        
    if "shadow" in q:
        return api_df[
            api_df["status"] == "Shadow"
        ]
        
    if "enterprise cyber posture" in q or "cyber posture" in q:
        return vendor_df[
            ["vendor", "risk_score", "risk_level"]
        ].sort_values(
            "risk_score",
            ascending=False
        )
        
    return None

def executive_summary():
    try:
        vendor_df, api_df, _, _, _ = load_dfs()
    except Exception as e:
        return f"Error loading data for executive summary: {str(e)}"
        
    top_vendor = vendor_df.sort_values(
        "risk_score",
        ascending=False
    ).iloc[0]
    
    zombie = len(
        api_df[api_df["status"] == "Zombie"]
    )
    
    shadow = len(
        api_df[api_df["status"] == "Shadow"]
    )
    
    critical = len(
        vendor_df[vendor_df["risk_level"] == "Critical"]
    )
    
    return f"""
Enterprise Executive Summary

Total Vendors : {len(vendor_df)}
Critical Vendors : {critical}
Zombie APIs : {zombie}
Shadow APIs : {shadow}
Highest Risk Vendor : {top_vendor['vendor']}
Highest Risk Score : {top_vendor['risk_score']}
"""

def system_status(faiss_total=0, knowledge_base_len=0):
    try:
        vendor_df, api_df, news_df, apps_df, risk_df = load_dfs()
    except Exception as e:
        return {"error": f"Error loading CSV files: {str(e)}"}
        
    return {
        "Vendor Records": len(vendor_df),
        "News Articles": len(news_df),
        "APIs": len(api_df),
        "Applications": len(apps_df),
        "Enterprise Nodes": len(risk_df),
        "Knowledge Base": knowledge_base_len,
        "FAISS Documents": faiss_total
    }
