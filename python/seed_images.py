
import openai
import os

from utils import image_utils

API_KEY = os.environ.get("OPENAI_SECRET_KEY")
print(API_KEY)
client = openai.OpenAI(api_key=API_KEY)

### txt로 정리된 데이터에서 선택지들만 골라서 이미지파일을 생성한다.

# 정리한 데이터 불러오기
def get_content_data():
    data = []
    with open("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/result_1.txt", "r") as f:
        data = f.readlines()

    return data

# 데이터로 부터 choice들만 가져오기
def get_titles_choices(datas: list[str]):
    title_dic = {}
    choice_dic = {}
    
    for data in datas:
        splits = data.split("$")
        title = splits[0]
        choice_str = splits[1]

        choices = choice_str.split(",")

        title_dic[title] = 0
        for choice in choices:
            choice_dic[choice] = 0

    return title_dic.keys(), choice_dic.keys()

def generate_image(items: list[dir], prompt_format: str, folder_name: str):
    items = sorted(items)

    for i, item in enumerate(items):
        if i > 5:
            break

        try:
            prompt = prompt_format.format(item)
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )

            image_url = response.data[0].url
            image_utils.download_and_convert_to_webp(
                image_url=image_url,
                output_path=f"/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/{folder_name}/{item}.webp"
            )

            print(i, item, prompt)
        except Exception as e:
            print("에러", i, item, e)
        
    print(len(items))

datas = get_content_data()

titles, choices = get_titles_choices(datas)

TITLE_PROMPT = "VS게임에서 사용할 게임 썸네일 이미지를 만들어 줘 주제는 {}야"
CHOICE_PROMPT = "VS게임에서 사용할 게임의 선택지 이미지를 만들어 줘 내용은 {}야"
generate_image(titles, TITLE_PROMPT, "title_images")
# generate_image(choices, CHOICE_PROMPT, "choice_images")