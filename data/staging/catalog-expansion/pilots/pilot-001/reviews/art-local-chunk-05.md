# Pilot 001 Art gate — chunk 05 Local pixel audit

- 검사일: 2026-08-23 (Asia/Tokyo)
- 대상: Pilot 001 chunk-05의 7작품
- 기준: 공식 내부 페이지, 정확한 작품·초반 1~3권 판본 연결, 판독 가능한 내부 페이지 6쪽 이상, 서로 다른 장면 맥락 2개 이상
- 판정 기준: `docs/factors/factor-dictionary.md`의 Art 0/2/4 anchor. 1과 3은 인접 anchor 사이에만 사용
- `motionImpact`: 정확한 시작·끝 페이지가 있는 연속 동작 시퀀스를 확인한 경우에만 known
- 금지 자료: 표지, 애니메이션 이미지, 줄거리, 유저의 작화 평가
- 저장소 파일 수정: 없음. 아래 PNG는 모두 `.gitignore`의 `/output/playwright/` 아래 임시 산출물이며 커밋 대상이 아님
- 판정 경계: Local Codex의 실제 픽셀 판독 제안. 같은 해시의 PNG에 대한 Gemini 3.7 Flash High 검토와 충돌 시 Pass C adjudication은 별도로 남음

## 결과 요약

| Work | 공식 초반부 내부 페이지 | 정적 Art 상태 | `artRealism` | `artDensity` | `visualSoftness` | `motionImpact` |
|---|---:|---|---:|---:|---:|---|
| `work-07dc759bd91e1cffb2df` しあわせは食べて寝て待て | 6쪽 / 3맥락 | qualified | 2 | 2 | 3 | unknown |
| `work-3588928ab8f6a2520923` 海が走るエンドロール | 6쪽 / 3맥락 | qualified | 3 | 3 | 3 | unknown |
| `work-b2c37bdb52e2a78dfd41` 天幕のジャードゥーガル | 6쪽 / 3맥락 | qualified | 0 | 3 | 3 | unknown |
| `work-081e75d8bbc53ac64713` ダイヤモンドの功罪 | 6쪽 / 3맥락 | qualified | 2 | 2 | 2 | 3 |
| `work-7730845c9cf7ba0cccc8` 君と宇宙を歩くために | 6쪽 / 3맥락 | qualified | 2 | 2 | 2 | unknown |
| `work-268e1fa3599955359969` ふつうの軽音部 | 6쪽 / 3맥락 | qualified | 1 | 2 | 3 | unknown |
| `work-192cbecc59e9c028142b` 本なら売るほど | 6쪽 / 3맥락 | qualified | 3 | 3 | 2 | unknown |

정적 Art 최소 표본은 7/7작품이 통과했다. `motionImpact`는 ダイヤモンドの功罪의 정확한 연속 야구 동작만 gate를 통과했다. 나머지 6작품의 unknown은 낮은 값이 아니며, 이번 공식 표본에서 조건을 책임 있게 충족하지 못했다는 뜻이다. Art 표본 부족에 따른 blocker는 0작품이다.

## 작품별 판정

### `work-07dc759bd91e1cffb2df` — しあわせは食べて寝て待て

- 대표 일반판: 1권, ISBN `9784253160827`
- 공식 URL: <https://souffle.life/manga/shiawase-ha-tabete-nete-mate/20200318-2/>
- 작품·판본 연결: 秋田書店 운영 Souffle의 작품명 일치 공식 제1화. 2020-03-18 최초 진입 화차이고 1권에 수록되는 초반부로, Pilot의 대표 일반판 1권과 연결된다.
- 뷰어 확인: 공식 페이지가 `/assets/img/manga/shiawase-ha-tabete-nete-mate/001/0001.jpg`부터 `0016.jpg`까지 16장의 846×1200 내부 페이지를 직접 제공했다.
- 판독 표본: reader refs 0002–0003, 0008–0009, 0014–0015의 6쪽.
- 맥락: 직장·업무 장면, 진료실 장면, 공동주택·이웃 대화 장면.
- Local 제안:
  - `artRealism=2`: 인체와 생활 공간은 일관되지만 얼굴·비례는 일반적인 만화식 스타일화다.
  - `artDensity=2`: 배경과 생활 소품을 필요한 만큼 그리면서 여백과 대사 공간을 균형 있게 쓴다.
  - `visualSoftness=3`: 둥근 얼굴선, 부드러운 표정, 가는 선의 비중이 중립보다 분명히 높으나 4의 지속적인 미려함까지는 아니다.
  - `motionImpact=unknown`: 정확히 경계 지을 수 있는 연속 동적 시퀀스를 표본에서 확인하지 못했다.
