GO

무결성 확인: 번들 총 38개 파일을 읽었고, `SHA256SUMS`에 기재된 37개 payload가 모두 검증을 통과했다.

1. 프로필별 Top 10

- `kinetic-competition`: 명백히 잘못된 결과 없음. 1위 `haikyu`는 `motionImpact`, `pacing`, `progression`이 각각 `+0.06`이고 Blue Lock의 `sportsCompetition` 근거가 있다. 경계 사례인 9위 `berserk`도 Chainsaw Man이 최인접 앵커이며 `pacing +0.06`, `combat +0.06`, `vagueDislike -0.020468305113`이 함께 반영돼 있다.
- `tactical-mystery`: 명백히 잘못된 결과 없음. 1위 `20th-century-boys`는 Death Note 기반 `investigation +0.0625`, `mysteryReveal +0.06`, `investigation adjustment +0.06`과 `horror -0.0375`가 모두 드러난다. 액션계 경계 결과도 Kingdom/FMA/Dungeon Meshi 앵커와 낮은 comedy 선호로 설명된다.
- `warm-exploration`: 명백히 잘못된 결과 없음. 1·2위 Witch Hat/Natsume은 warmth·foundFamily·softness로 직접 지지된다. 가장 의심하기 쉬운 10위 `ghost-in-the-shell`은 점수도 `0.314511002054`로 낮고, FMA의 worldBuilding/motionImpact 유사성 외에 `artStyleDislike -0.08`, `visualSoftness -0.03`, `combat -0.03`, `emotionalWarmth -0.03`이 반영됐다. 데이터도 darkness 2, mentalStress 1, emotionalWarmth 1이므로 어둠·스트레스 불호를 우회한 결과가 아니다.

2. 소수 취향 보존

- Kinetic: Baseline에 없던 `haikyu`와 `hajime-no-ippo`가 Taste 1·2위로 진입했다.
- Tactical: `20th-century-boys`가 Baseline 10위에서 Taste 1위로 상승했고, `pluto` 3위, `erased` 4위, `noragami` 9위, `spy-family` 10위가 Baseline 밖에서 진입했다.
- Warm: `natsumes-book-of-friends`가 Baseline 10위에서 Taste 2위로 상승하고 `beyond-the-clouds`가 4위로 진입했다. Baseline 8·9위의 `berserk`와 `jujutsu-kaisen`은 Taste에서 제거됐다.

세 프로필 모두 고유 취향이 다수 앵커나 시장 Baseline에 지워지지 않았다.

3. Unknown 과대평가

과대평가 없음. 세 프로필 모두 `SHRUNK=0`이고 `PARTIAL=13/16/15`다. PARTIAL은 일부 축이 unknown이어도 coverage가 임계 이상이라는 뜻이며 SHRUNK 실패가 아니다.

- `20th-century-boys` 1위: narrative `0.8333`, tone `0.8571`, art `0.75`; 순위 근거는 known investigation/mystery 신호다.
- 가장 unknown이 많은 상위권 사례인 `bocchi-the-rock`은 narrative `0.6667`, tone `0.8571`, art `0.75`로 모두 임계 이상이지만, 점수 `0.487439184471`, 8위에 머물고 스트레스 감점도 받았다.
- `berserk`도 세 PARTIAL 그룹을 갖지만 점수 `0.619344096325`, 9위다.

4. 부정 사유 감사

- `vagueDislike`: Kinetic의 10개 결과 모두 Yotsuba 기반 shape penalty를 받았다. ledger에 노출된 예는 JJK `-0.026040951576`, Berserk `-0.020468305113`이며 설명 근거로 오용되지 않았다. Yotsuba형 작품의 명백한 누출도 없다.
- `tooSlow`: Kinetic Top 10의 pacing은 모두 2 또는 4라서 적용 0건이 정확하다.
- `tooDark`: Warm Top 10의 darkness가 전부 0~2라서 적용 0건이 정확하다.
- `tooStressful`: mentalStress 4인 Bocchi에만 `-0.10`; 나머지는 1~2라 미적용이 정확하다.
- `artStyleDislike`: Chainsaw Man 대비 Art 유사도가 임계 `0.75` 이상인 HxH `0.833333…`, Dr. Stone `0.875683…`, Kaguya `0.833333…`, GitS `0.753388…`에만 각각 `-0.08`이 적용됐다.
- Tactical은 부정 source가 없으므로 penalty 0건이다.

팩터 불일치나 disliked leakage는 발견되지 않았다.

5. G1 판정

동결된 50작품 후보는 변경 없이 G1을 통과한다. 이 판정은 G1 종료만 승인하며 G2 결과를 선결하지 않는다.

6. 수정안

해당 없음. cohort, 팩터 사전, 산식 계약, 데이터 모두 수정할 필요가 없다.
