import os
import sys
import requests

token = os.getenv("GITHUB_TOKEN")
repo = os.getenv("GITHUB_REPOSITORY")

if not token or not repo:
	print("Error: Missing GITHUB_TOKEN or GITHUB_REPOSITORY environment variables")
	sys.exit(1)

headers = {
	"Authorization": f"token {token}",
	"Accept": "application/vnd.github+json"
}

url = f"https://api.github.com/repos/{repo}/dependabot/alerts"
page = 1
found = False

print("Dependabot Alerts Report:")
print(f"{'Dependency':<20} | {'Severity':<8} | {'Vulnerable':<15} | {'Patched':<10} | {'State':<8}\n")

while True:
	try:
		response = requests.get(url, headers=headers, params={"page": page, "per_page": 100})
    except requests.exceptions.RequestException as e:
		print("Network error occurred:", e)
		break

	if response.status_code != 200:
		print("Error:", response.status_code, response.json())
		break

	data = response.json()
	if not data:
		break

	for alert in data:
		found = True
		dep = alert["dependency"]["package"]["name"]
		severity = alert["security_advisory"]["severity"]
		vulnerable = alert["security_vulnerability"]["vulnerable_version_range"]
		patched = alert["security_vulnerability"]["first_patched_version"]["identifier"] if alert["security_vulnerability"]["first_patched_version"] else "None"
		state = alert["state"]
		print(f"{dep:<20} | {severity:<8} | {vulnerable:<15} | {patched:<10} | {state:<8}")

	page += 1

if not found:
	print("No open Dependabot alerts found.")