- 불확실성: 제1화 16쪽 범위의 정적 작화 제안이며 장기 연재 후반의 변화는 포함하지 않는다.
- SHA-256:

```text
92c8b0d8daa054e92b00c2db9f76b15af787e376f6c3ad6744e6f67e9c06a14b  output/playwright/pilot-art/chunk-05/shiawase/page-0002.png
900342aea8223ecac11ec7f6f70b417420b62888b82ec7f7d14fb9af00af4982  output/playwright/pilot-art/chunk-05/shiawase/page-0003.png
d679815689a1765521fac2252691beca7c5a847d203dd110236c573d75a61afe  output/playwright/pilot-art/chunk-05/shiawase/page-0008.png
c7719c2120041015a19d760beef53fae0937ccfa3e88cd2c4046da74ab249929  output/playwright/pilot-art/chunk-05/shiawase/page-0009.png
9592849b1ea94f7d7e11f3e00c00370e47928869437f033a71331f7f9fee458c  output/playwright/pilot-art/chunk-05/shiawase/page-0014.png
5334bec30fac6e3ed6d2e0c7f1799038d2ee8d8e0e43ca9fc9e00e20ef9f4817  output/playwright/pilot-art/chunk-05/shiawase/page-0015.png
```

### `work-3588928ab8f6a2520923` — 海が走るエンドロール

- 대표 일반판: 1권, ISBN `9784253265218`
- 공식 URL: <https://souffle.life/topics/souffle-special/20210816-3/>
- 작품·판본 연결: 페이지 제목이 `海が走るエンドロール １巻 試し読み`이고, 秋田書店 1권 상품 `4253265219`로 연결된다.
- 뷰어 확인: 공식 페이지가 `umi-hashiru-end-roll-5.jpg`부터 `38.jpg`까지 34장의 844×1200 내부 페이지를 제공했다.
- 판독 표본: refs 05–06, 18–19, 31–32의 6쪽.
- 맥락: 영화적인 해안·도입 장면, 영화관 관객 장면, 주거 공간·문 앞 대화 장면.
- Local 제안:
  - `artRealism=3`: 노년 인물의 연령·체형·자세와 공간 비례가 현실 쪽에 기울지만 얼굴은 여전히 스타일화돼 4보다 낮다.
  - `artDensity=3`: 배경, 톤, 검은 면과 화면 정보가 균형 anchor보다 지속적으로 많지만 최고 밀도는 아니다.
  - `visualSoftness=3`: 섬세한 선과 표정, 완만한 윤곽이 중립보다 부드럽다.
  - `motionImpact=unknown`: 표본에 정확히 경계 지은 연속 동작 시퀀스가 없다.
- 불확실성: 1권 미리보기 일부에 대한 판단이며 영화 제작 장면의 후속 시각 변화는 포함하지 않는다.
- SHA-256:

```text
06db47ca75549db299579546c549b75a3f244ea10498ec38b120107359eee207  output/playwright/pilot-art/chunk-05/umi-endroll/page-05.png
880ad97868738f7784f8cb2038cc5b8d160ce35648305c4c63a6b553b32d9656  output/playwright/pilot-art/chunk-05/umi-endroll/page-06.png
843933626ab255a7f2eb19717265df8aba6cae412bb453c553d4b695c0593b66  output/playwright/pilot-art/chunk-05/umi-endroll/page-18.png
cef3977f5d3d7562abdf82db730acfc1029b6db353703ff542d1622c5a524ac2  output/playwright/pilot-art/chunk-05/umi-endroll/page-19.png
a713067db5fa097af1e3d355d0dba889dbc702eaf700c9ea0cb3ccd3b8f84ad9  output/playwright/pilot-art/chunk-05/umi-endroll/page-31.png
754174f8e63a4b0400117fee1b6923bcc76e7c38cd65af98894b0c5af66d44ef  output/playwright/pilot-art/chunk-05/umi-endroll/page-32.png
```

