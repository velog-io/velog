export interface CommentServiceInterface {
  count(postId: string): Promise<number>
}
