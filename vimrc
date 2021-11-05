set nocompatible              " be iMproved, required
filetype off                  " required

" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

Plugin 'godlygeek/tabular'
Plugin 'plasticboy/vim-markdown'
Plugin 'tpope/vim-surround'
Plugin 'Rykka/riv.vim'

" The following are examples of different formats supported.
" Keep Plugin commands between vundle#begin/end.
" plugin on GitHub repo
Plugin 'tpope/vim-fugitive'
" plugin from http://vim-scripts.org/vim/scripts.html
" Plugin 'L9'
" Git plugin not hosted on GitHub
Plugin 'git://git.wincent.com/command-t.git'
" git repos on your local machine (i.e. when working on your own plugin)
Plugin 'file:///home/gmarik/path/to/plugin'
" The sparkup vim script is in a subdirectory of this repo called vim.
" Pass the path to set the runtimepath properly.
Plugin 'rstacruz/sparkup', {'rtp': 'vim/'}
" Install L9 and avoid a Naming conflict if you've already installed a
" different version somewhere else.
" Plugin 'ascenator/L9', {'name': 'newL9'}

" All of your Plugins must be added before the following line
Plugin 'OmniSharp/omnisharp-vim'

call vundle#end()            " required
filetype plugin indent on    " required

" Enable relative numbers by default, may help with navigation.
set relativenumber
set ruler

set linebreak

" Tips from 'vim after 11 years' 
" https://statico.github.io/vim.html

" nmap j gj
" nmap k gk
set incsearch
set ignorecase
set smartcase
set hlsearch
" but also map esc to remove highlights after a search
nnoremap <c-l> <c-l>:noh<cr>

" riv.vim stuff
syntax on
filetype plugin on
filetype plugin indent on

" https://github.com/gu-fan/riv.vim/issues/6
setl foldmethod=expr
setl foldexpr=riv#fold#expr(v:lnum)
setl foldtext=riv#fold#text()