### `work-b2c37bdb52e2a78dfd41` — 天幕のジャードゥーガル

- 대표 일반판: 1권, ISBN `9784253264464`
- 공식 URL: <https://souffle.life/manga/tenmaku-no-ja-dougal/20210925/>
- 작품·판본 연결: 秋田書店 운영 Souffle의 작품명 일치 `#1 天幕のジャードゥーガル`; 초반 제1화이며 1권 일반판에 연결된다.
- 뷰어 확인: `/001/0001.jpg`부터 `0040.jpg`까지 40장의 846×1200 내부 페이지.
- 판독 표본: refs 0002–0003, 0012–0013, 0030–0031의 6쪽.
- 맥락: 장식적인 역사 도입, 기마·야영지 장면, 서재·정원 대화 장면.
- Local 제안:
  - `artRealism=0`: 인물 비례와 얼굴이 의도적으로 강하게 단순화·데포르메됐다. 실제 픽셀이 0 anchor에 직접 부합한다.
  - `artDensity=3`: 의복·문양·시대 소품·공간 정보가 풍부하되 모든 페이지가 4 수준의 고밀도는 아니다.
  - `visualSoftness=3`: 둥글고 유려한 곡선과 팝한 화면이 중립보다 부드럽다.
  - `motionImpact=unknown`: 선택한 연속 refs에 기마 이미지가 포함되지만 시작·끝이 분명한 연속 동작 시퀀스로 판정할 수 없다.
- 불확실성: 정적 3축은 제1화 전반에 일관되지만, 대규모 전투 장면의 `motionImpact`를 이 표본으로 대신할 수 없다.
- SHA-256:

```text
34b00aa652c934e440ee21300ed0e3199ce672fa6827c1469dbd16e383ea0b1e  output/playwright/pilot-art/chunk-05/tenmaku/page-0002c.png
22f4c9c2da1547948481f571b252b62db02ab68635092b9c0bb2e74388047316  output/playwright/pilot-art/chunk-05/tenmaku/page-0003c.png
0292f29d799b07d74b0047038b4450bc6077771a92a8e4d0121706bfe3851db1  output/playwright/pilot-art/chunk-05/tenmaku/page-0012.png
d50d68608d049d55d249f56121a4c4f2d7266c1d898790a4c97e63a518ad6c61  output/playwright/pilot-art/chunk-05/tenmaku/page-0013.png
aeb04a0c4ca97fc65266ff2107b3cc5f615f09ff349d798cbb1654185cfdd57d  output/playwright/pilot-art/chunk-05/tenmaku/page-0030.png
dfed78021e1b6635e3f0a809cf29a7703fa2982fe2b0c0b71799020b24d1e1f0  output/playwright/pilot-art/chunk-05/tenmaku/page-0031.png
```

### `work-081e75d8bbc53ac64713` — ダイヤモンドの功罪

- 대표 일반판: 1권, ISBN `9784088927671`
- 공식 URL: <https://tonarinoyj.jp/episode/4855956445056488441>
- 작품·판본 연결: 공식 となりのヤングジャンプ 페이지 제목이 `[第1話] ダイヤモンドの功罪 - 平井大橋`; 게시일 2023-02-09. 같은 페이지의 단행본 영역이 1권 ISBN `978-4-08-892767-1`을 명시한다. 기존 `/embed` URL은 이 정식 episode로 연결된다.
- 뷰어 확인: 공식 GigaViewer의 77개 page-area에서 실제 내부 페이지를 순차 판독했다.
- 판독 표본: exact DOM refs `page-area-15`–`16`, `30`–`31`, `45`–`46`의 6쪽.
- 맥락: 자동차 안 가족 대화, 야구 발견·투구 장면, 유소년 팀·구장 상호작용.
- Local 제안:
  - `artRealism=2`: 인체 동작과 야구 자세는 설득력 있지만 얼굴·신체는 일반적 만화 스타일화 범위다.
  - `artDensity=2`: 인물 동작과 필요한 구장·차량 배경 사이가 균형적이다.
  - `visualSoftness=2`: 둥근 부분과 각진 스포츠 선이 함께 있어 중립 anchor에 가깝다.
  - `motionImpact=3`: `page-area-30` 상단의 공 포착·준비에서 `page-area-31`의 스피드라인 투구·포구와 투구 자세까지 동일 야구 동작이 연속된다. 보통 2보다 동작 강조가 강하지만 4의 극단적 속도·타격감까지는 아니다.
