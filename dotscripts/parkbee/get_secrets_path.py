import click
from pathlib import Path
import sys

@click.command()
@click.option("--env", default=None, help="Environment folder name.")
@click.argument("file")
def cli(env, file):
    env_path = get_env_path(env)
    
    path_str = Path(env_path, file).resolve()
    print(path_str)
    
    return 0

def get_env_path(env):
    assert (env in ['prod', 'test', 'uat']) or (env is None)
    
    try:
        project_root = climb_to_project_root(Path('.').resolve()) # Where the .git folder is
    except RecursionError:
        raise Exception("It doesn't look like you're in a project folder.")
        
    project_name = get_project_name(project_root)
    path_global = Path(project_root, 'helm', project_name)

    if env is not None:
        path_global = Path(path_global, 'environments', env)       
        
    return path_global
    
def get_project_name(path: Path) -> str:
    return path.resolve().name
    
def climb_to_project_root(dir: Path) -> Path:
    if not dir_is_project_root(dir):
        return climb_to_project_root(dir.parent)
        
    return dir
    
def dir_is_project_root(dir: Path) -> bool:
    git_folder = Path(dir, '.git')
    
    return git_folder.is_dir()

if __name__ == "__main__":
    cli()