import pandas as pd

# Define file paths (update this if needed)
skills_file = "../skills.txt"
occupation_file = "../occupation_data.txt"

# Load the Skills file
skills_df = pd.read_csv(skills_file, delimiter="\t", encoding="latin1")

# Load the Occupation Data file
occupation_df = pd.read_csv(occupation_file, delimiter="\t", encoding="latin1")

# Filter out only skills with "IM" (Importance) scale
skills_df = skills_df[skills_df["Scale ID"] == "IM"]

# Select relevant columns
skills_df = skills_df[["O*NET-SOC Code", "Element Name", "Data Value"]]
skills_df.rename(columns={"Element Name": "Skill", "Data Value": "Importance"}, inplace=True)

# Merge with job titles from Occupation Data
merged_df = skills_df.merge(occupation_df[["O*NET-SOC Code", "Title"]], on="O*NET-SOC Code")

# Sort by importance (higher values mean more relevant)
merged_df = merged_df.sort_values(by="Importance", ascending=False)

# Save processed data
output_file = "../processed_skills.csv"
merged_df.to_csv(output_file, index=False)

print(f"Processed skills data saved as {output_file}")