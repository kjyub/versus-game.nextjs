from typing import Dict
import re, random
import pandas, openpyxl

from game_types import Result

### ChatGpt를 이용해서 뽑아낸 데이터들을 이상한 데이터는 없애고 보기 쉽게 정리한 뒤 txt파일 혹은 xlsx파일로 내보낸다.

def clean_title(input_string):
    # 정규 표현식을 사용하여 숫자와 점을 제거
    items = re.sub(r'\d+\.\s*', '', input_string)
    return items

def clean_choices(choices: list[str]):
    new_choices = []

    for choice in choices:
        choice = choice.replace("\n", "")
        choice = choice.replace("  ", "")

        if choice == "" or choice is None or len(choice) == 0:
            continue

        if choice[0] == " ":
            choice = choice[1:]

        new_choices.append(choice)

    return new_choices

# GPT 데이터 불러오기
def get_content_data():
    data = []
    with open("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/content.txt", "r") as f:
        data = f.readlines()

    return data

# 여기서 정리한 결과 txt 파일로 저장
def save_result_data(results: list[Result]):
    result_texts: list[str] = []
    for result in results:
        title = result.title
        choice_str = result.choice_str

        # 타이틀 패딩
        # for i in range(24 - len(title)):
        #     title += " "
        
        result_text = f"{title}${choice_str}"
        result_text = result_text.replace("\n", "") + "\n"
        result_texts.append(result_text)

    with open("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/result_1.txt", "w") as f:
        f.write("")
        f.writelines(result_texts)

# 여기서 정리한 결과 excel 파일로 저장
def save_result_excel(results: list[Result]):
    data = {
        "주제": [],
    }
    for result in results:
        title = result.title

        data["주제"].append(title)

        for i in range(100):
            key = f"선택지 {i+1}"

            if key not in data:
                data[key] = []
            
            choice = ""
            try:
                choice = result.choices[i]
            except:
                pass

            data[key].append(choice)

    df = pandas.DataFrame(data)
    df.to_excel("/Users/kjyub/Documents/GitHub/kjyub-vscode/versus-game/versus-game.nextjs/python/result_1.xlsx", index=True, engine="openpyxl")

# GPT가 생성한 선택지들에 vs가 섞여 있으면 잘못 생성한 답변으로 판단
def is_choice_has_vs(choices: list[str]):
    for choice in choices:
        if "vs" in choice or "VS" in choice:
            return True
        
    return False

# 주제의 내용이 이상할 경우 찾기
def has_strange_title(title: str):
    if title == "" or title is None:
        return True
    
    if "어요" in title or \
        "세요" in title or \
        "주제" in title or \
        "입니다" in title or \
        "에요" in title:
        return True
    
    return False

# 주제와 선택지까지 중복되는게 있는지 확인
def is_duplicate_game(result: Result, result_dic: Dict[str, list[Result]]):
    # 1. 주제 확인
    if result.title not in result_dic:
        return False
    
    
    # 2. 선택지 확인
    dup_results: list[Result] = result_dic[result.title]

    for dup_result in dup_results:
        dup_choices = dup_result.choices
        choices = result.choices

        # if result.title == "SNS 플랫폼":
        #     print(dup_choices, choices)
        if dup_choices == choices:
            return True

    return False

# 1. GPT 데이터 불러오기
contents = get_content_data()

results: list[Result] = [] # 결과 {title, choices, choice_tr}
result_dic: Dict[str, list[Result]] = {} # 결과와 선택지까지 중복되는지 체크용 {title, list[Result]}

# 2. 데이터 정리 시작
for content in contents:
    if len(content) < 5:
        continue

    keywords = content.split(",")

    title = keywords[0]
    choices = sorted(keywords[1:])
    
    # 3. 주제 텍스트 정리
    title = clean_title(title)
    choices = clean_choices(choices)
    choice_str = str.join(",", choices)

    # 4. VS 선택지 제거
    if is_choice_has_vs(choices):
        continue

    # 5. 이상한 주제 제거
    if has_strange_title(title):
        continue

    result = Result(title=title, choices=choices, choice_str=choice_str)
    # 6. 선택지까지 중복되는게 있는지 확인
    if is_duplicate_game(result=result, result_dic=result_dic):
        continue
    
    results.append(result)
    if title in result_dic:
        result_dic[title].append(result)
    else:
        result_dic[title] = [result]
    

# results 정렬
sorted_results = sorted(results, key=lambda result: (result.title, tuple(sorted(result.choices)))) 

# 결과2. 주제 중 랜덤으로 하나 뽑기
random_results = []
for result_title in result_dic.keys():
    results = result_dic[result_title]

    # 가장 긴 choices들을 찾은 result 찾기
    max_choice_results = []
    choice_lengths = [len(result.choices) for result in results]    
    max_choice_length = max(choice_lengths)

    for result in results:
        if len(result.choices) == max_choice_length:
            max_choice_results.append(result)

    # 랜덤으로 선택
    random.shuffle(max_choice_results)
    result = max_choice_results[0]
    
    random_results.append(result)


# Last. 결과 파일 생성
print(len(result_dic.keys()))
save_result_data(random_results)
# save_result_excel(sorted_results)