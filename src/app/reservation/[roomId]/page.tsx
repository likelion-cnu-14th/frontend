// 09:00 ~ 21:00 시간대 생성 (22:00은 종료 시간으로만 사용)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
});
// → ["09:00", "10:00", "11:00", ..., "21:00"]