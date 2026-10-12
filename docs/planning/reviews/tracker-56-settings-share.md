# #56 설정·공유 개선 — #71 / #72 / #73

2026-10-09 JST. 현재 작업 트리의 국소 수정과 단위 검증 기록이다. 공개 배포와 실제 모바일·LINE/X 검증 완료를 뜻하지 않는다.

## 계약과 구현 범위

`03-ux-screen-contracts.md`의 공유 및 설정 계약을 먼저 구체화했다. 변경은 기존 `DataSettings`, `StorageStatus`, `ShareButton`, `DnaShareDialogBody`와 일본어 strings를 사용한다. 새 의존성·서버 route·데이터 스키마·영속성 쓰기를 추가하지 않는다.

### #71 내보내기

- [x] 준비 상태는 기존 disabled 버튼과 `role=status`, 성공은 **다운로드 시작**으로 알린다. 저장 완료나 다운로드 취소를 감지했다고 주장하지 않는다. 브라우저 다운로드 목록에서 확인하도록 안내한다.
- [x] 현재 `先にエクスポート`는 `handleExport("danger")`를 호출한다. 스크롤 전용이 아니며 실제 내보내기를 실행하는 기존 경로를 유지했다.
- [x] 다운로드 click 예외 시 임시 anchor/blob URL을 정리하고 기존 오류 알림을 유지한다. 실패에는 성공 알림을 남기지 않는다.
- [x] 용량은 `navigator.storage.estimate().usage`로 origin 전체 추정치다. 캐시 등을 포함하고 JSON 백업 크기와 다름을 명시한다.
- [x] 충돌 선택 목록 확인·취소·명시적 중복 초안 제외 내보내기 및 데이터 무변경 회귀를 검증했다.
- [ ] 실제 브라우저 다운로드 파일→제품 Import는 최종 일괄 E2E의 기존 `downloadExport` 시나리오로 검증한다. 이번 단위 테스트의 anchor spy는 파일 저장 증거가 아니다.

### #72 저장 보호

- [x] 승인·미승인·거부·미확인·API 미지원을 구분한다. 상태 조회 실패여도 `persist`가 있으면 사용자의 명시적 요청은 가능하다.
- [x] 기능 이름은 자동 삭제 억제 요청이다. 승인 문구는 브라우저가 요청을 승인했다는 사실에 한정한다.
- [x] 수동 삭제, 시크릿·게스트 모드 종료, 동기화·백업의 한계를 항상 표시하고 Export 경로를 유지한다. 사생활 모드 탐지나 지문 수집은 하지 않는다.
- [x] true/false/예외/미지원 분기는 단위 테스트로 검증하며 기록 변경 메서드를 호출하지 않는다.
- [ ] 일반/게스트·시크릿 모드 실제 브라우저별 persistence 정책은 이번 단위 테스트로 검증하지 않았다. 특정 브라우저의 보존 보장은 하지 않는다.

### #73 공유

- [x] 작품 OS 공유는 title/text/URL을 전달하며 미지원 환경의 복사는 작품명+URL이다. 접근 가능한 버튼 이름과 결과 문구가 실제 동작과 맞는다. OS 시트 종료는 게시 완료라고 표시하지 않고 취소는 오류로 알리지 않는다.
- [x] DNA의 기존 URL만 복사를 유지하고 소개문+URL 복사를 별도로 제공한다. native share도 같은 소개문+URL을 사용한다.
- [x] 미리보기는 직렬화되는 `link`에서 공개 작품명·숨긴 수·전체 전송 축의 정성 단계·추천을 보여준다. 작품 숨김은 URL의 workIds에서도 제거되며 분석 수는 유지한다. 미리보기 열기·공유는 원본 기록을 변경하지 않는다.
- [x] 이미지 미지원과 LINE/X에서 개별 DNA preview가 보장되지 않음을 UI에 명시한다. 소개문+링크와 링크 복사 실패 시 기존 수동 선택 링크 칸이 fallback이다.
- [x] 새 서비스 유입 URL이나 측정 필드를 추가하지 않았고 기존 비식별 `share-card` 경로와 자발적 URL 전송 안내를 유지한다.
- [ ] LINE/X 실제 앱 붙여넣기·크롤러 캐시·표시 결과는 미검증이다. 현재 지원하는 텍스트/URL 전달과 외부 플랫폼의 프리뷰를 구분한다.

