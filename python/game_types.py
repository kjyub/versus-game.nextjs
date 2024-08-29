from dataclasses import dataclass

@dataclass
class Result:
    title: str
    choices: list[str]
    choice_str: str