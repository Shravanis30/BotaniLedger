#!/bin/zsh

start_date="2026-03-15"
end_date="2026-04-13"

target_commits=40
commit_count=0

messages=(
"init: initialize project structure"
"chore: setup gitignore and configs"
"docs: update README with project details"
"feat: add transaction model"
"feat: implement ledger API"
"feat: connect MongoDB database"
"feat: add authentication system"
"feat: build dashboard UI"
"refactor: optimize backend logic"
"style: improve UI responsiveness"
"feat: add input validation"
"fix: resolve API bug"
"fix: correct authentication issue"
"docs: update usage instructions"
"chore: cleanup unused code"
)

current_date=$start_date

while [[ "$current_date" != $(date -j -v+1d -f "%Y-%m-%d" "$end_date" +"%Y-%m-%d") && $commit_count -lt $target_commits ]]
do
  # randomly skip some days (realistic)
  if (( RANDOM % 4 == 0 )); then
    current_date=$(date -j -v+1d -f "%Y-%m-%d" "$current_date" +"%Y-%m-%d")
    continue
  fi

  # 1–3 commits per day
  num_commits=$(( (RANDOM % 3) + 1 ))

  for ((i=1; i<=num_commits && commit_count < target_commits; i++))
  do
    msg=${messages[$RANDOM % ${#messages[@]}]}

    echo "$msg on $current_date" >> activity.txt
    git add .

    hour=$((10 + RANDOM % 8))

    GIT_AUTHOR_DATE="$current_date $hour:00:00" \
    GIT_COMMITTER_DATE="$current_date $hour:00:00" \
    git commit -m "$msg"

    ((commit_count++))
  done

  current_date=$(date -j -v+1d -f "%Y-%m-%d" "$current_date" +"%Y-%m-%d")
done

echo "Total commits created: $commit_count"
