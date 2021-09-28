#!/bin/bash

# A tmin.sh script that works on OhMyZsh.

# USAGE:   tmin.sh
#          Changes the tmin of specified
#          Depends on the bmndrrc file for $auth_token and $username
#          I use this to set different horizons for goals with different frequencies
#
# A modified version of tmin.sh authored by Philip Hellyer
# https://github.com/pjjh/bmndr/blob/4190f785811947f42bac393f0ada0d7d671eea8c/tmin.sh
# LICENSE: Creative Commons BY-NC-SA
#          http://creativecommons.org/licenses/by-nc-sa/4.0/
#          Copyright 2017 Philip Hellyer

. ~/.bmndrrc 2> /dev/null

# Goal lists
echo 'Fetching goals'
ALL_GOALS="$( curl -# -X GET -d auth_token=$auth_token  https://www.beeminder.com/api/v1/users/$username.json | sed -e 's/[^[]*//; s/^.//; s/].*//; s/[",]/ /g' )"
echo $ALL_GOALS

# Date deltas
FORTNIGHT=$(date -v-2w +%Y-%m-%d)
MONTH=$(    date -v-1m +%Y-%m-%d)
QUARTER=$(  date -v-3m +%Y-%m-%d)
YEAR=$(     date -v-1y +%Y-%m-%d)
NEXTYEAR=$( date -v+1y +%Y-%m-%d)
DEFAULT="$FORTNIGHT"

echo $ALL_GOALS
echo $DEFAULT

for GOAL in $( echo $ALL_GOALS )
do
  case $GOAL in
    # Skip and ignore these goals, particularly the new ones  
    w)
      continue
      ;;

    # Frequent goals
    contact|thingszero|trium|zapback)
      TMIN="$FORTNIGHT"
      ;;

    # Daily goals
    cycles|flex|pitch|spanish|trium|units)
      TMIN="$MONTH"
      ;;

    # Monthly goals
    chicken|emailzero|gmailzero|groundhog|lola|mum|profdev|rqzero)
      TMIN="$YEAR"
      ;;

    # Note from Ozan: This may not work, haven't used.
    # Special: one year each way
    exprd)
      curl -# -X PUT -d "{\"tmax\":\"$NEXTYEAR\", \"tmin\":\"$YEAR\"}" https://www.beeminder.com/api/v1/users/$username/goals/$GOAL.json?auth_token=$auth_token --header "Content-Type: application/json" > /dev/null
      continue
      ;;

    # All others
    *)
      TMIN="$DEFAULT"
      ;;
  esac

  echo $GOAL
  curl -v -X PUT -d tmin=$TMIN -d auth_token=$auth_token https://www.beeminder.com/api/v1/users/$username/goals/$GOAL.json 

done

