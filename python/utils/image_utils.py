import requests
from PIL import Image
from io import BytesIO

def download_and_convert_to_webp(image_url, output_path, quality=85):
    """
    이미지 URL에서 이미지를 다운로드하여 WebP 형식으로 변환하고 저장합니다.

    :param image_url: 다운로드할 이미지의 URL
    :param output_path: 변환된 WebP 이미지의 저장 경로
    :param quality: 이미지 품질 (1~100), 기본값은 85
    """
    try:
        # 이미지 다운로드
        response = requests.get(image_url)
        response.raise_for_status()  # HTTP 에러 확인
        
        # 이미지 열기
        image = Image.open(BytesIO(response.content))
        
        # WebP로 변환하여 저장
        image.save(output_path, format='WEBP', quality=quality, optimize=True)
        
        print(f"Image successfully downloaded and saved as {output_path}")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while downloading the image: {e}")
    except Exception as e:
        print(f"An error occurred while converting the image: {e}")

# 사용 예시
# image_url = 'https://example.com/path/to/image.jpg'  # 이미지 URL
# output_path = 'converted_image.webp'  # 저장할 WebP 이미지 파일 경로
# download_and_convert_to_webp(image_url, output_path, quality=85)