## 이미지와 OG 경로 비교

| 경로 | 장점 | 현재 계약에 대한 비용·판정 |
| --- | --- | --- |
| URL 및 소개문 | 기존 공개 요약 payload 재사용, 계정/서버 저장 불필요, 브라우저 clipboard fallback | 채택. 링크를 열면 공개 요약을 확인할 수 있으며 플랫폼 카드 이미지는 보장하지 않는다. |
| 클라이언트 PNG 생성/파일 공유 | 사용자가 미리 확인한 이미지 자체를 전달 가능 | 별도 캔버스/이미지 생성 및 파일 공유 지원·폰트·표지 제약 검증 필요. 2026-10-01에 PNG에서 링크로 전환한 계약을 유지하고 이번에는 추가하지 않는다. |
| 개인 DNA별 OG 이미지 | 플랫폼 카드에 직접 표시될 가능성 | crawler가 읽을 공개 이미지 응답과 payload 대응, 캐시·크롤러 정책 검증이 필요하다. 현재 고정 공유 셸/서버 경계에서 추가하지 않는다. 공개 개인 기록 저장으로 해결하지 않는다. |

[LINE 공식 Share FAQ](https://developers.line.biz/en/faq/tags/sp-share/)는 URL preview가 나오지 않는 경우에도 URL 공유는 가능하며 URL/text와 사진 파일 공유가 다른 기능임을 설명한다(2026-10-09 확인). 이 자료는 이번 제품을 LINE 앱에서 실행한 증거가 아니다. X의 기존 [Cards 시작 문서](https://developer.x.com/en/docs/twitter-for-websites/cards/guides/getting-started)는 조회 시 일반 개발자 개요로 이동해 현재 Cards 세부 정책을 확인하지 못했다. 캐시 기간·개인화 이미지 지원을 추정하지 않는다.

## 국소 검증

- `pnpm exec vitest run tests/unit/settings/settings-flow.test.tsx tests/unit/taste/dna-share-dialog.test.tsx tests/unit/work-detail/work-traits.test.tsx`: 3파일, 31테스트 PASS.
- 동일 7개 변경 TSX/테스트 파일의 `pnpm exec eslint`: PASS.
- Ponytail 및 React 체크: 기존 컴포넌트·live region·오류 경로 재사용, 공유 상태는 URL payload에서 파생, effect cleanup 유지, 새 네트워크 요청·의존성·전역 상태 없음.
- 전체 test/build/E2E/CI는 요청한 최종 통합 시점에 위임했다. 실제 다운로드·브라우저 모드·플랫폼 표시가 필요한 위 미완료 항목은 별도 근거 없이 완료로 바꾸지 않는다.

## 후속 React·취소 경로 검토

- `vercel:react-best-practices`의 effect/state·접근성·경계 체크로 관련 caller와 오류 경로를 다시 검토했다. 범위 밖 성능 최적화는 추가하지 않았다.
- 초기 `persisted()` 응답이 늦게 도착하여 직전 `persist()` 승인 결과를 덮을 수 있는 경쟁을 발견했다. 초기 조회는 아직 상태가 미확인일 때만 반영하도록 하고 역순 응답 회귀 테스트를 추가했다.
- DNA native share 취소가 이전 성공 안내를 남길 수 있어 새 공유 시도에서 안내를 비운다. `AbortError`는 여전히 실패로 표시하지 않고 체크한 공개 작품도 변경하지 않는다. `NotAllowedError`에는 복사 fallback을 유지한다.
- Export click 예외 테스트는 성공 없음·anchor/blob cleanup과 delete/replace/policy mutation 미호출을 확인한다. 실제 브라우저의 디스크 오류·사용자 다운로드 취소 관찰로 확대하지 않는다.
- #77 협업: DNA 공유 확인 링크와 공유 페이지 Rakuten 링크에 기존 `mediaStrings.externalNewTab` 표시를 추가했다.
- 재검증: 앞의 세 파일과 `tests/unit/share/dna-share-page.test.tsx`를 함께 실행해 4파일·36테스트 PASS. 후속 변경 5개 TSX/테스트 파일 ESLint PASS.