- 불확실성: `motionImpact=3`은 정확히 `page-area-30 → page-area-31` 범위에 한정된 제안이며 Gemini 불일치 시 우선 adjudication 대상이다.
- SHA-256:

```text
fe227b0a8a8f9a78f7a45deddd703deb655385815dcf6fc006b3086765880ce9  output/playwright/pilot-art/chunk-05/diamond/page-area-15.png
19b2aa56f349dc6f66c672cc70f7641a16a9ee45d15426b3f6ab35a871f26907  output/playwright/pilot-art/chunk-05/diamond/page-area-16.png
60a3fa5bd579489d213a17e685c0f0079a5a3aa9246b672899e7e1d41ed90867  output/playwright/pilot-art/chunk-05/diamond/page-area-30.png
99ee856d770fc337d28b634d8c0b8bcb67ee6a587dc92a2b8575bd549d442a95  output/playwright/pilot-art/chunk-05/diamond/page-area-31.png
a673f57874d94696c25d929732f966cbf0f73829ee03283ce0181769a75d5932  output/playwright/pilot-art/chunk-05/diamond/page-area-45.png
0a4e7a39f27b3b7e4cb86592c55270d7a384293794873e91e1d577173b45a4c1  output/playwright/pilot-art/chunk-05/diamond/page-area-46.png
```

### `work-7730845c9cf7ba0cccc8` — 君と宇宙を歩くために

- 대표 일반판: 1권, ISBN `9784065334874`
- 공식 URL: <https://comic-days.com/episode/4856001361225662498>
- 작품·판본 연결: 講談社 공식 コミックDAYS 페이지 제목이 `君と宇宙を歩くために - 泥ノ田犬彦 / 第１話 ワン・ジャイアント・リープ | &Sofa`; 게시일 2023-06-26. 공식 제1화와 1권 대표 일반판의 초반부다.
- 뷰어 확인: 공식 GigaViewer의 96개 page-area.
- 판독 표본: exact full-page refs `page-area-16`–`17`, `30`–`31`, `46`–`47`의 6쪽.
- 맥락: 편의점 아르바이트, 교실·친구 소개, 보드게임·점심·대처법 대화.
- Local 제안:
  - `artRealism=2`: 신체와 생활 공간은 일관되지만 얼굴·표정은 일반적 스타일화다.
  - `artDensity=2`: 생활 배경과 인물·대사의 화면 비중이 균형적이다.
  - `visualSoftness=2`: 둥근 윤곽이 있으나 선과 표정의 방향은 중립에 가깝다.
  - `motionImpact=unknown`: 정확히 경계 지은 연속 동적 장면을 표본에서 확인하지 못했다.
- 불확실성: 정적 3축은 제1화 중 세 맥락을 가로지르지만 후속 권의 변화는 포함하지 않는다.
- SHA-256:

