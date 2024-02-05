import marked from 'marked'
import { format } from 'date-fns'

export const commentTemplate = ({
  postWriter,
  username,
  optimizeUserImage, // optimizeImage 함수를 적용 시킨 결과를 인자로 넘길 것
  urlSlug,
  unsubscribeToken,
  postTitle,
  comment,
  commentId,
}: commentTemplateArgs) => {
  const commentHtml = marked.parse(comment.replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, ''))
  const postLink = `https://velog.io/@${postWriter}/${urlSlug}?comment_id=${commentId}`
  const unsubscribeUrl = `https://v2.velog.io/api/v2/common/email/unsubscribe?token=${unsubscribeToken}`

  return `
<a href="https://velog.io"
  ><img
    src="https://images.velog.io/email-logo.png"
    style="display: block; width: 128px; margin: 0 auto; margin-bottom: 1rem;"
/></a>
<div style="max-width: 100%; width: 600px; margin: 0 auto;">
  <div style="font-weight: 400; margin: 0; font-size: 1.25rem; color: #868e96;">
    포스트에 새 댓글이 달렸습니다.
  </div>
  <div style="margin-top: 0.5rem;">
    <a
      href="${postLink}"
      style="color: #495057; text-decoration: none; font-weight: 600; font-size: 1.125rem;"
      >${postTitle}</a
    >
  </div>
  <div style="font-weight: 400; margin-top: 0.5rem; font-size: 1.75rem;"></div>
  <div
    style="width: 100%; height: 1px; background: #e9ecef; margin-top: 2rem; margin-bottom: 2rem;"
  ></div>
  <div style="display:-webkit-flex;display:-ms-flexbox;display:flex;">
    <div>
      <a href="https://velog.io/@${username}">
        <img
          style="height: 64px; width: 64px; display: block; border-radius: 32px;"
          src="${optimizeUserImage}"
        />
      </a>
    </div>
    <div style="flex: 1; margin-left: 1.5rem; color: #495057;">
      <div style="margin-bottom: 0.5rem;">
        <a
          href="https://velog.io/@${username}"
          style="text-decoration: none; color: #212529; font-weight: 600;"
          >${username}</a
        >
      </div>
      <div style="margin: 0; color: #495057;">
        ${commentHtml}
      </div>
      <div style="font-size: 0.875rem; color: #adb5bd; margin-top: 1.5rem">
        ${format(new Date(), 'yyyy년 MM월 dd일')}
      </div>
      <a
        href="${postLink}"
        style="outline: none; border: none; background: #845ef7; color: white; padding-top: 0.5rem; padding-bottom: 0.5rem; font-size: 1rem; font-weight: 600; display: inline-block; background: #845ef7; padding-left: 1rem; padding-right: 1rem; align-items: center; margin-top: 1rem; border-radius: 4px; text-decoration: none;"
        >답글 달기</a
      >
    </div>
  </div>
  <div
    style="width: 100%; height: 1px; background: #e9ecef; margin-top: 4rem; margin-bottom: 1rem;"
  ></div>
  <div style="font-size: 0.875rem; color: #adb5bd; font-style: italic;">
    댓글 알림을 이메일로 수신하는 것을 원하지 않는다면 이
    <a href="${unsubscribeUrl}" style="color: inherit">링크</a>를 눌러주세요.
  </div>
</div>
<div>
  <br />
  <br />
  <br />
  velog | contact@velog.io
</div>
  `
}

type commentTemplateArgs = {
  postWriter: string
  username: string
  optimizeUserImage: string | null
  urlSlug: string
  unsubscribeToken: string
  postTitle: string
  comment: string
  commentId: string
}
