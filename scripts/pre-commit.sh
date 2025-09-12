function retrieveRoot() {
  local current=$(pwd)
  local parent=$current
  while [ -n "$parent" ] && [ "$parent" != '/' ]  && [ ! -f "$parent/angular.json" ]
  do
    parent=$(dirname $current)
  done
  if [ -z "$parent"] || [ "$parent" == '/' ]
  then
    exit 10
  fi
  echo $parent;
}

function removeInternalDependencies() {
    local WORKSPACE=$(retrieveRoot)
    node $WORKSPACE/scripts/pre-commit.js --hook
}

removeInternalDependencies