```text
08017a1447d9b374399e34c9ca3403dbc22ef41e75cb4e4ed5c7bccf854be94b  output/playwright/pilot-art/chunk-05/kimi-uchu/page-area-16-full.png
aa09e760fd6604797e030b44cc5148f4f1b0e8766e6124a3ca616bc7563e0c9c  output/playwright/pilot-art/chunk-05/kimi-uchu/page-area-17-full.png
742fc262c6e2d610e26137bf61ec1957e8e2866681388af8f9421d879d9fa95d  output/playwright/pilot-art/chunk-05/kimi-uchu/page-area-30-full.png
b316d65cdee21e76afdb307f7fbc7a361e6bb2007367a0c5c11ec56df0ec4788  output/playwright/pilot-art/chunk-05/kimi-uchu/page-area-31-full.png
bcacb66e5ddbd3aca0b65ee920a905c04fc8b7045bd7f2ed99d9d8ed37b79918  output/playwright/pilot-art/chunk-05/kimi-uchu/page-area-46-full.png
bf18612d57be93a4e912e5ff9901f4a24206e3b4d397b3778747909c9b7de7cc  output/playwright/pilot-art/chunk-05/kimi-uchu/page-area-47-full.png
```

### `work-268e1fa3599955359969` — ふつうの軽音部

- 대표 일반판: 1권, ISBN `9784088840192`
- 공식 URL: <https://shonenjumpplus.com/episode/16457717013869519536>
- 작품·판본 연결: 少年ジャンプ＋ 공식 페이지 제목이 `[第１話～第４話]ふつうの軽音部`; 게시일 2024-01-14. 기타 구매, 신입생 라이브, 입부, 연습으로 이어지는 초반 1~4화 묶음이며 페이지의 단행본 링크가 JC 1권에 연결된다.
- 뷰어 확인: 공식 GigaViewer의 60개 page-area.
- 판독 표본: exact refs `page-area-16`–`17`, `30`–`31`, `44`–`45`의 6쪽.
- 맥락: 교실 자기소개, 학교·신입생 라이브 동선, 경음악부 모집·동료 대화.
- Local 제안:
  - `artRealism=1`: 기본 장면은 읽기 쉬운 비례지만 코미디 표정과 얼굴의 강한 단순화·변형이 반복돼 일반 스타일화 2보다 낮다.
  - `artDensity=2`: 학교 배경, 인물, 대사와 여백이 균형적이다.
  - `visualSoftness=3`: 깔끔하고 둥근 선과 친근한 얼굴 처리가 중립보다 부드럽다.
  - `motionImpact=unknown`: 선택 표본에 시작·끝이 명확한 연속 연주 또는 다른 동적 시퀀스가 없다.
- 불확실성: 1~4화 묶음의 서로 다른 맥락을 포함하지만 본격 공연 장면의 motion 성격은 평가하지 않았다.
- SHA-256:

```text
3d931e3b88219f59febc908693260bd1cfad3694af925258d2dfb6be48960238  output/playwright/pilot-art/chunk-05/futsu-keion/page-area-16.png
923b0185f74b9373682ed866908473038b23db0db1f8e344bfa19a4d388c6ba3  output/playwright/pilot-art/chunk-05/futsu-keion/page-area-17.png
97748d35a8675b6949a71d4c18a0fb859d80fdea3bccd1c7dbdfa491a0e324e0  output/playwright/pilot-art/chunk-05/futsu-keion/page-area-30.png
be28da49e8a1697e71bb5c60bb2d68bbe582afef7b1280470e34f9544621e24c  output/playwright/pilot-art/chunk-05/futsu-keion/page-area-31.png
3e1eaabbccafca1fd15a26931d992fb5d6496fb8101353ffb97d4840f2b3adae  output/playwright/pilot-art/chunk-05/futsu-keion/page-area-44.png
b255857a4db5def9ff88c878a20c1f87a54a07b0d36e414ceeb2ba64adeb234f  output/playwright/pilot-art/chunk-05/futsu-keion/page-area-45.png
```

### `work-192cbecc59e9c028142b` — 本なら売るほど

