import { useRouter } from 'next/router'

export const useUrlSlug = () => {
  const router = useRouter()

  const { query } = router

  const pageUrlSlug = Array.isArray(query.pageUrlSlug) ? query.pageUrlSlug.join('/') : '/'
  const bookUrlSlug = `/${query.username}/${query.bookTitle}`
  const username = `/${query.username}`
  const fullUrlSlug = `${bookUrlSlug}/${pageUrlSlug}`

  return { bookUrlSlug, pageUrlSlug, fullUrlSlug, username }
}
