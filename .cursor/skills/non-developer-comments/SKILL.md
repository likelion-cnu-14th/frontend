---
name: non-developer-comments
description: Add and rewrite code comments so non-developers can understand purpose, business meaning, and side effects in plain Korean. Use when writing new code, modifying existing code, refactoring, or when the user asks for easier explanations in comments.
---

# Non-Developer Friendly Comments

## Goal
코드를 읽는 사람이 개발자가 아니어도 "이 코드가 왜 필요한지"를 이해할 수 있게 주석을 작성한다.

## When to Apply
- 새 기능 구현
- 기존 코드 수정
- 리팩터링
- 문서화/가독성 개선 요청
- 사용자가 "쉽게 설명해달라", "비개발자도 이해하게"라고 말한 경우

## Comment Rules
1. 주석은 **왜(목적/배경)** 를 우선 설명한다.  
2. 기술 용어는 최소화하고, 필요하면 짧게 풀어서 쓴다.  
3. 비즈니스 의미, 사용자 영향, 실패 시 영향(부작용)을 포함한다.  
4. 코드 한 줄마다 주석을 다는 방식은 피하고, 의미 단위(함수/로직 블록)로 작성한다.  
5. 주석은 한국어 평문으로, 짧고 명확하게 쓴다.  
6. 구현 상세(변수 대입 같은 자명한 내용)만 반복하는 주석은 금지한다.

## Required Structure
복잡한 함수/블록에는 아래 3가지를 주석에 포함:
- 이 로직의 목적
- 입력/출력이 사용자에게 주는 의미
- 예외/실패 시 처리 이유

## Good vs Bad

### Good
- "결제 승인 전에 재고를 먼저 확인해, 품절 상품이 결제되는 상황을 막는다."
- "관리자가 아닌 사용자가 수정 요청을 보내면 여기서 차단해 데이터 오남용을 예방한다."

### Bad
- "count 값을 1 증가시킨다."
- "if 문을 돌면서 배열을 순회한다."

## Workflow
코드 작성/수정 시 다음 순서로 진행:
1. 먼저 코드 구현
2. 비개발자 관점으로 주석 추가/수정
3. 주석만 읽어도 기능 흐름이 이해되는지 점검
4. 어려운 용어를 쉬운 표현으로 재작성

## Output Preference
- 변경된 코드에는 필요한 주석을 함께 포함한다.
- 답변 말미에 "비개발자용 설명 요약" 2~4줄을 추가한다.