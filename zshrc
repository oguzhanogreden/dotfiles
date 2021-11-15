# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

# Path to your oh-my-zsh installation.
export ZSH="/Users/oguzhanogreden/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="robbyrussell"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to automatically update without prompting.
# DISABLE_UPDATE_PROMPT="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS=true

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git virtualenv)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"

## >>> conda initialize >>>
## !! Contents within this block are managed by 'conda init' !!
#__conda_setup="$('/Users/oguzhanogreden/anaconda3/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
#if [ $? -eq 0 ]; then
#    eval "$__conda_setup"
#else
#    if [ -f "/Users/oguzhanogreden/anaconda3/etc/profile.d/conda.sh" ]; then
#        . "/Users/oguzhanogreden/anaconda3/etc/profile.d/conda.sh"
#    else
#        export PATH="/Users/oguzhanogreden/anaconda3/bin:$PATH"
#    fi
#fi
#unset __conda_setup
## <<< conda initialize <<<

# Environment variables
source ~/.sh_variables

# Make git and other software use vim
# https://stackoverflow.com/a/2596835
export VISUAL=vim
export EDITOR="$VISUAL"

# Dotnet stuff
# Add .NET Core SDK tools
export PATH="$PATH:/Users/oguzhanogreden/.dotnet/tools"

# The next line updates PATH for the Google Cloud SDK.
if [ -f '/Users/oguzhanogreden/Downloads/google-cloud-sdk/path.zsh.inc' ]; then . '/Users/oguzhanogreden/Downloads/google-cloud-sdk/path.zsh.inc'; fi

# The next line enables shell command completion for gcloud.
if [ -f '/Users/oguzhanogreden/Downloads/google-cloud-sdk/completion.zsh.inc' ]; then . '/Users/oguzhanogreden/Downloads/google-cloud-sdk/completion.zsh.inc'; fi

# Add Homebrew'd Python
# export PATH="/usr/local/opt/python@3.8/bin:$PATH"
export PATH="$PATH:/Users/oguzhanogreden/Library/Python/3.8/bin"

# Upon installing ruby-build, Homebrew said:
## ==> ruby-build
## ruby-build installs a non-Homebrew OpenSSL for each Ruby version installed and these are never upgraded.

## To link Rubies to Homebrew's OpenSSL 1.1 (which is upgraded) add the following
## to your ~/.zshrc:
export RUBY_CONFIGURE_OPTS="--with-openssl-dir=$(brew --prefix openssl@1.1)"

## rbenv init said:
# Load rbenv automatically by appending
# the following to ~/.zshrc:
eval "$(rbenv init -)"

## gem install said:
## WARNING:  You don't have /Users/oguzhanogreden/.gem/ruby/2.7.0/bin in your PATH,
## gem executables will not run.
PATH="$HOME/.gem/ruby/2.7.0/bin:$PATH"
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

## Aliases
alias gbsd="git branch --all --sort=-committerdate"
chmod +x ~/.dotscripts/create-notebook-post.py
alias jp="python3 ~/.dotscripts/create-notebook-post.py"

## Blogging
alias jpp="bundle exec jekyll build && cd ../ogreden.com && git add . && git commit -m 'update' && git push && cd ../oguzhanogreden.com_source"

### Dotnet stuf
alias drp="dotnet run --project"

source ~/.zshrc.parkbee
source ~/.zshrc.taskwarrior
export PATH="/usr/local/opt/helm@2/bin:$PATH"

## Terraform autocomplete
# https://learn.hashicorp.com/tutorials/terraform/install-cli#enable-tab-completion
autoload -U +X bashcompinit && bashcompinit
complete -o nospace -C /usr/local/bin/terraform terraform
export TF_LOG=1
