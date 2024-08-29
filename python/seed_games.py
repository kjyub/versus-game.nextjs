import os, re
import openai

### ChatGpt를 이용해서 게임과 선택지에 대한 데이터들의 답변을 받아낸다.

# API_KEY = "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"
API_KEY = os.environ.get("OPENAI_SECRET_KEY")
print(API_KEY)
client = openai.OpenAI(api_key=API_KEY)

def clean_title(input_string):
    # 정규 표현식을 사용하여 숫자와 점을 제거
    items = re.sub(r'\d+\.\s*', '', input_string)
    return items

def generate_juje():
    game_results = []
    contents = []
    game_dic = {}

    for i in range(500):
        messages = [
            {"role": "system", "content": "답변을 행마다 ,로 나눠서 출력해줘 주제,선택지1,선택지2,... 이렇게 ,으로 나누기 쉽게 , 이외의 기호는 쓰지 말아줘"},
            {"role": "user", "content": "VS 게임을 만들건데 사람들이 호불호갈리거나 선택하기 어려운 대주제들을 알려줘 선택지는 최대 10개 까지 주제들은 최대한 많이 그리고 답변은 반드시 이렇게 해줘 주제,선택지1,선택지2,선택지3,선택지4,..."},
            {"role": "assistant", "content": ""}
        ]

        try:
            exclude_titles = game_dic.keys()
            if len(exclude_titles) > 0:
                exclude_title_str = str.join(",", exclude_titles)
                messages.append({"role": "assistant", "content": f"{exclude_title_str}에 대한 주제를 제외하고 알려줘"})

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=4096
            )
            
            content = response.choices[0].message.content
            contents.append(content)
            print(i, content)

            rows = content.split("\n")
            for row in rows:
                splits = row.split(",")

                title = splits[0]
                title = clean_title(title)
                choices = splits[1:-1]

                choice_join = str.join(",", choices)

                print(f"[{title}]: {choice_join}")
                game_dic[title] = choice_join
                game_results.append(f"{title}${choice_join}")
        except Exception as e:
            print("error", i, e)
            pass

    with open("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/result.txt", "w") as f:
        for game_result in game_results:
            f.write(f"{game_result}\n")

    with open("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/content.txt", "w") as f:
        for content in contents:
            f.write(f"{content}\n")


generate_juje()