- 대표 일반판: 1권, ISBN `9784047381070`
- 공식 URL: <https://comic-walker.com/detail/KC_006231_S/episodes/KC_0062310000200012_E?episodeType=first>
- 작품·판본 연결: KADOKAWA 공식 カドコミ 제목이 `【第1話　本を葬送る】本なら売るほど`, 저자 児島 青, 게시일 2025-01-09. 같은 페이지가 `本なら売るほど １`과 2025-01-15 발매를 명시하므로 대표 일반판 1권의 제1화로 연결된다.
- 뷰어 확인: 공식 무료 뷰어 API의 episode id `01944031-43e7-7925-9359-721e373152ee`가 `episode_page_count=32` 및 32개 manuscript를 반환했다. headless 캔버스가 최초에는 빈 화면이어서, 라이브 공식 페이지 컨텍스트 안에서 뷰어가 쓰는 동일한 `drmMode=xor` 처리를 적용한 뒤 여섯 페이지를 이미지로 디코드했다. 접근 제한을 우회하지 않았고 공개 중인 무료 제1화의 공식 응답만 사용했다. 만료되는 signed CDN URL은 증거 식별자로 보존하지 않는다.
- 판독 표본: manuscript refs 02–03, 14–15, 26–27의 6쪽(이미지에 인쇄된 쪽수 6–7, 18–19, 30–31).
- 맥락: 헌책방 손님·점주의 업무, 재고 책 정리·포장 작업, 휴식 뒤 다른 책 수집가·손님과의 대화.
- Local 제안:
  - `artRealism=3`: 성인 인물의 연령·체형·자세와 물건 비례가 현실 쪽에 기울지만 얼굴선은 스타일화돼 4보다 낮다.
  - `artDensity=3`: 책장·책 더미·시계·상점 도구와 해칭이 균형 anchor보다 풍부하지만 여백도 의도적으로 남긴다.
  - `visualSoftness=2`: 선은 깔끔하지만 얼굴 윤곽과 해칭이 단단하고 중립적이며 3~4의 지속적인 부드러움은 아니다.
  - `motionImpact=unknown`: refs 14–15가 정리 작업의 시간 흐름을 보여도 속도·타격감의 시작과 끝을 판정할 연속 동적 시퀀스는 아니다.
- 불확실성: 제1화의 일상·업무 장면 중심 판단이다. 다른 에피소드에 동적 장면이 있더라도 이번 `motionImpact` 근거로 소급하지 않는다.
- SHA-256:

```text
153e37559e18d155f73e145ed7ab02d8add70e37c90b1cb886387c187d7fec36  output/playwright/pilot-art/chunk-05/hon-nara/page-02.png
36718d09ae9045b371a951edd12285744bd58e1e00dad6bfa808dbfbff71974b  output/playwright/pilot-art/chunk-05/hon-nara/page-03.png
82ff9035b60fca01af9141eace6721e0b64729754ef25d68377c8a141f5014e8  output/playwright/pilot-art/chunk-05/hon-nara/page-14.png
9f3dc1e5c0dad8e86326d2ab976027f32d107b3f244191b0376a64cc377545e4  output/playwright/pilot-art/chunk-05/hon-nara/page-15.png
86a7a26604d15b79caada3e7580b9f2f089bff7308df443184ef80458bbb7359  output/playwright/pilot-art/chunk-05/hon-nara/page-26.png
7171872db63653ef8e9583818f8f9872979d137db689dab29779a089db8195bf  output/playwright/pilot-art/chunk-05/hon-nara/page-27.png
```

## Gate 결론과 후속 입력

1. 7작품 모두 공식·정확한 초반부 내부 페이지의 정적 최소 표본을 충족했다.
2. 정적 3축은 모두 Local known 제안으로 닫혔다.
3. `motionImpact`는 ダイヤモンドの功罪만 `known=3`; 나머지 6작품은 근거 한계가 기록된 `unknown`으로 닫혔다.
4. 이 7작품에는 Art 표본 부족만으로 발생하는 `promotionBlocked` 또는 장기 pending 사유가 없다.
5. Gemini에는 위 표의 값이 아니라 정확히 같은 42개 PNG와 SHA-256, 공식 URL, 판본·페이지 범위를 제공해야 한다. Local 결론을 숨긴 독립 판독이 바람직하다.
6. 두 판정원이 다르면 자동 평균이나 다수결을 하지 말고 Factor Dictionary anchor, 실제 픽셀, 판본·평가 범위로 adjudication한다. 우선 충돌 후보는 ダイヤモンドの功罪의 `motionImpact=3`, 天幕のジャードゥーガル의 `artRealism=0`, 本なら売るほど·海が走るエンドロール의 3값 경계다.

