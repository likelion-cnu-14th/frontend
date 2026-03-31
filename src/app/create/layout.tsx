import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// 생성 화면들에 공통 폼 외곽을 제공하는 레이아웃입니다.
// 제목/폼 틀을 통일해 사용자가 "지금 작성 중인 단계"를 헷갈리지 않게 합니다.
export default function Layout(props: { children: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }){
    return (
        <form>
            <h2>Create</h2>
            {props.children}
        </form>
    )
}