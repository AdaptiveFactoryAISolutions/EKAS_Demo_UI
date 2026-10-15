from pathlib import Path
import subprocess
r=Path(__file__).resolve().parent
for name in ['run-final-source-supervised.py','run-final-serial-pipeline.py']:
 result=subprocess.run(['python3',str(r/name)],cwd=r)
 if result.returncode:raise SystemExit(result.returncode)
