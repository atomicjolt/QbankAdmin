#!/usr/bin/env bash

# Meant to be run from root directory of project
# ./bin/bootstrap
DROPBOX_FOLDER=aj-dev/qbank-admin

# All config files for project
files=("_meta")

for file in "${files[@]}"
do
  if [ -e $file ]
  then
    rm $file
  fi
  ln -s "$HOME/Dropbox/$DROPBOX_FOLDER/$file" $file
done

# If brewfile exists then install packages with brew
# Brewfiles should be included in files array and symlinked in the above loop
if [ -e "config/Brewfile" ]
then
  brew tap homebrew/bundle # make sure bundle for brew is installed, better add to laptop setup script
  brew bundle --file=config/Brewfile
fi

echo "Remember to do an npm install"

# project specific code or symlinks
# cd config
# ln -s database.development.yml database.yml