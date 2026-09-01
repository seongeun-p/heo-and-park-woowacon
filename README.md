# 📦 Archive Gallery

친구랑 함께 만드는 아카이빙용 갤러리 사이트예요. `entries/` 폴더에 html 파일을 올리면(push하면) 자동으로 갤러리에 카드가 생겨요.

## 사용법

### 1. 새 항목 올리기

가장 쉬운 방법은 GitHub 웹에서 바로 올리는 거예요.

1. 이 저장소의 `entries` 폴더로 이동
2. **Add file → Upload files** 클릭
3. 만든 html 파일을 끌어다 놓고 커밋(Commit changes)

또는 git을 쓴다면:

```bash
git clone <이 저장소 주소>
cd archive-gallery
cp 내가만든파일.html entries/
git add entries/내가만든파일.html
git commit -m "add: 내가만든파일"
git push
```

push하고 1분 정도 지나면 GitHub Actions가 `manifest.json`을 자동으로 갱신하고, GitHub Pages 사이트에도 반영돼요.

### 2. html 파일 작성 규칙 (선택이지만 추천)

갤러리 카드에 예쁘게 나오려면 파일 안에 이 두 태그를 넣어주세요.

```html
<title>카드에 보일 제목</title>
<meta name="description" content="카드에 보일 한 줄 설명" />
```

작성자/날짜는 git 커밋 정보에서 자동으로 가져와요 (누가 push했는지, 언제 push했는지).

### 3. 화면 녹화 영상을 쓰고 싶다면

영상 파일은 GitHub에 직접 올리기엔 크고 무거워요(저장소 용량 제한). 이렇게 하는 걸 추천해요.

1. 녹화한 영상을 YouTube(비공개 또는 일부공개)나 Google Drive에 업로드
2. entries의 html 파일 안에 iframe으로 임베드

```html
<iframe
  width="100%"
  height="480"
  src="https://www.youtube.com/embed/영상ID"
  allowfullscreen
></iframe>
```

영상을 정말 저장소 안에 직접 저장하고 싶다면 [Git LFS](https://git-lfs.com/)를 쓰면 되는데, GitHub 무료 플랜은 LFS 용량/대역폭이 월 1GB로 꽤 작으니 참고하세요.

## GitHub Pages로 배포하기 (한 번만 설정)

1. 저장소 **Settings → Pages**
2. **Build and deployment → Source**: `Deploy from a branch`
3. **Branch**: `main`, 폴더는 `/ (root)`
4. Save

몇 분 뒤 `https://<사용자명>.github.io/<저장소명>/` 주소로 접속하면 갤러리가 보여요.

> 이 저장소는 Public이에요. 주소를 아는 사람은 누구나 볼 수 있지만(검색엔진엔 노출 안 됨), 링크를 공유하지 않으면 사실상 두 분만 보게 돼요. 더 엄격하게 비공개로 하고 싶으면 나중에 Cloudflare Pages + Access 같은 방식으로 바꿀 수 있어요.

## 로컬에서 미리보기

```bash
npx serve .
# 또는
python3 -m http.server 8000
```

## 폴더 구조

```
.
├── index.html                  # 갤러리 페이지
├── manifest.json                # 항목 목록 (자동 생성됨, 직접 수정하지 마세요)
├── entries/                     # 여기에 html 파일을 추가
│   └── sample-entry.html        # 예시 항목
├── scripts/build-manifest.mjs   # entries를 스캔해 manifest.json을 만드는 스크립트
└── .github/workflows/update-manifest.yml  # push할 때 자동으로 manifest.json 갱신
```
