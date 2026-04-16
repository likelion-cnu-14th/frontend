"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type BoardComment,
  type BoardPost,
  createId,
  loadComments,
  loadLikedPostIds,
  loadPosts,
  saveComments,
  saveLikedPostIds,
  savePosts,
} from "./boardStorage";

export function useBoardStore() {
  const [isReady, setIsReady] = useState(false);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  useEffect(() => {
    setPosts(loadPosts());
    setComments(loadComments());
    setLikedPostIds(loadLikedPostIds());
    setIsReady(true);
  }, []);

  const persist = useCallback(
    (nextPosts: BoardPost[], nextComments: BoardComment[], nextLikedIds: string[]) => {
      setPosts(nextPosts);
      setComments(nextComments);
      setLikedPostIds(nextLikedIds);
      savePosts(nextPosts);
      saveComments(nextComments);
      saveLikedPostIds(nextLikedIds);
    },
    []
  );

  const createPost = useCallback(
    (input: { title: string; content: string }) => {
      const id = createId();
      const nextPost: BoardPost = {
        id,
        title: input.title.trim(),
        content: input.content.trim(),
        createdAt: Date.now(),
        likes: 0,
      };
      const nextPosts = [nextPost, ...posts];
      savePosts(nextPosts);
      setPosts(nextPosts);
      return id;
    },
    [posts]
  );

  const addComment = useCallback(
  (postId: string, input: { content: string; author: string }) => {
    const content = input.content.trim();
    const author = input.author.trim();

    if (!content || !author) return;

    const nextComment: BoardComment = {
      id: createId(),
      postId,
      content,
      author,
      createdAt: Date.now(),
    };

    const nextComments = [...comments, nextComment];
    saveComments(nextComments);
    setComments(nextComments);
    return nextComment.id;
  },
  [comments]
);

  const toggleLike = useCallback(
    (postId: string) => {
      const likedSet = new Set(likedPostIds);
      const alreadyLiked = likedSet.has(postId);

      const nextLikedIds = alreadyLiked
        ? likedPostIds.filter((id) => id !== postId)
        : [...likedPostIds, postId];

      const nextPosts = posts.map((p) => {
        if (p.id !== postId) return p;
        const nextLikes = alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
        return { ...p, likes: nextLikes };
      });

      persist(nextPosts, comments, nextLikedIds);
    },
    [comments, likedPostIds, persist, posts]
  );

  const deletePost = useCallback(
    (postId: string) => {
      const nextPosts = posts.filter((post) => post.id !== postId);
      const nextComments = comments.filter((comment) => comment.postId !== postId);
      const nextLikedIds = likedPostIds.filter((id) => id !== postId);

      persist(nextPosts, nextComments, nextLikedIds);
    },
    [comments, likedPostIds, persist, posts]
  );

  const deleteComment = useCallback(
  (postId: string, commentId: string) => {
    const nextComments = comments.filter(
      (comment) => !(comment.postId === postId && comment.id === commentId)
    );

    saveComments(nextComments);
    setComments(nextComments);
  },
  [comments]
);

  const getPostById = useCallback(
    (postId: string) => posts.find((p) => p.id === postId) ?? null,
    [posts]
  );

  const getCommentsForPost = useCallback(
    (postId: string) => comments.filter((c) => c.postId === postId),
    [comments]
  );

  const isLiked = useCallback((postId: string) => likedPostIds.includes(postId), [likedPostIds]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  return {
    isReady,
    posts: sortedPosts,
    comments,
    createPost,
    addComment,
    toggleLike,
    deletePost,
    getPostById,
    getCommentsForPost,
    isLiked,
    likedPostIds,
    deleteComment,
  };
}