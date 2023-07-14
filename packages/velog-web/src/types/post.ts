import { User, ProfileLinks } from './user'

export type Post = {
  id: string
  title: string
  body: string
  thumbnail: string
  is_markdown: boolean
  is_temp: boolean
  user: User
  url_slug: string
  likes: number
  meta: any
  views: number
  is_private: boolean
  released_at: string
  created_at: string
  updated_at: string
  short_description: string
  comments: Comment[]
  tags: string[]
  comments_count: number
}

export interface Comment {
  id: string
  user: {
    id: string
    username: string
    profile: {
      id: string
      thumbnail: string | null
    }
  } | null
  text: string | null
  replies_count: number
  replies?: Comment[]
  created_at: string
  deleted: boolean
  level: number
}

// Post Type for PostList
export type Posts = {
  id: string
  title: string
  short_description: string
  thumbnail: string
  user: User
  url_slug: string
  is_private: boolean
  released_at: string
  updated_at: string
  tags: string[]
  comments_count: number
  likes: number
}
export type PartialPosts = Partial<Posts>

export type SeriesPost = {
  id: string
  post: {
    id: string
    title: string
    url_slug: string
    user: {
      id: string
      username: string
    }
  }
}

export interface LinkedPosts {
  previous: LinkedPost | null
  next: LinkedPost | null
}

export interface LinkedPost {
  id: string
  title: string
  url_slug: string
  user: {
    id: string
    username: string
  }
}

export interface SinglePost {
  id: string
  title: string
  released_at: string
  updated_at: string
  tags: string[]
  body: string
  short_description: string
  is_markdown: boolean
  is_private: boolean
  is_temp: boolean
  thumbnail: string | null
  url_slug: string
  user: {
    id: string
    username: string
    profile: {
      id: string
      display_name: string
      thumbnail: string
      short_bio: string
      profile_links: ProfileLinks
    }
    velog_config: {
      title: string
    }
  }
  comments: Comment[]
  comments_count: number
  series: {
    id: string
    name: string
    url_slug: string
    series_posts: SeriesPost[]
  } | null
  liked: boolean
  likes: number
  linked_posts: LinkedPosts
}

export interface CommentWithReplies {
  id: string
  replies: Comment[]
}

export interface Stats {
  total: number
  count_by_day: {
    count: number
    day: string
  }[]
}

export type GetTrendingPostsResponse = {
  trendingPosts: Posts[]
}

export type GetRecommendedPostResponse = {
  post: {
    recommended_posts: Posts[]
  }
}

export type ReadPostForEditResponse = {
  post: {
    id: string
    title: string
    tags: string[]
    body: string
    short_description: string
    is_markdown: boolean
    is_private: boolean
    is_temp: boolean
    thumbnail: string | null
    url_slug: string
    series: {
      id: string
      name: string
    } | null
    updated_at: string
    user: {
      id: string
    }
  }
}

export type GetLastPostHistoryResult = {
  lastPostHistory: {
    id: string
    title: string
    body: string
    created_at: string
    is_markdown: boolean
  }
}

export type WritePostResponse = {
  writePost: {
    id: string
    user: {
      id: string
      username: string
    }
    url_slug: string
  }
}

export type EditPostResult = {
  editPost: SinglePost
}

export type SearchPostsResponse = {
  searchPosts: {
    posts: Posts[]
    count: number
  }
}

export type CreatePostHistoryResponse = {
  createPostHistory: {
    id: string
    user: {
      id: string
      username: string
    }
    url_slug: string
  }
}

export type PostViewResponse = {
  postView: boolean
}

export type GetReadingListResponse = {
  readingList: Posts[]
}
