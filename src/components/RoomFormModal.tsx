"use client";

import { useState } from "react";
import { Room } from "@/types/reservation";
import { createRoom, updateRoom } from "@/lib/adminApi";

interface RoomFormModalProps {
    room: Room | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RoomFormModal({ room, onClose, onSuccess }: RoomFormModalProps) {
    const isEdit = !!room;

    const [name, setName] = useState(room?.name || "");
    const [location, setLocation] = useState(room?.location || "");
    const [capacity, setCapacity] = useState(room?.capacity || 4);
    const [description, setDescription] = useState(room?.description || "");
    const [amenities, setAmenities] = useState(room?.amenities.join(", ") || "");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("스터디룸 이름을 입력해주세요.");
            return;
        }
        if (!location.trim()) {
            setError("위치를 입력해주세요.");
            return;
        }
        if (capacity < 1) {
            setError("수용 인원은 1명 이상이어야 합니다.");
            return;
        }

        setSubmitting(true);
        setError("");

        const amenitiesList = amenities
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a.length > 0);

        try {
            if (isEdit) {
                await updateRoom(room.id, {
                    name,
                    location,
                    capacity,
                    description,
                    amenities: amenitiesList,
                });
            } else {
                await createRoom({
                    name,
                    location,
                    capacity,
                    description,
                    amenities: amenitiesList,
                });
            }
            onSuccess();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: { error?: string } } } };
            const message =
                axiosErr.response?.data?.detail?.error ||
                (isEdit ? "스터디룸 수정에 실패했습니다." : "스터디룸 생성에 실패했습니다.");
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <h2 className="text-lg font-bold mb-4">
                    {isEdit ? "스터디룸 수정" : "스터디룸 추가"}
                </h2>

                {error && (
                    <p className="text-sm text-red-500 mb-3">{error}</p>
                )}

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="스터디룸 A"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            위치 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="3층 301호"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            수용 인원 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">설명</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="4인용 소규모 스터디룸"
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">편의시설</label>
                        <input
                            type="text"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                            placeholder="화이트보드, 모니터, Wi-Fi"
                            className="w-full border rounded px-3 py-2"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            쉼표(,)로 구분하여 입력
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm rounded border hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-4 py-2 text-sm rounded bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                        {submitting
                            ? "처리 중..."
                            : isEdit
                            ? "수정"
                            : "추가"}
                    </button>
                </div>
            </div>
        </div>
    );
}
