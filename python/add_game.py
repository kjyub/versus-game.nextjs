
import os

from utils import image_utils, db_utils
from game_types import Result
from nanoid import generate

### txt로 정리된 데이터를 이용해서 db에 게임을 추가한다

# 정리한 데이터 불러오기
def get_content_data():
    data = []
    with open("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/result_1.txt", "r") as f:
        data = f.readlines()

    return data

# 데이터로 부터 Result 만들기
def get_results(datas: list[str]):
    results: list[Result] = []
    
    for data in datas:
        splits = data.split("$")
        title = splits[0]
        choice_str = splits[1]

        choices = choice_str.split(",")

        result: Result = Result(title=title, choices=choices, choice_str=choice_str)
        results.append(result)

    return results

def add_games(results: list[Result]):
    # results = sorted(results)

    game_datas = []
    for i, item in enumerate(results):
        choice_count = len(item.choices)
        choices = []

        for choice_title in item.choices:
            choices.append({
                "gameId": "",
                "title": choice_title.replace("\n", ""),
                "imageId": "",
                "imageUrl": "",
                "voteCount": 0
            })

        game_data = {
            "title": item.title.replace("\n", ""),
            "content": "GPT로 작성된 내용입니다.",
            "thumbnailImageId": "",
            "thumbnailImageUrl": "",
            "views": 0,
            "favs": 0,
            "isDeleted": False,
            "nanoId": generate(size=11),
            "choiceCountType": f"{choice_count * 100}",
            "privacyType": 0,
            "state": 0,
            "choices": choices
        }
        game_datas.append(game_data)

    db_utils.insert_game(game_datas)

datas = get_content_data()

results: list[Result] = get_results(datas)

add_games(results)
# generate_image(choices, CHOICE_PROMPT, "choice_images")