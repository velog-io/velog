import { PostService } from "@services/postService/postService";

describe("PostService", () => {
  const postService = new PostService();
  it("should be defined", () => {
    expect(postService).toBeDefined();
  });
});
