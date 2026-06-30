import json
from urllib.error import URLError
from urllib.request import urlopen

def update_requirements(input_file="requirements.txt", output_file="docs/requirements-updated.txt"):
    with open(input_file, "r") as f:
        lines = f.readlines()

    updated_lines = []
    for line in lines:
        line = line.strip()
        if not line or line.startswith("#") or line.startswith("-"):
            updated_lines.append(line)
            continue

        # Split package and version
        if "==" in line:
            pkg, _ = line.split("==", 1)
        else:
            pkg = line

        # Query PyPI for latest version
        try:
            with urlopen(f"https://pypi.org/pypi/{pkg}/json", timeout=10) as response:
                latest_version = json.load(response)["info"]["version"]
            updated_lines.append(f"{pkg}=={latest_version}")
        except (KeyError, URLError, TimeoutError, json.JSONDecodeError):
            updated_lines.append(line)  # fallback

    # Save updated file
    with open(output_file, "w") as f:
        f.write("\n".join(updated_lines))

    print(f"Updated requirements saved to {output_file}")

if __name__ == "__main__":
    update_requirements()
