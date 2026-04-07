const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchPosts() {
  const res = await fetch(`${baseURL}/posts`);
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export async function fetchPost(id: string | number) {
  const res = await fetch(`${baseURL}/posts/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch post ${id}`);
  }
  return res.json();
}

export async function createPost(data: any) {
  const res = await fetch(`${baseURL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create post');
  }
  return res.json();
}

export async function deletePost(id: string | number) {
  const res = await fetch(`${baseURL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete post ${id}`);
  }
  return res.json();
}

export async function toggleLike(id: string | number) {
  const res = await fetch(`${baseURL}/posts/${id}/like`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to toggle like for post ${id}`);
  }
  return res.json();
}

export async function createComment(postId: string | number, data: any) {
  const res = await fetch(`${baseURL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create comment for post ${postId}`);
  }
  return res.json();
}

export async function deleteComment(commentId: string | number) {
  const res = await fetch(`${baseURL}/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Failed to delete comment ${commentId}`);
  }
  return res.json();
}