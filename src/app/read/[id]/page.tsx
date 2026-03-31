// 동적 경로(id)에 맞는 상세 콘텐츠를 보여주는 페이지입니다.
// 현재는 학습용 예시 형태이며, 실제 서비스에서는 id로 데이터를 조회해 보여줍니다.
export default async function Read(props: { params: Promise<{ id: any }> }) {
    // URL에서 받은 식별값을 읽어 어떤 항목을 보여줄지 결정합니다.
    // 이 값이 없거나 잘못되면 사용자는 원하는 상세 화면을 볼 수 없습니다.
    const params = await props.params;
    return (
        <>
            <h2>Read</h2>
            parameters : {params.id}
        </>
    )
}