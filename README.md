# Dotfiles

Organised by [`rcm`](https://thoughtbot.github.io/rcm/).

## Requirements

- zsh, ohmyzsh
- vim, vundle

## Setup Reminder:

- If you'll use `conda`, you'll need to be careful around `conda init zsh` since it will try to write to `~/.zshrc`. While `rcm` will take care of symlinks, you don't know how symlinks work ;)
- At the moment my work credentials are stored in plain text, therefore not secure. To prevent disaster, `~/.zshrc` sources a `~/.sh_variables`. You need to create this manually.
 
## Usage Reminder

rcm is really well documented.
However this procedure is repeated only once in a while, in my experience.
Therefore the reminder below:

1. Install rcm.
2. Clone git repository.
3. Run `rcup`
